import { supabase } from "@/lib/supabase";

export const getProjects = async () => {
  const { data, error } = await supabase
    .from("projects")
    .select(
      `
      *,
      developer:profiles!projects_developer_id_fkey(id, name, profile_picture, username),
      featured_projects(featured_at, expires_at)
    `
    )
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
};

export const getDevelopers = async () => {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
};

export const updateProjectStatus = async (
  projectId: string,
  status: "featured" | "approved"
) => {
  const { error } = await supabase
    .from("projects")
    .update({ [status]: true })
    .eq("id", projectId);

  if (error) throw error;
};

export const getDeveloperProjects = async (developerId: string) => {
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("developer_id", developerId);

  if (error) throw error;
  return data;
};

export const updateDeveloperStatus = async (
  developerId: string,
  active: boolean
) => {
  const { error } = await supabase
    .from("profiles")
    .update({ active })
    .eq("id", developerId);

  if (error) throw error;
};

export const updateFeaturedStatus = async (
  projectId: string,
  featured: boolean
) => {
  const { error } = await supabase
    .from("projects")
    .update({ featured })
    .eq("id", projectId);

  if (error) throw error;
  return { success: true };
};
