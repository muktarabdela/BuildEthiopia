import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import {
  Github,
  Globe,
  Mail,
  Linkedin,
  Calendar,
  Award,
  MapPin,
  Briefcase,
  Code,
  ThumbsUp,
  MessageSquare,
  User,
  Layers
} from 'lucide-react';
import ContactDeveloperButton from './ContactDeveloperButton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/lib/supabase';

type Skill = {
  id: string;
  skill: string;
};

type Project = {
  id: string;
  title: string;
  description: string;
  images: string[];
  upvotes_count: number;
  comments_count: number;
  created_at: string;
  github_url?: string;
  live_url?: string;
};

type Developer = {
  id: string;
  name: string;
  bio?: string;
  avatar_url?: string;
  github_url?: string;
  linkedin_url?: string;
  created_at: string;
  contact_visible: boolean;
  projects: Project[];
  skills: Skill[];
};

type PageParams = {
  id: string;
};

async function getDeveloper(id: string): Promise<Developer> {
  const { data: developer, error } = await supabase
    .from('profiles')
    .select(`
      *,
      projects(
        *,
        developer:profiles(id, name, role, avatar_url)
      ),
      skills:developer_skills(
        id,
        skill
      )
    `)
    .eq('id', id)
    .eq('role', 'developer')
    .single();

  if (error || !developer) {
    notFound();
  }

  return developer as Developer;
}

