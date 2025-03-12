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
export async function POST(request: Request, { params }) {
  const { user_id, project_id } = await request.json();
  if (!user_id || !project_id) {
    return NextResponse.json(
      { error: "user_id and project_id are required" },
      { status: 400 }
    );
  }
  try {
    await requireAuth(request);

    const { data, error } = await supabase
      .from("Upvotes")
      .insert([{ user_id, project_id }]);
    if (error) throw error;

    return NextResponse.json({ message: "Project upvoted successfully" });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to upvote project" },
      { status: error.message === "Unauthorized" ? 403 : 500 }
    );
  }
}

// DELETE /api/projects/[id]/upvote - Remove upvote from a project
export async function DELETE(request: Request, { params }) {
  try {
    await requireAuth(request);

    const { error } = await supabase.rpc("handle_remove_upvote", {
      project_id: params.id,
    });

    if (error) throw error;

    return NextResponse.json({ message: "Upvote removed successfully" });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to remove upvote" },
      { status: error.message === "Unauthorized" ? 403 : 500 }
    );
  }
}
