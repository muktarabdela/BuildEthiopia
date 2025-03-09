import { authClient } from "@/lib/auth-client";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    if (request.headers.get("content-type") !== "application/json") {
      console.log("Invalid content type");
      return NextResponse.json(
        { error: "Content type must be application/json" },
        { status: 400 }
      );
    }

    const { email, password, name, image } = await request.json();

    if (!email || !password || !name) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const { data, error } = await authClient.signUp.email(
      {
        email,
        password,
        name,
        image,
        callbackURL: "/",
      },
      {
        onRequest: (ctx) => {
          console.log("Sign-up request started");
        },
        onSuccess: (ctx) => {
          console.log("Sign-up successful:", ctx);
        },
        onError: (ctx) => {
          console.error("Sign-up error:", ctx.error);
        },
      }
    );

    if (error) {
      console.error("Sign-up error details:", error);
      return NextResponse.json(
        { error: error.message || "Failed to register user" },
        { status: 500 }
      );
    }

    console.log("User signed up successfully:", data);
    return NextResponse.json({
      message:
        "Registration successful. Please check your email for verification.",
      user: data,
    });
  } catch (error) {
    console.error("Registration Error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again later." },
      { status: 500 }
    );
  }
}
