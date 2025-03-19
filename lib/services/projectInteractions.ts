import axios from "axios";
import { supabase } from "../supabase";

export const upvoteProject = async (
  userId: string,
  projectId: string,
  token: string
) => {
  try {
    // Set the Authorization header with the token
    const { data } = await axios.post(
      `/api/projects/${projectId}/upvote`,
      { user_id: userId, project_id: projectId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return data;
  } catch (error) {
    console.error("Error upvoting project:", error);
    throw new Error("Failed to upvote project");
  }
};

export const getUserUpvotedProjects = async (userId: string, token: string) => {
  try {
    const { data } = await axios.get(`/api/users/${userId}/upvoted-projects`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    // console.log("Upvoted projects data:", data);
    return data.projects;
  } catch (error) {
    console.error("Error fetching upvoted projects:", error);
    throw new Error("Failed to fetch upvoted projects");
  }
};
