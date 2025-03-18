import { NextResponse } from "next/server";
import { requireAuth, supabase } from "@/lib/supabase";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await requireAuth(request);
    const { user_id } = await request.json();

    if (!session || !session.user || session.user.id !== user_id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { data, error } = await supabase
      .from("saved_projects")
      .upsert({
        user_id,
        project_id: params.id,
      })
      .select();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Error saving project:", error);
    return NextResponse.json(
      { error: error.message || "Failed to save project" },
      { status: error.message === "Unauthorized" ? 403 : 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await requireAuth(request);
    const { user_id } = await request.json();

    if (!session || !session.user || session.user.id !== user_id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { error } = await supabase
      .from("saved_projects")
      .delete()
      .eq("user_id", user_id)
      .eq("project_id", params.id);

    if (error) throw error;

    return NextResponse.json({ message: "Project unsaved successfully" });
  } catch (error: any) {
    console.error("Error unsaving project:", error);
    return NextResponse.json(
      { error: error.message || "Failed to unsave project" },
      { status: error.message === "Unauthorized" ? 403 : 500 }
    );
  }
}
