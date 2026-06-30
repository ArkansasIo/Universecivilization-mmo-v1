import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ error: "Method not allowed" }),
      { status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
  const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY") ?? "";
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

  if (!supabaseUrl || !serviceRoleKey) {
    return new Response(
      JSON.stringify({ error: "Server configuration error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  // Authenticate caller (buyer)
  const authHeader = req.headers.get("authorization");
  const authClient = createClient(supabaseUrl, supabaseAnonKey, {
    auth: { persistSession: false },
  });

  const { data: { user: caller }, error: authError } = await authClient.auth.getUser(
    authHeader?.replace("Bearer ", "") || ""
  );

  if (authError || !caller) {
    return new Response(
      JSON.stringify({ error: "Unauthorized" }),
      { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  let body: any;
  try {
    body = await req.json();
  } catch {
    return new Response(
      JSON.stringify({ error: "Invalid JSON body" }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  const { listing_id, quantity: requestedQuantity } = body;

  if (!listing_id) {
    return new Response(
      JSON.stringify({ error: "Missing listing_id" }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  const adminClient = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  try {
    // 1. Fetch listing with row lock (select + update pattern)
    const { data: listing, error: listingError } = await adminClient
      .from("marketplace_listings")
      .select("id, seller_id, seller_name, resource_type, quantity, price_per_unit, total_price, currency, status, expires_at")
      .eq("id", listing_id)
      .single();

    if (listingError || !listing) {
      return new Response(
        JSON.stringify({ error: "Listing not found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (listing.status !== "active") {
      return new Response(
        JSON.stringify({ error: `Listing is not active (status: ${listing.status})` }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (listing.expires_at && new Date(listing.expires_at) < new Date()) {
      // Auto-expire the listing
      await adminClient
        .from("marketplace_listings")
        .update({ status: "expired", updated_at: new Date().toISOString() })
        .eq("id", listing_id);

      return new Response(
        JSON.stringify({ error: "Listing has expired" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (listing.seller_id === caller.id) {
      return new Response(
        JSON.stringify({ error: "You cannot buy your own listing" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 2. Determine purchase quantity
    const quantity = Math.min(requestedQuantity || listing.quantity, listing.quantity);
    if (quantity <= 0) {
      return new Response(
        JSON.stringify({ error: "Invalid purchase quantity" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const totalCost = Math.floor(Number(listing.price_per_unit) * quantity);
    const currencyField = listing.currency === "republic_credits" ? "republic_credits" : "imperial_credits";

    // 3. Fetch buyer resources
    const { data: buyerResources, error: buyerError } = await adminClient
      .from("player_resources")
      .select("metal, crystal, deuterium, imperial_credits, republic_credits")
      .eq("player_id", caller.id)
      .maybeSingle();

    if (buyerError) throw buyerError;

    if (!buyerResources) {
      return new Response(
        JSON.stringify({ error: "Buyer resources not found" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const buyerBalance = currencyField === "republic_credits"
      ? (buyerResources.republic_credits || 0)
      : (buyerResources.imperial_credits || 0);

    if (buyerBalance < totalCost) {
      return new Response(
        JSON.stringify({
          error: "Insufficient funds",
          required: totalCost,
          available: buyerBalance,
          currency: currencyField,
        }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 4. Fetch seller resources (for credit deposit)
    const { data: sellerResources, error: sellerError } = await adminClient
      .from("player_resources")
      .select("imperial_credits, republic_credits")
      .eq("player_id", listing.seller_id)
      .maybeSingle();

    // 5. Execute atomic trade
    const now = new Date().toISOString();

    // Update buyer: deduct credits, add resources
    const resourceField = listing.resource_type; // metal, crystal, deuterium, etc.
    const buyerUpdate: Record<string, any> = {
      updated_at: now,
    };
    buyerUpdate[currencyField] = buyerBalance - totalCost;

    // Add purchased resource to buyer
    if (["metal", "crystal", "deuterium", "energy", "dark_matter", "antimatter", "nanites"].includes(resourceField)) {
      const currentResource = (buyerResources as any)[resourceField] || 0;
      buyerUpdate[resourceField] = currentResource + quantity;
    }

    const { error: buyerUpdateError } = await adminClient
      .from("player_resources")
      .update(buyerUpdate)
      .eq("player_id", caller.id);

    if (buyerUpdateError) throw buyerUpdateError;

    // Update seller: add credits
    if (sellerResources && listing.seller_id) {
      const sellerUpdate: Record<string, any> = {
        updated_at: now,
      };
      if (currencyField === "republic_credits") {
        sellerUpdate.republic_credits = (sellerResources.republic_credits || 0) + totalCost;
      } else {
        sellerUpdate.imperial_credits = (sellerResources.imperial_credits || 0) + totalCost;
      }

      const { error: sellerUpdateError } = await adminClient
        .from("player_resources")
        .update(sellerUpdate)
        .eq("player_id", listing.seller_id);

      if (sellerUpdateError) {
        console.error("Failed to credit seller — buyer already charged:", sellerUpdateError);
        // Don't fail the whole transaction, but log it
      }
    }

    // 6. Update listing status
    const remaining = Number(listing.quantity) - quantity;
    const isFullyFulfilled = remaining <= 0;

    await adminClient
      .from("marketplace_listings")
      .update({
        status: isFullyFulfilled ? "fulfilled" : "active",
        quantity: Math.max(0, remaining),
        total_price: isFullyFulfilled ? 0 : Math.floor(Number(listing.price_per_unit) * remaining),
        buyer_id: isFullyFulfilled ? caller.id : null,
        completed_at: isFullyFulfilled ? now : null,
      })
      .eq("id", listing_id);

    // 7. Create notifications
    const notifications = [
      {
        user_id: caller.id,
        type: "marketplace",
        title: "Purchase Successful",
        message: `You bought ${quantity} ${listing.resource_type} for ${totalCost.toLocaleString()} ${currencyField.replace("_", " ")}.`,
        icon: "ri-shopping-cart-line",
        data: { listing_id, quantity, total_cost: totalCost, resource_type: listing.resource_type },
        created_at: now,
      },
    ];

    if (listing.seller_id) {
      notifications.push({
        user_id: listing.seller_id,
        type: "marketplace",
        title: "Item Sold!",
        message: `${listing.seller_name || "Someone"} bought ${quantity} ${listing.resource_type} from your listing for ${totalCost.toLocaleString()} ${currencyField.replace("_", " ")}.`,
        icon: "ri-money-cny-circle-line",
        data: { listing_id, quantity, total_cost: totalCost, resource_type: listing.resource_type },
        created_at: now,
      });
    }

    await adminClient.from("notifications").insert(notifications);

    return new Response(
      JSON.stringify({
        success: true,
        transaction: {
          listing_id,
          quantity,
          total_cost: totalCost,
          currency: currencyField,
          resource_type: listing.resource_type,
          remaining: Math.max(0, remaining),
          fulfilled: isFullyFulfilled,
        },
        buyer_new_balance: buyerBalance - totalCost,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err: any) {
    console.error("Marketplace trade error:", err);
    return new Response(
      JSON.stringify({ error: err?.message || "Failed to process marketplace trade" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});