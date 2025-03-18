import { NextResponse } from "next/server";
import { requireAuth, supabase } from "@/lib/supabase";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await requireAuth(request);

    const { data, error } = await supabase
      .from("upvoted_projects")
      .select("project_id")
      .eq("user_id", params.id);

    if (error) throw error;

    return NextResponse.json({ projects: data.map((item) => item.project_id) });
  } catch (error: any) {
    console.error("Error fetching upvoted projects:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch upvoted projects" },
      { status: error.message === "Unauthorized" ? 403 : 500 }
    );
  }
}
