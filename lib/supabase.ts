import { createClient as createSupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase = createSupabaseClient(supabaseUrl, supabaseKey);

export const createClient = () => {
  return createSupabaseClient(supabaseUrl, supabaseKey);
};

export async function requireAuth() {
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (error || !session) {
    throw new Error("Unauthorized");
  }

  return session;
}

export async function requireRole(allowedRoles: string[]) {
  const session = await requireAuth();

  // Fetch user profile from Supabase
  const { data: profile, error } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", session.user.id)
    .single();

  if (error || !profile || !allowedRoles.includes(profile.role)) {
    throw new Error("Unauthorized");
  }

  return session;
}
