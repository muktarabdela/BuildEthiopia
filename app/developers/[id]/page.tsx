import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
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

async function getDeveloper(id) {
  const supabase = createClient();

  const { data: developer } = await supabase
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

  if (!developer) {
    notFound();
  }

  return developer;
}

export default async function DeveloperPage({ params }) {
  const developer = await getDeveloper(params.id);
  const { projects, skills } = developer;

  // Calculate total upvotes and comments
  const totalUpvotes = projects.reduce((sum, project) => sum + project.upvotes_count, 0);
  const totalComments = projects.reduce((sum, project) => sum + project.comments_count, 0);

  // Sort projects by upvotes
  const sortedProjects = [...projects].sort((a, b) => b.upvotes_count - a.upvotes_count);
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
                    <a
                      href={developer.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
                    >
                      <Github className="h-5 w-5" />
                      <span>GitHub</span>
                    </a>
                  )}
                  {developer.linkedin_url && (
                    <a
                      href={developer.linkedin_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
                    >
                      <Linkedin className="h-5 w-5" />
                      <span>LinkedIn</span>
                    </a>
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
                                  <a
                                    href={project.github_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-gray-500 hover:text-primary"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <Github className="h-5 w-5" />
                                  </a>
                                )}
                                {project.live_url && (
                                  <a
                                    href={project.live_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-gray-500 hover:text-primary"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <Globe className="h-5 w-5" />
                                  </a>
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

