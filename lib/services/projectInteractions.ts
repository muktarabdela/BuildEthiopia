import { supabase } from "../supabase";

export const upvoteProject = async (userId: string, projectId: string) => {
  const { data, error } = await supabase
    .from("upvotes")
    .upsert({ user_id: userId, project_id: projectId })
    .select();

  if (error) throw error;
  return data;
};

export const saveProject = async (userId: string, projectId: string) => {
  const { data, error } = await supabase
    .from("saved_projects")
    .upsert({ user_id: userId, project_id: projectId })
    .select();

  if (error) throw error;
  return data;
};

export const getUserUpvotedProjects = async (userId: string) => {
  const { data, error } = await supabase
    .from("upvotes")
    .select("project_id")
    .eq("user_id", userId);

  if (error) throw error;
  return data.map((item) => item.project_id);
};

export const getUserSavedProjects = async (userId: string) => {
  const { data, error } = await supabase
    .from("saved_projects")
    .select("project_id")
    .eq("user_id", userId);

  if (error) throw error;
  return data.map((item) => item.project_id);
};
