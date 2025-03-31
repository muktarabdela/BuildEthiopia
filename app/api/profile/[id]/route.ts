import { supabase } from "@/lib/supabase";
import { requireAuth } from "@/lib/supabase";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

type Profile = {
  id: string;
  username: string;
  // Add other profile fields as needed
};

type UpdateProfileRequest = {
  bio?: string;
  github_url?: string;
  linkedin_url?: string;
  telegram_url?: string;
  profile_picture?: string;
};

// app/api/profile/[id]/route.ts
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
        { error: "Username is required" },
        { status: 400 }
      );
    }
    // console.log(`Fetching profile for username: ${id}`);
    // 1. Fetch profile by username
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*") // Select all profile fields
      .eq("username", id)
      .maybeSingle(); // Use maybeSingle to handle not found gracefully

    if (profileError) {
      console.error("Supabase profile fetch error:", profileError);
      return NextResponse.json(
        { error: "Database error fetching profile." },
        { status: 500 }
      );
    }

    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    // 2. Fetch user_about data using the profile's ID
    const { data: about, error: aboutError } = await supabase
      .from("user_about")
      .select("*") // Select all about fields
      .eq("profile_id", profile.id)
      .maybeSingle(); // Use maybeSingle as 'about' might not exist yet

    if (aboutError) {
      console.error("Supabase user_about fetch error:", aboutError);
      // Decide if this is critical. Maybe return profile data even if about fails?
      // For settings, it's probably okay to return null for about.
      console.warn(`Could not fetch user_about for profile ID: ${profile.id}`);
    }

    // 3. Fetch projects (as before, if needed elsewhere, but not required for settings)
    const { data: projects, error: projectsError } = await supabase
      .from("projects")
      .select(
        "id, title, description, images, upvotes_count, comments_count, created_at"
      )
      .eq("developer_id", profile.id);

    if (projectsError) {
      console.error("Supabase projects fetch error:", projectsError);
      // Handle project fetch error if necessary, maybe log and continue
    }

    // 4. Combine profile and about data for the response
    //    We are NOT including projects here as the settings page doesn't need them.
    const responseData: FullProfileData = {
      profile: profile,
      about: about ?? null, // Ensure 'about' is explicitly null if not found
      projects: projects ?? [], // Uncomment if you need projects in the response
    };

    return NextResponse.json(responseData, { status: 200 });
  } catch (error: unknown) {
    console.error("API route unexpected error:", error);
    // Generic error handling
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Make sure FullProfileData definition is accessible or redefine here if needed
// Assuming it's imported correctly or defined in lib/definitions/setting.ts
interface ProfileData {
  id: string;
  name?: string | null;
  bio?: string | null;
  github_url?: string | null;
  linkedin_url?: string | null;
  contact_visible?: boolean | null;
  profile_picture?: string | null;
  username?: string | null;
  telegram_url?: string | null;
  email?: string | null;
  is_verify_email?: boolean | null;
  role?: string;
  status?: string | null;
  skill?: string[] | null;
  website_url?: string | null;
  location?: string | null;
  badges?: string[] | null;
}

interface UserAboutData {
  profile_id: string;
  about_me?: string | null;
  experience_summary?: string | null;
  expertise?: string[] | null;
  education_summary?: string | null;
  interests?: string[] | null;
}

interface FullProfileData {
  profile: ProfileData;
  about: UserAboutData | null;
  projects: ProjectData[] | null; // Assuming projects are optional
}
interface ProjectData {
  id: number;
  title: string;
  description?: string | null;
  thumbnail?: string | null;
  upvotes?: number;
  featured?: boolean;
  createdAt?: string | null;
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
