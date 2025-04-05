import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    const user = await request.json();

    if (!user?.id) {
      return NextResponse.json({ error: "Invalid user data" }, { status: 400 });
    }

    // Upsert the profile - this will update if exists, insert if not
    const { error } = await supabase.from("profiles").upsert(
      [
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
      ],
      { onConflict: "id" } // Specify which column to check for conflicts
    );

    if (error) {
      console.error("Profile upsert error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Callback route error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
