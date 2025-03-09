import { betterAuth } from "better-auth";
import { Pool } from "pg";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const connectionString = `postgres://${supabaseKey}@${supabaseUrl}/postgres`;

export const auth = betterAuth({
  database: new Pool({
    connectionString,
  }),
  emailAndPassword: {
    enabled: true,
  },
  // Add other authentication methods as needed
});
