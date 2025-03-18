import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function requireAuth(req: Request) {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new Error("Unauthorized");
  }

  const token = authHeader.split(" ")[1];

  // Verify the token with Supabase
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser(token);
  // console.log("User data:", user);
  if (error || !user) {
    console.error("Error verifying token:", error);
    throw new Error("Unauthorized");
  }

  return { user };
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
