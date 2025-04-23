// Server Component - Data Fetching
import { DevelopersList } from '@/components/DevelopersList';
import { supabase } from '@/lib/supabase';

async function getDevelopers() {
  const { data: developers, error } = await supabase
    .from('profiles')
    .select(`
      id,
      name,
      username,
      bio,
      profile_picture,
      github_url,
      linkedin_url,
      contact_visible,
      projects:projects!projects_developer_id_fkey(
        id,
        title,
        upvotes_count,
        comments_count
      )
    `)
    .eq('role', 'developer')
    .order('name');

  if (error) {
    console.error("Supabase error:", error);
    return [];
  }

  if (!developers) {
    console.warn("No developers found, but no error occurred");
    return [];
  }

  return developers;
}

export default async function DevelopersPage() {
  const developers = await getDevelopers();
  return <DevelopersList developers={developers} />;
}
