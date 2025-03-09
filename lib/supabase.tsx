import { createClient as createSupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
//Argument of type 'string | undefined' is not assignable to parameter of type 'string'. Type 'undefined' is not assignable to type 'strin

export const supabase = createSupabaseClient(supabaseUrl, supabaseKey);

export const createClient = () => {
    return createSupabaseClient(supabaseUrl, supabaseKey);
};

export async function requireAuth() {
    const supabase = createClient();
    const { data: { session }, error } = await supabase.auth.getSession();

    if (error || !session) {
        throw new Error('Unauthorized');
    }

    return session;
}

export async function requireRole(allowedRoles: string[]) {
    const supabase = createClient();
    const session = await requireAuth();

    const { data: profile, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .single();

    if (error || !profile || !allowedRoles.includes(profile.role)) {
        throw new Error('Unauthorized');
    }

    return session;
}