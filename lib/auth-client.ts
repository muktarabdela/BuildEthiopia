import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  // Remove custom endpoints - Better Auth will handle the routing
});

export const { signIn, signOut, useSession } = authClient;
