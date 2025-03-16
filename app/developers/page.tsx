// Server Component - Data Fetching
import { DevelopersList } from '@/components/DevelopersList';
import { supabase } from '@/lib/supabase';

async function getDevelopers() {
    const { data: developers } = await supabase
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
      projects:projects(
        id,
        title,
        upvotes_count,
        comments_count
      )
    `)
        .eq('role', 'developer')
        .order('name');

    return developers || [];
}

export default async function DevelopersPage() {
    const developers = await getDevelopers();
    return <DevelopersList developers={developers} />;
}
