import { supabase } from "@/lib/supabase";
import { requireAuth } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Await params to ensure they're resolved
    const { id } = await params;

    // Fetch profile from Supabase
    const { data: profile, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("username", id)
      .maybeSingle();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    // Return profile data
    return NextResponse.json(profile, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Await params to ensure they're resolved
    const { id } = await params;
    const session = await requireAuth(req);

    // Verify if the requesting user is the profile owner
    if (session.user.id !== id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { bio, github_url, linkedin_url, telegram_url, profile_picture } =
      await req.json();

    const { error } = await supabase
      .from("profiles")
      .update({
        bio,
        github_url,
        linkedin_url,
        telegram_url,
        profile_picture,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(
      { message: "Profile updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
