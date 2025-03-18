import { NextResponse } from "next/server";
import { requireAuth, supabase } from "@/lib/supabase";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await requireAuth(request);

    // First get the saved project IDs
    const { data: savedProjects, error: savedError } = await supabase
      .from("saved_projects")
      .select("project_id")
      .eq("user_id", params.id);

    if (savedError) throw savedError;

    // If no saved projects, return empty array
    if (!savedProjects || savedProjects.length === 0) {
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
        savedProjects.map((sp) => sp.project_id)
      );

    if (projectsError) throw projectsError;

    return NextResponse.json({ projects });
  } catch (error: any) {
    console.error("Error fetching saved projects:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch saved projects" },
      { status: error.message === "Unauthorized" ? 403 : 500 }
    );
  }
}
