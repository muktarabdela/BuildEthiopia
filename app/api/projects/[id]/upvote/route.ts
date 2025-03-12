import { NextResponse } from "next/server";
import { requireAuth, supabase } from "@/lib/supabase";

// get /api/projects/[id]/upvote get upvote for a project
export async function GET(request, { params }) {
  try {
    await requireAuth();

    const { data, error } = await supabase
      .from("Upvotes")
      .select("id", { count: "exact" })
      .eq("project_id", params.id)
      .single();

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
export async function POST(request, { params }) {
  const { user_id, project_id } = req.body;
  if (!user_id || !project_id) {
    return NextResponse.json(
      { error: "user_id and project_id are required" },
      { status: 400 }
    );
  }
  try {
    await requireAuth();

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
export async function DELETE(request, { params }) {
  try {
    await requireAuth();

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
