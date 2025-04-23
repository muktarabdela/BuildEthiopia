import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// Helper to calculate date ranges
const getDateRange = (weeksBack: number) => {
  const now = new Date();
  const start = new Date(now);
  start.setDate(now.getDate() - weeksBack * 7);
  return { start, end: now };
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 6;

  try {
    const { data, error } = await supabase
      .from("featured_projects_history")
      .select(
        `
        project:projects(
          *,
          developer:profiles!projects_developer_id_fkey(id, name, profile_picture, username)
        ),
        featured_at,
        unfeatured_at
      `
      )
      .order("featured_at", { ascending: false })
      .range((page - 1) * limit, page * limit - 1);

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching featured projects history:", error);
    return NextResponse.json(
      { error: "Failed to fetch featured projects history" },
      { status: 500 }
    );
  }
}
