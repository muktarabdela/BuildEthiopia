import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

type RegisterRequest = {
  email: string;
  password: string;
  name: string;
  username: string;
};

export async function POST(request: Request) {
  try {
    if (request.headers.get("content-type") !== "application/json") {
      return NextResponse.json(
        { error: "Content type must be application/json" },
        { status: 400 }
      );
    }

    const { email, password, name, username } =
      (await request.json()) as RegisterRequest;

    if (!email || !password || !name || !username) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if the username already exists
    const { data: existingUser, error: usernameError } = await supabase
      .from("profiles")
      .select("id")
      .eq("username", username)
      .single();

    if (usernameError && usernameError.code !== "PGRST116") {
      return NextResponse.json(
        { error: "Error checking username availability." },
        { status: 500 }
      );
    }

    if (existingUser) {
      return NextResponse.json(
        { error: "Username is already taken. Please choose another one." },
        { status: 400 }
      );
    }

    // Check if the email already exists
    const { data: existingEmail, error: emailError } = await supabase
      .from("profiles")
      .select("id")
      .eq("email", email)
      .single();

    if (emailError && emailError.code !== "PGRST116") {
      return NextResponse.json(
        { error: "Error checking email availability." },
        { status: 500 }
      );
    }

    if (existingEmail) {
      return NextResponse.json(
        { error: "Email is already taken. Please choose another one." },
        { status: 400 }
      );
    }

    // Create a new user in Supabase authentication
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          username,
        },
      },
    });

    if (error) {
      return NextResponse.json(
        { error: error.message || "Failed to register user" },
        { status: 500 }
      );
    }

    // If the user is created successfully, store their information in the "profiles" table
    const user = data.user;
    if (user) {
      const { error: profileError } = await supabase.from("profiles").insert([
        {
          id: user.id,
          name,
          username,
          email,
        },
      ]);

      if (profileError) {
        return NextResponse.json(
          { error: "User registered but profile creation failed." },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({
      message:
        "Registration successful. Please check your email for verification.",
      user: data.user,
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again later." },
      { status: 500 }
    );
  }
}
