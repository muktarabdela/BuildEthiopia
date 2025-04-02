import { supabase } from "@/lib/supabase";
import { requireAuth } from "@/lib/supabase";
import {
  aboutMeSchema,
  linksContactSchema,
  publicProfileSchema,
} from "@/lib/validations/setting";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { ZodError } from "zod";

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
  projects: ProjectData[] | null;
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
// app/api/profile/[id]/route.ts for getting

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

// app/api/profile/[id]/route.ts for updating user profiles
// This route handles updating user profiles
export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string | string[] }> }
) {
  let session;
  try {
    // Await params before accessing its properties
    const resolvedParams = await context.params;
    console.log("Resolved params:", resolvedParams);
    // 1. Get User Session/Authentication
    // requireAuth should ideally handle the unauthenticated case itself
    // (e.g., by throwing an error or returning null/a specific response)
    session = await requireAuth(req);

    // Double-check if requireAuth successfully returned a user object
    // This check might be redundant if requireAuth always throws/redirects on failure
    if (!session?.user?.id) {
      console.error("Authentication failed or user ID missing in session.");
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // --- CORRECTED USER ID EXTRACTION ---
    const userId = session.user.id;
    // ------------------------------------

    // 2. Parse and Validate Body
    const body = await req.json();
    console.log("Request body:", body);
    // const validatedData = publicProfileSchema.parse(body);
    // const validatedAboutData = aboutMeSchema.parse(body);
    // const validatedLinksData = linksContactSchema.parse(body);

    // 3. Update Database
    console.log(`Updating public profile for user ${userId}:`, body);

    // Update profiles table
    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .update({
        username: body.username,
        name: body.name,
        bio: body.bio,
        location: body.location,
        website_url: body.website_url,
        github_url: body.github_url,
        linkedin_url: body.linkedin_url,
        telegram_url: body.telegram_url,
        skill: body.skill,
        updated_at: new Date().toISOString(),
      })
      .eq("id", userId)
      .select()
      .single();

    // Handle profile update errors
    if (profileError) {
      console.error("Supabase profile update error:", profileError);
      return NextResponse.json(
        { message: `Profile update failed: ${profileError.message}` },
        { status: 500 }
      );
    }

    // Update user_about table
    const { data: aboutData, error: aboutError } = await supabase
      .from("user_about")
      .upsert({
        profile_id: userId,
        about_me: body.about_me,
        experience_summary: body.experience_summary,
        expertise: body.expertise,
        education_summary: body.education_summary,
        interests: body.interests,
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    // Handle about update errors
    if (aboutError) {
      console.error("Supabase user_about update error:", aboutError);
      return NextResponse.json(
        { message: `About section update failed: ${aboutError.message}` },
        { status: 500 }
      );
    }

    // Combine both updates' data
    const data = {
      profile: profileData,
      about: aboutData,
    };

    // Check if any row was actually updated (if data is null and no error, means no row matched the id)
    if (!data && !profileError && !aboutError) {
      console.warn(`No profile found for user ID: ${userId}`);
      // Depending on your logic, you might want to create a profile here
      // or return a different status code like 404 Not Found.
      // For now, let's return an error indicating the profile wasn't found.
      return NextResponse.json(
        { message: "Profile not found for the user." },
        { status: 404 } // Not Found is more appropriate than 500
      );
    }

    console.log("Profile updated successfully:", data);

    // 4. Return Success Response
    return NextResponse.json(
      // You might want to return the updated data: { message: "...", data: data }
      { message: "Public profile updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    // Handle Zod validation errors
    if (error instanceof ZodError) {
      return NextResponse.json(
        { message: "Validation failed", errors: error.errors },
        { status: 400 }
      );
    }

    // Handle potential errors from requireAuth or other unexpected issues
    console.error("API Error:", error);
    // Check if the error is an Auth error thrown by requireAuth perhaps
    // You might want more specific error handling based on requireAuth's behavior
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
