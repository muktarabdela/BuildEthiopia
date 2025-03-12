import { NextResponse } from "next/server";
import { requireAuth, supabase } from "@/lib/supabase";

// get /api/projects/[id]/upvote get upvote for a project
export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> } // params is a Promise
) {
  try {
    await requireAuth(request);

    // Await params before accessing its properties
    const resolvedParams = await context.params;
    console.log("Resolved params:", resolvedParams);
    if (!resolvedParams?.id) {
      throw new Error("Project ID is required");
    }

    const { data, error } = await supabase
      .from("upvotes")
      .select("id", { count: "exact" })
      .eq("project_id", resolvedParams.id) // params.id should now be properly awaited
      .maybeSingle(); // Allows empty results

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch upvote" },
      { status: error.message === "Unauthorized" ? 403 : 500 }
    );
  }
}

// POST /api/projects/[id]/upvote - Upvote a project

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { user_id, project_id } = await request.json();

    if (!user_id || !project_id) {
      return NextResponse.json(
        { error: "user_id and project_id are required" },
        { status: 400 }
      );
    }

    // Ensure the request is authenticated
    await requireAuth(request);

    // Insert the upvote record
    const { data: upvoteData, error: upvoteError } = await supabase
      .from("upvotes")
      .insert([{ user_id, project_id }]);

    if (upvoteError) throw upvoteError;

    // Update the project's upvotes_count using the stored procedure
    const { data: projectData, error: projectError } = await supabase.rpc(
      "increment_project_upvotes_count",
      { p_project_id: project_id }
    );

    if (projectError) throw projectError;

    return NextResponse.json({ message: "Project upvoted successfully" });
  } catch (error: any) {
    console.error("Error adding upvote:", error);
    return NextResponse.json(
      { error: error.message || "Failed to upvote project" },
      { status: error.message === "Unauthorized" ? 403 : 500 }
    );
  }
}

// DELETE /api/projects/[id]/upvote - Remove upvote from a project

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Ensure the request is authenticated
    await requireAuth(request);

    // Delete the upvote record for the specified project and current user.
    // You might need to also check for the specific user if your logic requires it.
    // For this example, we're deleting based solely on project_id.
    const { data, error: deleteError } = await supabase
      .from("upvotes")
      .delete()
      .eq("project_id", params.id);

    if (deleteError) throw deleteError;

    // Decrement the project's upvotes_count using the stored procedure.
    const { data: projectData, error: projectError } = await supabase.rpc(
      "decrement_project_upvotes_count",
      { p_project_id: params.id }
    );

    if (projectError) throw projectError;

    return NextResponse.json({ message: "Upvote removed successfully" });
  } catch (error: any) {
    console.error("Error removing upvote:", error);
    return NextResponse.json(
      { error: error.message || "Failed to remove upvote" },
      { status: error.message === "Unauthorized" ? 403 : 500 }
    );
  }
}
