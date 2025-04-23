import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

// CREATE TABLE projects (
//   id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,

//   -- Basic Project Information
//   title text NOT NULL, -- Project title
//   description text NOT NULL, -- Detailed project description
//   category text NOT NULL, -- Category of the project (e.g., Web App, Mobile App, AI, Game)
//   post_content text NOT null,
//   -- Media and Links
//   images text[], -- Array to store multiple image URLs
//   logo_url text, -- Project logo URL
//   youtube_video_url text, -- Optional YouTube video link showcasing the project

//   -- Technical Details
//   tech_stack text[], -- Array to store technologies used (e.g., ["React", "Node.js", "PostgreSQL"])
//   github_url text, -- GitHub repository link
//   live_url text, -- Deployed live project link

//   -- User & Engagement Data
//   developer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL, -- Project creator

//   -- Additional Metadata
//   featured BOOLEAN DEFAULT FALSE, -- Mark if the project is featured
//   is_open_source BOOLEAN DEFAULT TRUE, -- Flag to indicate if the project is open-source

//   -- Timestamps
//   created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
//   updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
// );

export async function POST(request: Request) {
  try {
    const {
      title,
      description,
      category,
      post_content,
      tech_stack,
      youtube_video_url,

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
        category,
        post_content,
        tech_stack,
        youtube_video_url,
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
