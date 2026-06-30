import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  }

  try {
    const { user_id: userId } = await req.json();

    if (!userId || typeof userId !== 'string') {
      return new Response(
        JSON.stringify({ success: false, error: 'user_id is required.' }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        },
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    // Verify the caller is an admin by checking Authorization header
    const authHeader = req.headers.get('Authorization') || '';
    const anonKey = Deno.env.get('SUPABASE_ANON_KEY') || serviceRoleKey;

    // Verify admin identity by checking if the JWT belongs to an active admin
    let callerIsAdmin = false;
    if (authHeader.startsWith('Bearer ')) {
      const jwt = authHeader.slice(7);
      const verifier = createClient(supabaseUrl, anonKey, {
        auth: { autoRefreshToken: false, persistSession: false },
      });
      const { data: userData } = await verifier.auth.getUser(jwt);
      if (userData?.user) {
        const { data: adminRecord } = await supabaseAdmin
          .from('admin_users')
          .select('is_active, role')
          .eq('id', userData.user.id)
          .maybeSingle();
        callerIsAdmin = !!adminRecord && adminRecord.is_active;
      }
    }

    if (!callerIsAdmin) {
      return new Response(
        JSON.stringify({ success: false, error: 'Admin authorization required.' }),
        {
          status: 403,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        },
      );
    }

    // First check if user exists and is not already confirmed
    const { data: listData } = await supabaseAdmin.auth.admin.listUsers();
    const targetUser = listData?.users.find((u) => u.id === userId);

    if (!targetUser) {
      return new Response(
        JSON.stringify({ success: false, error: 'User not found.' }),
        {
          status: 404,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        },
      );
    }

    if (targetUser.email_confirmed_at) {
      return new Response(
        JSON.stringify({ success: false, error: 'This account is already verified.' }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        },
      );
    }

    // Force verify via admin API
    const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(userId, {
      email_confirm: true,
    });

    if (updateError) {
      return new Response(
        JSON.stringify({ success: false, error: updateError.message }),
        {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        },
      );
    }

    // Log admin action
    try {
      await supabaseAdmin.from('admin_logs').insert({
        admin_id: userData?.user?.id || null,
        action: 'force_verify_user',
        target_table: 'auth.users',
        target_id: userId,
        details: { email: targetUser.email, method: 'admin_api' },
      });
    } catch (_) {
      // Non-critical: log failure shouldn't block the operation
    }

    return new Response(
      JSON.stringify({ success: true, message: 'Account verified successfully.' }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      },
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({ success: false, error: err.message || 'Internal server error.' }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      },
    );
  }
});
