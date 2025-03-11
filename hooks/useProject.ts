// hooks/useProject.ts
import useSWR from 'swr';
import { supabase } from '@/lib/supabase';

const fetchProject = async (id: string) => {
  const { data, error } = await supabase
    .from('projects')
    .select(`
      *,
      developer:profiles(
        id, name, bio, github_url, linkedin_url, contact_visible, profile_picture
      ),
      comments(
        id, content, created_at,
        user:profiles(id, name, profile_picture)
      )
    `)
    .eq('id', id)
    .single();

  if (error || !data) {
    throw new Error(error?.message || 'Project not found');
  }
  return data;
};

export const useProject = (id: string | undefined) => {
  // SWR hook is always called regardless of id; when id is undefined, key is null.
  const { data, error } = useSWR(id ? `project-${id}` : null, () => fetchProject(id as string));
  return {
    project: data,
    isLoading: !error && !data,
    isError: error,
  };
};
