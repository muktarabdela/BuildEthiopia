"use server";
import { betterAuth } from "better-auth";
import { Pool } from "pg";

const connectionString = process.env.DATABASE_URL;

export const createAuth = async () => {
  const auth = betterAuth({
    database: new Pool({
      connectionString,
    }),
    emailAndPassword: {
      enabled: true,
      autoSignIn: true,
    },
    secret: process.env.BETTER_AUTH_SECRET, // Ensure this is set in your .env file
    baseURL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  });

  return auth; // Return the auth instance
};

// const auth = betterAuth({
//   database: new Pool({
//     connectionString,
//   }),
//   emailAndPassword: {
//     enabled: true,
//     autoSignIn: true,
//   },
//   secret: process.env.BETTER_AUTH_SECRET, // Ensure this is set in your .env file
//   baseURL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
// });

// Ensure you export the auth instance correctly
export default createAuth; // Default export
// export default auth; // Default export
