// lib/definitions.ts

// Match your database schema (nullable fields are optional)
export interface ProfileData {
  id: string;
  name?: string | null;
  bio?: string | null;
  github_url?: string | null;
  linkedin_url?: string | null;
  contact_visible?: boolean | null;
  profile_picture?: string | null; // URL
  username?: string | null;
  telegram_url?: string | null;
  email?: string | null; // Usually non-nullable if used for login
  is_verify_email?: boolean | null;
  role?: string; // Default 'developer'
  status?: string | null; // Default 'none'
  skill?: string[] | null; // Array from DB
  website_url?: string | null;
  location?: string | null;
  badges?: string[] | null; // Array from DB
}

export interface UserAboutData {
  profile_id: string; // Should match ProfileData.id
  about_me?: string | null;
  experience_summary?: string | null;
  expertise?: string[] | null; // Array from DB
  education_summary?: string | null;
  interests?: string[] | null; // Array from DB
}

// Combined type for easier handling on the frontend if fetched together
export interface FullProfileData {
  profile: ProfileData;
  about: UserAboutData | null; // About might not exist yet for a user
}

// Helper type for form sections often using comma-separated strings
export type CommaSeparatedString = string | undefined;
