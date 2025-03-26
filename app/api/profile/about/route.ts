import { Session } from "@supabase/supabase-js";
// app/api/profile/public/route.ts
import { NextRequest, NextResponse } from "next/server";
import { publicProfileSchema } from "@/lib/validations/setting";
import { ZodError } from "zod";
import { supabase } from "@/lib/supabase";
// Import your database client and auth logic (e.g., Supabase, Prisma, etc.)
// import { getSession, updateProfile } from '@/lib/server/auth';

export async function POST(req: NextRequest) {
  try {
    // 1. Get User Session/Authentication (replace with your auth logic)
    const session = await getSession(req);
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const userId = session.user.id;

    // 2. Parse and Validate Body
    const body = await req.json();
    const validatedData = publicProfileSchema.parse(body);

    // 3. Update Database (replace with your DB logic)
    console.log(`Updating public profile for user ${userId}:`, validatedData);
    const { data: response, error } = await supabase
      .from("profiles")
      .update({
        username: validatedData.username,
        name: validatedData.name,
        bio: validatedData.bio,
        location: validatedData.location,
        website_url: validatedData.website_url,
      })
      .eq("id", userId)
      .select();

    console.log("Supabase response:", response);
    // await updateProfile(userId, {
    //   username: validatedData.username,
    //   name: validatedData.name,
    //   bio: validatedData.bio,
    //   location: validatedData.location,
    //   website_url: validatedData.website_url,
    // });

    // 4. Return Success Response
    return NextResponse.json(
      { message: "Public profile updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { message: "Validation failed", errors: error.errors },
        { status: 400 }
      );
    }
    console.error("API Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
