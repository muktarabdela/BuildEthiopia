import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    const user = await request.json();

    if (!user?.id) {
      return NextResponse.json({ error: "Invalid user data" }, { status: 400 });
    }

    // Check if profile exists
    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (!profile) {
      // Insert new profile
      const { error } = await supabase.from("profiles").insert([
        {
          id: user.id,
          name:
            user.user_metadata.full_name ||
            user.user_metadata.name ||
            user.email.split("@")[0],
          email: user.email,
          username: user.user_metadata.user_name || user.email.split("@")[0],
          profile_picture: user.user_metadata.avatar_url,
          updated_at: new Date().toISOString(),
        },
      ]);

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