export default async function DeveloperPage({ params }: { params: PageParams }) {
  const developer = await getDeveloper(params.id);
  const { projects, skills } = developer;

  // Calculate total upvotes and comments
  const totalUpvotes = projects.reduce((sum, project) => sum + (project.upvotes_count || 0), 0);
  const totalComments = projects.reduce((sum, project) => sum + (project.comments_count || 0), 0);

  // Sort projects by upvotes
  const sortedProjects = [...projects].sort((a, b) => (b.upvotes_count || 0) - (a.upvotes_count || 0));
  const topProject = sortedProjects.length > 0 ? sortedProjects[0] : null;

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary/90 to-primary text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-5xl mx-auto">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
              {/* Profile Image */}
              <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-white shadow-lg">
                {developer.avatar_url ? (
                  <Image
                    src={developer.avatar_url}
                    alt={developer.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-white/20 text-white text-4xl font-bold">
                    {developer.name?.charAt(0).toUpperCase() || 'D'}
                  </div>
                )}
              </div>

              {/* Profile Info */}
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-3xl md:text-5xl font-bold mb-2">{developer.name}</h1>
                <p className="text-xl text-white/90 mb-6 max-w-3xl">
                  {developer.bio || 'Software Developer'}
                </p>

                <div className="flex flex-wrap justify-center md:justify-start gap-4 mb-6">
                  {developer.github_url && (
                    <Link
                      href={developer.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
                    >
                      <svg width="24" height="24" viewBox="0 0 1024 1024" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M8 0C3.58 0 0 3.58 0 8C0 11.54 2.29 14.53 5.47 15.59C5.87 15.66 6.02 15.42 6.02 15.21C6.02 15.02 6.01 14.39 6.01 13.72C4 14.09 3.48 13.23 3.32 12.78C3.23 12.55 2.84 11.84 2.5 11.65C2.22 11.5 1.82 11.13 2.49 11.12C3.12 11.11 3.57 11.7 3.72 11.94C4.44 13.15 5.59 12.81 6.05 12.6C6.12 12.08 6.33 11.73 6.56 11.53C4.78 11.33 2.92 10.64 2.92 7.58C2.92 6.71 3.23 5.99 3.74 5.43C3.66 5.23 3.38 4.41 3.82 3.31C3.82 3.31 4.49 3.1 6.02 4.13C6.66 3.95 7.34 3.86 8.02 3.86C8.7 3.86 9.38 3.95 10.02 4.13C11.55 3.09 12.22 3.31 12.22 3.31C12.66 4.41 12.38 5.23 12.3 5.43C12.81 5.99 13.12 6.7 13.12 7.58C13.12 10.65 11.25 11.33 9.47 11.53C9.76 11.78 10.01 12.26 10.01 13.01C10.01 14.08 10 14.94 10 15.21C10 15.42 10.15 15.67 10.55 15.59C13.71 14.53 16 11.53 16 8C16 3.58 12.42 0 8 0Z" transform="scale(64)" fill="#ffff" />
                      </svg>
                      <span>GitHub</span>
                    </Link>
                  )}
                  {developer.linkedin_url && (
                    <Link
                      href={developer.linkedin_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
                    >
                      <svg width="24" height="24" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid" viewBox="0 0 256 256"><path d="M218.123 218.127h-37.931v-59.403c0-14.165-.253-32.4-19.728-32.4-19.756 0-22.779 15.434-22.779 31.369v60.43h-37.93V95.967h36.413v16.694h.51a39.907 39.907 0 0 1 35.928-19.733c38.445 0 45.533 25.288 45.533 58.186l-.016 67.013ZM56.955 79.27c-12.157.002-22.014-9.852-22.016-22.009-.002-12.157 9.851-22.014 22.008-22.016 12.157-.003 22.014 9.851 22.016 22.008A22.013 22.013 0 0 1 56.955 79.27m18.966 138.858H37.95V95.967h37.97v122.16ZM237.033.018H18.89C8.58-.098.125 8.161-.001 18.471v219.053c.122 10.315 8.576 18.582 18.89 18.474h218.144c10.336.128 18.823-8.139 18.966-18.474V18.454c-.147-10.33-8.635-18.588-18.966-18.453" fill="#0A66C2" /></svg>
                      <span>LinkedIn</span>
                    </Link>
                  )}
                  <div className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full">
                    <Calendar className="h-5 w-5" />
                    <span>Joined {new Date(developer.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              {/* Contact Button */}
              <div className="md:self-start">
                <ContactDeveloperButton developer={developer} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-3 md:grid-cols-6 -mt-8">
              <div className="col-span-1 md:col-span-2 bg-white rounded-tl-lg rounded-bl-lg shadow-lg border border-gray-200 p-6 text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary mb-1">{projects.length}</div>
                <p className="text-gray-500 text-sm md:text-base">Projects</p>
              </div>
              <div className="col-span-1 md:col-span-2 bg-white shadow-lg border-t border-b border-gray-200 p-6 text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary mb-1">{totalUpvotes}</div>
                <p className="text-gray-500 text-sm md:text-base">Total Upvotes</p>
              </div>
              <div className="col-span-1 md:col-span-2 bg-white rounded-tr-lg rounded-br-lg shadow-lg border border-gray-200 p-6 text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary mb-1">{totalComments}</div>
                <p className="text-gray-500 text-sm md:text-base">Total Comments</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Left Column - About & Skills */}
            <div className="space-y-8">
              {/* About Section */}
              <Card className="overflow-hidden">
                <CardHeader className="bg-gray-50 border-b">
                  <CardTitle className="flex items-center">
                    <User className="h-5 w-5 text-primary mr-2" />
                    About
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-1">Bio</h3>
                      <p className="text-gray-700">
                        {developer.bio || 'No bio provided.'}
                      </p>
                    </div>

                    {/* Placeholder for additional profile info */}
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-1">Location</h3>
                      <div className="flex items-center text-gray-700">
                        <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                        <span>Addis Ababa, Ethiopia</span>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-1">Experience</h3>
                      <div className="flex items-center text-gray-700">
                        <Briefcase className="h-4 w-4 mr-2 text-gray-400" />
                        <span>3+ years of experience</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Skills Section */}
              <Card className="overflow-hidden">
                <CardHeader className="bg-gray-50 border-b">
                  <CardTitle className="flex items-center">
                    <Code className="h-5 w-5 text-primary mr-2" />
                    Skills
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  {skills && skills.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {skills.map((skill) => (
                        <span
                          key={skill.id}
                          className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                        >
                          {skill.skill}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-4">
                      No skills listed yet.
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Achievements Section */}
              <Card className="overflow-hidden">
                <CardHeader className="bg-gray-50 border-b">
                  <CardTitle className="flex items-center">
                    <Award className="h-5 w-5 text-primary mr-2" />
                    Achievements
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    {totalUpvotes > 0 && (
                      <div className="flex items-start">
                        <div className="bg-yellow-100 text-yellow-700 rounded-full w-8 h-8 flex items-center justify-center mr-3 flex-shrink-0">
                          <ThumbsUp className="h-4 w-4" />
                        </div>
                        <div>
                          <h4 className="font-medium">Upvote Collector</h4>
                          <p className="text-sm text-gray-500">Received {totalUpvotes} upvotes across all projects</p>
                        </div>
                      </div>
                    )}

                    {projects.length > 0 && (
                      <div className="flex items-start">
                        <div className="bg-blue-100 text-blue-700 rounded-full w-8 h-8 flex items-center justify-center mr-3 flex-shrink-0">
                          <Layers className="h-4 w-4" />
                        </div>
                        <div>
                          <h4 className="font-medium">Project Creator</h4>
                          <p className="text-sm text-gray-500">Published {projects.length} projects on the platform</p>
                        </div>
                      </div>
                    )}

                    {totalComments > 0 && (
                      <div className="flex items-start">
                        <div className="bg-green-100 text-green-700 rounded-full w-8 h-8 flex items-center justify-center mr-3 flex-shrink-0">
                          <MessageSquare className="h-4 w-4" />
                        </div>
                        <div>
                          <h4 className="font-medium">Community Engager</h4>
                          <p className="text-sm text-gray-500">Received {totalComments} comments on projects</p>
                        </div>
                      </div>
                    )}

                    {totalUpvotes === 0 && projects.length === 0 && totalComments === 0 && (
                      <p className="text-gray-500 text-center py-4">
                        No achievements yet.
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Projects */}
            <div className="md:col-span-2 space-y-8">
              {/* Projects Section */}
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold flex items-center">
                    <Layers className="h-6 w-6 text-primary mr-2" />
                    Projects
                  </h2>
                  <span className="text-gray-500">{projects.length} total</span>
                </div>

                {projects.length > 0 ? (
                  <div className="space-y-6">
                    {sortedProjects.map((project) => (
                      <Link
                        key={project.id}
                        href={`/projects/${project.id}`}
                        className="block transition-transform hover:-translate-y-1 duration-200"
                      >
                        <Card className="overflow-hidden border border-gray-200 hover:shadow-md transition-shadow duration-200">
                          <div className="p-6">
                            <h3 className="text-xl font-bold mb-2 hover:text-primary transition-colors">
                              {project.title}
                            </h3>
                            <p className="text-gray-600 mb-4 line-clamp-2">
                              {project.description}
                            </p>

                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-4">
                                <div className="flex items-center text-gray-500">
                                  <ThumbsUp className="h-4 w-4 mr-1" />
                                  <span>{project.upvotes_count || 0}</span>
                                </div>
                                <div className="flex items-center text-gray-500">
                                  <MessageSquare className="h-4 w-4 mr-1" />
                                  <span>{project.comments_count || 0}</span>
                                </div>
                                <div className="flex items-center text-gray-500 text-sm">
                                  <Calendar className="h-4 w-4 mr-1" />
                                  <span>{new Date(project.created_at).toLocaleDateString()}</span>
                                </div>
                              </div>

                              <div className="flex items-center space-x-2">
                                {project.github_url && (
                                  <Link
                                    href={project.github_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-gray-500 hover:text-primary"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <Github className="h-5 w-5" />
                                  </Link>
                                )}
                                {project.live_url && (
                                  <Link
                                    href={project.live_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-gray-500 hover:text-primary"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <Globe className="h-5 w-5" />
                                  </Link>
                                )}
                              </div>
                            </div>
                          </div>
                        </Card>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <Card>
                    <CardContent className="text-center py-12">
                      <Layers className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p className="text-gray-500 mb-2">
                        No projects yet.
                      </p>
                      <p className="text-sm text-gray-400">
                        This developer hasn't published any projects.
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

