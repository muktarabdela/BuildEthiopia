import { supabase } from "@/lib/supabase";

export const refreshFeaturedProjects = async () => {
  try {
    // Delete expired featured projects
    await supabase
      .from("featured_projects")
      .delete()
      .lt("expires_at", new Date().toISOString());

    // Optionally, you can add logic here to automatically feature new projects
    // based on certain criteria (e.g., most upvoted projects from the past week)

    console.log("Featured projects refreshed successfully");
  } catch (error) {
    console.error("Error refreshing featured projects:", error);
  }
};
