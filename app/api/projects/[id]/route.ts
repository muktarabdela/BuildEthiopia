import { NextResponse } from "next/server";
import { requireAuth, supabase } from "@/lib/supabase";
import { z } from "zod";

const projectSchema = z.object({
  title: z.string().min(3).max(100),
  description: z.string().min(10).max(500),
  category: z.string().min(3).max(50),
  post_content: z.string().min(10),
  images: z.array(z.string().url()).max(5),
  logo_url: z.string().url().optional(),
  youtube_video_url: z.string().url().optional(),
  tech_stack: z.array(z.string().min(1)).max(10),
  github_url: z.string().url().optional(),
  live_url: z.string().url().optional(),
  is_open_source: z.boolean(),
});

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
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await requireAuth(req);
    const projectId = params.id;

    // Verify project ownership
    const { data: project, error: projectError } = await supabase
      .from("projects")
      .select("developer_id")
      .eq("id", projectId)
      .single();

    if (projectError || !project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    if (project.developer_id !== session.user.id) {
      return NextResponse.json(
        { error: "Unauthorized to edit this project" },
        { status: 403 }
      );
    }

    // Validate input
    const updateData = await req.json();
    const validatedData = projectSchema.parse(updateData);

    // Update project
    const { data: updatedProject, error: updateError } = await supabase
      .from("projects")
      .update({
        ...validatedData,
        updated_at: new Date().toISOString(),
      })
      .eq("id", projectId)
      .select();

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 400 });
    }

    return NextResponse.json(updatedProject, { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
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
