import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function requireAuth(req: Request) {
  // get the session from the request headers
  const session = req.headers.get("Authorization")?.split("Bearer ")[1];

  // console.log("Session check:", session);
  if (!session) {
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
