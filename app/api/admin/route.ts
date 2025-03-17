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

    const updatedProject = await updateFeaturedStatus(projectId, featured);
    return NextResponse.json(updatedProject);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update featured status" },
      { status: 500 }
    );
  }
};
