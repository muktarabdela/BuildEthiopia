import { supabase } from "@/lib/supabase";

export async function POST(req, { params }) {
  const { id } = params;
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
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
    });
  }

  return new Response(
    JSON.stringify({ message: "Profile updated successfully" }),
    { status: 200 }
  );
}
