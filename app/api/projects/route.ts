import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const {
      title,
      description,
      images,
      logo_url,
      developer_id,
      github_url,
      live_url,
    } = await request.json();

    // Validate required fields
    if (!title || !description || !developer_id) {
      return NextResponse.json(
        { error: "Title, description, and developer ID are required." },
        { status: 400 }
      );
    }

    // Insert the project into the database
    const { data, error } = await supabase.from("projects").insert([
      {
        title,
        description,
        images,
        logo_url,
        developer_id,
        github_url,
        live_url,
      },
    ]);

    if (error) {
      console.error("Error inserting project:", error);
      return NextResponse.json(
        { error: error.message || "Failed to create project." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: "Project created successfully.",
      project: data,
    });
  } catch (error) {
    console.error("Error in project submission:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
