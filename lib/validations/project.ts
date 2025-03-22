import { z } from "zod";

export const projectSchema = z.object({
  title: z.string().min(3).max(100),
  description: z.string().min(10).max(500),
  category: z.string().min(3).max(50),
  post_content: z.string().min(10),
  images: z.array(z.string().url()).max(5),
  logo_url: z.string().url().optional(),
  youtube_video_url: z.string().url().optional(),
  tech_stack: z.array(z.string().min(1)).max(10),
  github_url: z.string().url().optional(),
  live_url: z.string().url().optional(),
  is_open_source: z.boolean(),
});

export type ProjectFormData = z.infer<typeof projectSchema>;
