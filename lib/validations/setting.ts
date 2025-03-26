// lib/validators.ts
import { z } from "zod";

// Helper for URLs - optional and allows empty string
const optionalUrl = z
  .string()
  .url({ message: "Must be a valid URL (e.g., https://...)" })
  .optional()
  .or(z.literal(""));

export const publicProfileSchema = z.object({
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters." })
    .max(50, { message: "Username cannot exceed 50 characters." })
    .regex(/^[a-zA-Z0-9_]+$/, {
      message: "Username can only contain letters, numbers, and underscores.",
    })
    .optional()
    .or(z.literal("")),
  name: z.string().max(100).optional().or(z.literal("")),
  bio: z
    .string()
    .max(300, { message: "Bio cannot exceed 300 characters." })
    .optional()
    .or(z.literal("")),
  location: z.string().max(100).optional().or(z.literal("")),
  website_url: optionalUrl,
  // profile_picture: // File upload needs separate handling, not typically part of standard form validation schema
});
export type PublicProfileInput = z.infer<typeof publicProfileSchema>;

export const aboutMeSchema = z.object({
  about_me: z.string().max(1000).optional().or(z.literal("")),
  experience_summary: z.string().max(500).optional().or(z.literal("")),
  education_summary: z.string().max(500).optional().or(z.literal("")),
  // Comma-separated strings from textarea
  expertise_str: z.string().optional(),
  interests_str: z.string().optional(),
  badges_str: z.string().optional(),
  skill_str: z.string().optional(), // Legacy skill field
});
export type AboutMeInput = z.infer<typeof aboutMeSchema>;

export const linksContactSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }), // Assuming email is mandatory
  github_url: optionalUrl,
  linkedin_url: optionalUrl,
  telegram_url: optionalUrl,
  contact_visible: z.boolean().optional(),
});
export type LinksContactInput = z.infer<typeof linksContactSchema>;

// Helper function to parse comma-separated strings into arrays for API
export const parseCommaSeparatedString = (
  str: string | undefined | null
): string[] => {
  if (!str) return [];
  return str
    .split(",")
    .map((item) => item.trim())
    .filter((item) => item.length > 0);
};
