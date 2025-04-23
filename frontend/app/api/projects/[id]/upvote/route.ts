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
  context: { params: Promise<{ id: string | string[] }> }
) {
  try {
    const resolvedParams = await context.params;

    // Check if the request body is empty
    const body = await request.text();
    if (!body) {
      return NextResponse.json(
        { error: "Request body is required" },
        { status: 400 }
      );
    }

    // Attempt to parse the JSON
    let user_id: string, project_id: string;
    try {
      const jsonBody = JSON.parse(body);
      user_id = jsonBody.user_id;
      project_id = jsonBody.project_id;
    } catch (parseError) {
      return NextResponse.json(
        { error: "Invalid JSON format" },
        { status: 400 }
      );
    }

    if (!user_id || !project_id) {
      return NextResponse.json(
        { error: "user_id and project_id are required" },
        { status: 400 }
      );
    }

    await requireAuth(request);

    // Check if the upvote already exists
    const { data: existingUpvote, error: checkError } = await supabase
      .from("upvotes")
      .select("*")
      .eq("user_id", user_id)
      .eq("project_id", project_id)
      .maybeSingle();

    if (checkError) throw checkError;

    // If upvote already exists, return success
    if (existingUpvote) {
      return NextResponse.json({ message: "Project already upvoted" });
    }

    // Insert the upvote record
    const { data: upvoteData, error: upvoteError } = await supabase
      .from("upvotes")
      .insert([{ user_id, project_id }]);

    if (upvoteError) throw upvoteError;

    // Update the project's upvotes_count
    const { data: projectData, error: projectError } = await supabase.rpc(
      "increment_project_upvotes_count",
      { p_project_id: resolvedParams.id }
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
  context: { params: Promise<{ id: string | string[] }> }
) {
  try {
    const resolvedParams = await context.params;
    const { user_id } = await request.json();

    if (!user_id) {
      return NextResponse.json(
        { error: "user_id is required" },
        { status: 400 }
      );
    }

    await requireAuth(request);

    // First, check if the upvote exists
    const { data: existingUpvote, error: checkError } = await supabase
      .from("upvotes")
      .select("*")
      .eq("project_id", resolvedParams.id)
      .eq("user_id", user_id)
      .maybeSingle();

    if (checkError) throw checkError;

    if (!existingUpvote) {
      return NextResponse.json({ error: "Upvote not found" }, { status: 404 });
    }

    // Delete specific user's upvote for this project
    const { data, error: deleteError } = await supabase
      .from("upvotes")
      .delete()
      .eq("project_id", resolvedParams.id)
      .eq("user_id", user_id);

    if (deleteError) throw deleteError;

    // Decrement the project's upvotes_count
    const { data: projectData, error: projectError } = await supabase.rpc(
      "decrement_project_upvotes_count",
      { p_project_id: resolvedParams.id }
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
