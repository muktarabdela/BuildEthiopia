import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";
import { getProjects } from "@/lib/api/admin";

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

export const updateFeaturedStatus = async (
  projectId: string,
  featured: boolean
) => {
  const { error } = await supabase
    .from("projects")
    .update({ featured })
    .eq("id", projectId);

  if (error) throw error;
};
