import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { getSession } from "@/lib/auth";

export async function requireAdmin(request: Request) {
  const session = await getSession(request);

  if (!session) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", session.user.id)
    .single();

  if (error || !profile || profile.role !== "admin") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return null;
}
