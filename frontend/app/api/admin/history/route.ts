import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

export const GET = async (request: Request) => {
  try {
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get("projectId");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    let query = supabase
      .from("featured_projects_history")
      .select("*")
      .order("featured_at", { ascending: false })
      .range((page - 1) * limit, page * limit - 1);

    if (projectId) {
      query = query.eq("project_id", projectId);
    }

    const { data, error } = await query;

    if (error) throw error;
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch featured history" },
      { status: 500 }
    );
  }
};
