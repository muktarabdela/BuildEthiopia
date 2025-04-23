import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";
import { getProjects, updateFeaturedStatus } from "@/lib/api/admin";

export interface Project {
  id: string;
  title: string;
  description: string;
  featured: boolean;
  developer: {
    id: string;
    name: string;
  };
  // ... other fields
}

export const GET = async () => {
  try {
    const projects = await getProjects();
    return NextResponse.json(projects);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch projects" },
      { status: 500 }
    );
  }
};

export const POST = async () => {
  return NextResponse.json(
    { error: "Method not implemented" },
    { status: 501 }
  );
};

export const PATCH = async (request: Request) => {
  try {
    const { projectId, featured } = await request.json();

    if (!projectId || typeof featured !== "boolean") {
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 }
      );
    }

    if (featured) {
      // Insert into featured_projects and log history
      const [{ data, error }, { error: historyError }] = await Promise.all([
        supabase.from("featured_projects").upsert({
          project_id: projectId,
          featured_at: new Date().toISOString(),
          expires_at: new Date(
            Date.now() + 7 * 24 * 60 * 60 * 1000
          ).toISOString(),
        }),
        supabase.from("featured_projects_history").insert({
          project_id: projectId,
          // admin_id: adminId,
        }),
      ]);

      if (error || historyError) throw error || historyError;
      return NextResponse.json(data);
    } else {
      // Remove from featured_projects and update history
      const [{ error }, { error: historyError }] = await Promise.all([
        supabase.from("featured_projects").delete().eq("project_id", projectId),
        supabase
          .from("featured_projects_history")
          .update({ unfeatured_at: new Date().toISOString() })
          .eq("project_id", projectId)
          .is("unfeatured_at", null),
      ]);

      if (error || historyError) throw error || historyError;
      return NextResponse.json({ success: true });
    }
  } catch (error) {
    console.error("Error updating featured status:", error);
    return NextResponse.json(
      { error: "Failed to update featured status" },
      { status: 500 }
    );
  }
};
