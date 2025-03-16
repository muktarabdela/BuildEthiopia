import { supabase } from "@/lib/supabase";

export interface Project {
  id: string;
  title: string;
  description: string;
  featured: boolean;
  developer: {
    id: string;
    name: string;
  };
  // ... other fields
}

export const getProjects = async (): Promise<Project[]> => {
  const { data, error } = await supabase
    .from("projects")
    .select("*, developer:profiles(id, name)")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
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
};
