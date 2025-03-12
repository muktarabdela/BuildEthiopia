import { NextResponse } from "next/server";
import { requireAuth, supabase } from "@/lib/supabase";

// GET /api/projects/[id] - Get a single project
export async function GET(request, { params }) {
  try {
    const { data: project, error } = await supabase
      .from("projects")
      .select(
        `
        *,
        developer:profiles(name, github_url, linkedin_url, contact_visible),
        comments(
          id,
          content,
          created_at,
          user:profiles(name)
        )
      `
      )
      .eq("id", params.id)
      .single();

    if (error) throw error;
    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json(project);
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch project" },
      { status: 500 }
    );
  }
}

// PUT /api/projects/[id] - Update a project
export async function PUT(request, { params }) {
  try {
    const session = await requireAuth();
    const { title, description, github_url, live_url } = await request.json();


    // Check if user owns the project
    const { data: project } = await supabase
      .from("projects")
      .select("developer_id")
      .eq("id", params.id)
      .single();

    if (!project || project.developer_id !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { data: updatedProject, error } = await supabase
      .from("projects")
      .update({
        title,
        description,
        github_url,
        live_url,
        updated_at: new Date().toISOString(),
      })
      .eq("id", params.id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(updatedProject);
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update project" },
      { status: error.message === "Unauthorized" ? 403 : 500 }
    );
  }
}

// DELETE /api/projects/[id] - Delete a project
export async function DELETE(request, { params }) {
  try {
    const session = await requireAuth();

    // Check if user owns the project
    const { data: project } = await supabase
      .from("projects")
      .select("developer_id")
      .eq("id", params.id)
      .single();

    if (!project || project.developer_id !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { error } = await supabase
      .from("projects")
      .delete()
      .eq("id", params.id);

    if (error) throw error;

    return NextResponse.json({ message: "Project deleted successfully" });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to delete project" },
      { status: error.message === "Unauthorized" ? 403 : 500 }
    );
  }
}
