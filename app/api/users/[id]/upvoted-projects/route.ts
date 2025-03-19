import { NextResponse } from "next/server";
import { requireAuth, supabase } from "@/lib/supabase";

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await requireAuth(request);

    // Await params before accessing its properties
    const resolvedParams = await context.params;

    if (!resolvedParams?.id) {
      throw new Error("User ID is required");
    }

    // First get the upvote project IDs
    const { data, error } = await supabase
      .from("upvotes")
      .select("project_id")
      .eq("user_id", resolvedParams.id);

    if (error) throw error;
    // If no upvote projects, return empty array
    if (!data || data.length === 0) {
      return NextResponse.json({ projects: [] });
    }
    // Get the project details with developer information
    const { data: projects, error: projectsError } = await supabase
      .from("projects")
      .select(
        `
        *,
        developer:profiles!projects_developer_id_fkey(
          id,
          name,
          username,
          profile_picture
        )
      `
      )
      .in(
        "id",
        data.map((sp) => sp.project_id)
      );
    if (projectsError) throw projectsError;
    // If no projects, return empty array
    return NextResponse.json({ projects });
  } catch (error: any) {
    console.error("Error fetching upvoted projects:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch upvoted projects" },
      { status: error.message === "Unauthorized" ? 403 : 500 }
    );
  }
}
