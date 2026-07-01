
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const TEMP_SECRET = 'bootstrap-root-2026';

Deno.serve(async (req) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  };

  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return new Response(
      JSON.stringify({ success: false, error: 'Invalid JSON body.' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  const { username, email, password, full_name, secret } = body as { username?: string; email?: string; password?: string; full_name?: string; secret?: string };

  if (secret !== TEMP_SECRET) {
    return new Response(
      JSON.stringify({ success: false, error: 'Invalid bootstrap secret.' }),
      { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  if (!username || !email || !password) {
    return new Response(
      JSON.stringify({ success: false, error: 'username, email, and password are required.' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

  if (!supabaseUrl || !serviceRoleKey) {
    return new Response(
      JSON.stringify({ success: false, error: 'Server config error — missing env vars.' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const { data: existingAdmins, error: checkError } = await supabaseAdmin
    .from('admin_users')
    .select('id')
    .limit(1);

  if (checkError) {
    return new Response(
      JSON.stringify({ success: false, error: `DB check: ${checkError.message}` }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  if (existingAdmins && existingAdmins.length > 0) {
    return new Response(
      JSON.stringify({ success: false, error: 'Root admin already exists.' }),
      { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  let authUserId: string | null = null;

  const { data: createData, error: createError } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { username, full_name: full_name ?? username, role: 'super_admin' },
  });

  if (createError) {
    if (createError.message?.includes('already') || createError.message?.includes('taken') || createError.status === 422) {
      const { data: listData } = await supabaseAdmin.auth.admin.listUsers();
      const found = listData?.users?.find((u: { email?: string }) => u.email === email);
      if (found) authUserId = found.id;
    }
    if (!authUserId) {
      return new Response(
        JSON.stringify({ success: false, error: `Auth: ${createError.message}` }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
  } else {
    authUserId = createData?.user?.id ?? null;
  }

  if (!authUserId) {
    return new Response(
      JSON.stringify({ success: false, error: 'Auth user ID missing after creation.' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  const { error: insertError } = await supabaseAdmin
    .from('admin_users')
    .insert({
      id: authUserId,
      username,
      email,
      full_name: full_name ?? username,
      role: 'super_admin',
      is_super_admin: true,
      is_active: true,
    });

  if (insertError) {
    if (!insertError.message?.includes('duplicate') && insertError.code !== '23505') {
      return new Response(
        JSON.stringify({ success: false, error: `Admin insert: ${insertError.message}` }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
  }

  try {
    await supabaseAdmin.from('admin_logs').insert({
      admin_id: authUserId,
      action: 'bootstrap_root_admin',
      target_table: 'admin_users',
      target_id: authUserId,
      details: { note: `Root admin "${username}" bootstrapped` },
    });
  } catch { /* non-critical */ }

  return new Response(
    JSON.stringify({
      success: true,
      message: 'Root admin created successfully.',
      admin: { id: authUserId, username, email, role: 'super_admin' },
    }),
    { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
});
