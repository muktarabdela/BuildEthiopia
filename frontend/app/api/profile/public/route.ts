import { NextRequest, NextResponse } from "next/server";
import { publicProfileSchema } from "@/lib/validations/setting";
import { ZodError } from "zod";
import { requireAuth, supabase } from "@/lib/supabase";
// Assuming requireAuth returns something like { user: { id: string, ... } } | null
// or throws an error if not authenticated.

export async function POST(req: NextRequest) {
  let session;
  try {
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
    const validatedData = publicProfileSchema.parse(body);

    // 3. Update Database
    console.log(`Updating public profile for user ${userId}:`, validatedData);

    const { data, error: updateError } = await supabase
      .from("profiles") // Make sure 'profiles' is your correct table name
      .update({
        // Ensure these column names match your 'profiles' table schema exactly
        username: validatedData.username,
        name: validatedData.name, // Or 'full_name' if that's your column
        bio: validatedData.bio,
        location: validatedData.location,
        website_url: validatedData.website_url,
        updated_at: new Date().toISOString(), // Good practice to update timestamp
      })
      .eq("id", userId) // Match the profile row with the authenticated user's ID
      .select() // Optionally select the updated data to return or log
      .single(); // Use .single() if you expect exactly one row to be updated

    // Handle potential Supabase errors during the update
    if (updateError) {
      console.error("Supabase update error:", updateError);
      // Provide more specific error message if possible
      return NextResponse.json(
        { message: `Database update failed: ${updateError.message}` },
        { status: 500 }
      );
    }

    // Check if any row was actually updated (if data is null and no error, means no row matched the id)
    if (!data && !updateError) {
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
