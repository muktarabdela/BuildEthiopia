import { supabase } from "@/lib/supabase";
import { requireAuth } from "@/lib/supabase";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

type Profile = {
  id: string;
  username: string;
  // Add other profile fields as needed
};

type Project = {
  id: string;
  title: string;
  description: string;
  images: string[];
  upvotes_count: number;
  comments_count: number;
  created_at: string;
};

type UpdateProfileRequest = {
  bio?: string;
  github_url?: string;
  linkedin_url?: string;
  telegram_url?: string;
  profile_picture?: string;
};

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string | string[] }> }
) {
  try {
    // Await params before accessing its properties
    const resolvedParams = await context.params;

    // Convert id to string if it's an array
    const id = Array.isArray(resolvedParams.id)
      ? resolvedParams.id[0]
      : resolvedParams.id;

    if (!id) {
      return NextResponse.json(
        { error: "Profile ID is required" },
        { status: 400 }
      );
    }

    // Fetch profile
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("username", id)
      .maybeSingle();

    if (profileError || !profile) {
      return NextResponse.json(
        { error: profileError?.message || "Profile not found" },
        { status: profileError ? 400 : 404 }
      );
    }

    // Fetch projects
    const { data: projects, error: projectsError } = await supabase
      .from("projects")
      .select(
        "id, title, description, images, upvotes_count, comments_count, created_at"
      )
      .eq("developer_id", profile.id);

    if (projectsError) {
      return NextResponse.json(
        { error: projectsError.message },
        { status: 400 }
      );
    }

    // Return combined data
    return NextResponse.json({ ...profile, projects }, { status: 200 });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string | string[] } }
) {
  try {
    // Convert id to string if it's an array
    const id = Array.isArray(params.id) ? params.id[0] : params.id;
    const session = await requireAuth(req);

    // Verify if the requesting user is the profile owner
    if ((session as any).user.id !== id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const updateData: UpdateProfileRequest = await req.json();

    const { error } = await supabase
      .from("profiles")
      .update({
        ...updateData,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(
      { message: "Profile updated successfully" },
      { status: 200 }
    );
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
