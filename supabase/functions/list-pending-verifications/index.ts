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
    const { page = 1, perPage = 500, filter = 'pending' } = await req.json();

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    const { data: listData, error: listError } = await supabaseAdmin.auth.admin.listUsers({
      page,
      perPage,
    });

    if (listError) {
      return new Response(
        JSON.stringify({ success: false, error: listError.message }),
        {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        },
      );
    }

    let users = listData.users;

    if (filter === 'pending') {
      users = users.filter((u) => !u.email_confirmed_at);
    } else if (filter === 'verified') {
      users = users.filter((u) => !!u.email_confirmed_at);
    }

    const mapped = users.map((u) => ({
      id: u.id,
      email: u.email,
      email_confirmed_at: u.email_confirmed_at,
      created_at: u.created_at,
      last_sign_in_at: u.last_sign_in_at,
      username: u.user_metadata?.username || u.raw_user_meta_data?.username || null,
      provider: u.app_metadata?.provider || 'email',
    }));

    return new Response(
      JSON.stringify({
        success: true,
        users: mapped,
        total: mapped.length,
        page,
        perPage,
      }),
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
