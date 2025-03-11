'use client'
import Link from 'next/link';
import Image from 'next/image';
import { notFound, useParams } from 'next/navigation';
import { createClient } from '@/lib/supabase';
import {
    Github,
    Globe,
    ThumbsUp,
    MessageSquare,
    Calendar,
    User,
    Share2,
    Bookmark,
    Code,
    Layers,
    CheckCircle,
    ExternalLink,
    Linkedin
} from 'lucide-react';
import UpvoteButton from './UpvoteButton';
import CommentsSection from './CommentsSection';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';

async function getProject(id: string) {
    const supabase = createClient();

    const { data: project, error } = await supabase
        .from('projects')
        .select(`
      *,
      developer:profiles(
        id,
        name,
        bio,
        github_url,
        linkedin_url,
        contact_visible,
        profile_picture
      ),
      comments(
        id,
        content,
        created_at,
        user:profiles(id, name, profile_picture)
      )
    `)
        .eq('id', id)
        .single();

    if (error || !project) {
        notFound();
    }

    return project;
}

async function getRelatedProjects(projectId: string, developerId: string) {
    const supabase = createClient();

    // Get other projects by the same developer
    const { data: developerProjects } = await supabase
        .from('projects')
        .select(`
      id,
      title,
      description,
      upvotes_count,
      developer:profiles!projects_developer_id_fkey(id, name, profile_picture)
    `)
        .eq('developer_id', developerId)
        .neq('id', projectId)
        .limit(3);

    return developerProjects || [];
}

export default function ProjectPage() {
    const [project, setProject] = useState();
    const params = useParams();
    const id = params?.id; // ✅ Now accessing username safely

    useEffect(() => {
        async function fetchData() {
            try {
                // Fetch projects and developers in parallel
                const project = await getProject(id);
                console.log('Project:', project);
                setProject(project);

            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }

        fetchData();
    }, [id]);


    const { developer, comments } = project;
    const relatedProjects = getRelatedProjects(id, developer?.id);

    // Generate a random color for the project banner
    const getRandomColor = () => {
        const colors = [
            'bg-gradient-to-r from-blue-500 to-indigo-600',
            'bg-gradient-to-r from-purple-500 to-pink-500',
            'bg-gradient-to-r from-green-500 to-teal-500',
            'bg-gradient-to-r from-orange-500 to-red-500',
            'bg-gradient-to-r from-indigo-500 to-purple-600'
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    };

    return (
        <main className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <div className={`${getRandomColor()} text-white`}>
                <div className="container mx-auto px-4 py-16">
                    <div className="max-w-4xl mx-auto">
                        {/* Project Header */}
                        <div className="mb-8">
                            <div className="flex items-center space-x-2 mb-4">
                                <Link
                                    href="/projects"
                                    className="text-white/80 hover:text-white text-sm font-medium"
                                >
                                    Projects
                                </Link>
                                <span className="text-white/60">/</span>
                                <span className="text-white/80 text-sm font-medium truncate">
                                    {project.title}
                                </span>
                            </div>
                            <h1 className="text-4xl md:text-5xl font-bold mb-4">{project.title}</h1>
                            <p className="text-xl text-white/90 mb-6 max-w-3xl">
                                {project.description?.split('\n')[0]}
                            </p>

                            {/* Developer Info */}
                            <div className="flex items-center">
                                <Link href={`/developers/${developer?.id}`} className="flex items-center group">
                                    <div className="relative w-10 h-10 rounded-full overflow-hidden bg-white/20 mr-3">
                                        {developer?.profile_picture ? (
                                            <Image
                                                src={developer.profile_picture}
                                                alt={developer.name}
                                                fill
                                                className="object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-white font-medium">
                                                {developer.name?.charAt(0).toUpperCase() || 'D'}
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <p className="font-medium text-white group-hover:underline">
                                            {developer.name}
                                        </p>
                                        <div className="flex items-center text-white/70 text-sm">
                                            <Calendar className="h-3.5 w-3.5 mr-1" />
                                            <span>{new Date(project.created_at).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-4xl mx-auto">
                    {/* Action Bar */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 -mt-8 mb-8 flex flex-wrap gap-4 justify-between items-center">
                        <div className="flex items-center gap-3">
                            <UpvoteButton projectId={project?.id} initialUpvotes={project.upvotes_count} />

                            <div className="flex items-center text-gray-500">
                                <MessageSquare className="h-5 w-5 mr-1" />
                                <span>{project.comments_count} Comments</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            {project.github_url && (
                                <a
                                    href={project.github_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-900 text-white rounded-lg transition-colors"
                                >
                                    <Github className="h-5 w-5" />
                                    <span>GitHub</span>
                                </a>
                            )}

                            {project.live_url && (
                                <a
                                    href={project.live_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg transition-colors"
                                >
                                    <Globe className="h-5 w-5" />
                                    <span>Live Demo</span>
                                </a>
                            )}

                            <Button
                                variant="outline"
                                size="icon"
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <Share2 className="h-5 w-5" />
                            </Button>

                            <Button
                                variant="outline"
                                size="icon"
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <Bookmark className="h-5 w-5" />
                            </Button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Main Content Column */}
                        <div className="md:col-span-2 space-y-8">
                            {/* Project Description */}
                            <Card className="overflow-hidden">
                                <CardHeader className="bg-gray-50 border-b">
                                    <CardTitle className="flex items-center">
                                        <Layers className="h-5 w-5 text-primary mr-2" />
                                        Project Overview
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="pt-6">
                                    <div className="prose max-w-none">
                                        <p className="whitespace-pre-wrap">{project.description}</p>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Tech Stack */}
                            <Card className="overflow-hidden">
                                <CardHeader className="bg-gray-50 border-b">
                                    <CardTitle className="flex items-center">
                                        <Code className="h-5 w-5 text-primary mr-2" />
                                        Tech Stack
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="pt-6">
                                    <div className="flex flex-wrap gap-2">
                                        {/* Placeholder tech stack tags - in a real app, these would come from the database */}
                                        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">React</span>
                                        <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">Node.js</span>
                                        <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">PostgreSQL</span>
                                        <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">Tailwind CSS</span>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Key Features */}
                            <Card className="overflow-hidden">
                                <CardHeader className="bg-gray-50 border-b">
                                    <CardTitle className="flex items-center">
                                        <CheckCircle className="h-5 w-5 text-primary mr-2" />
                                        Key Features
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="pt-6">
                                    <ul className="space-y-3">
                                        {/* Placeholder features - in a real app, these would come from the database */}
                                        <li className="flex items-start">
                                            <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                                            <span>Responsive design that works on all devices</span>
                                        </li>
                                        <li className="flex items-start">
                                            <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                                            <span>Real-time updates using WebSockets</span>
                                        </li>
                                        <li className="flex items-start">
                                            <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                                            <span>Authentication with social login options</span>
                                        </li>
                                        <li className="flex items-start">
                                            <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                                            <span>Optimized performance with server-side rendering</span>
                                        </li>
                                    </ul>
                                </CardContent>
                            </Card>

                            {/* Comments Section */}
                            <CommentsSection projectId={project?.id} initialComments={comments} commentsCount={project.comments_count} />
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-8">
                            {/* Developer Info */}
                            <Card className="overflow-hidden">
                                <CardHeader className="bg-gray-50 border-b">
                                    <CardTitle className="flex items-center">
                                        <User className="h-5 w-5 text-primary mr-2" />
                                        About the Developer
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="pt-6">
                                    <div className="flex flex-col items-center text-center mb-4">
                                        <div className="relative w-20 h-20 rounded-full overflow-hidden bg-gray-100 mb-3">
                                            {developer.profile_picture ? (
                                                <Image
                                                    src={developer.profile_picture}
                                                    alt={developer.name}
                                                    fill
                                                    className="object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary font-medium text-xl">
                                                    {developer.name?.charAt(0).toUpperCase() || 'D'}
                                                </div>
                                            )}
                                        </div>
                                        <h3 className="text-lg font-bold mb-1">{developer.name}</h3>
                                        {/* <p className="text-gray-500 text-sm">{developer.role}</p> */}
                                    </div>

                                    {developer.bio && (
                                        <p className="text-gray-600 mb-4 text-sm">{developer.bio}</p>
                                    )}

                                    <div className="flex justify-center space-x-3 mb-4">
                                        {developer.github_url && (
                                            <a
                                                href={developer.github_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-gray-500 hover:text-gray-900"
                                            >
                                                <Github className="h-5 w-5" />
                                            </a>
                                        )}
                                        {developer.linkedin_url && (
                                            <a
                                                href={developer.linkedin_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-gray-500 hover:text-gray-900"
                                            >
                                                <Linkedin className="h-5 w-5" />
                                            </a>
                                        )}
                                    </div>

                                    <Link href={`/developers/${developer.id}`}>
                                        <Button
                                            variant="outline"
                                            className="w-full"
                                        >
                                            View Profile
                                        </Button>
                                    </Link>
                                </CardContent>
                            </Card>

                            {/* Related Projects */}
                            {relatedProjects.length > 0 && (
                                <Card className="overflow-hidden">
                                    <CardHeader className="bg-gray-50 border-b">
                                        <CardTitle className="flex items-center">
                                            <Layers className="h-5 w-5 text-primary mr-2" />
                                            More by this Developer
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="pt-6">
                                        <div className="space-y-4">
                                            {relatedProjects.map(project => (
                                                <Link
                                                    key={project.id}
                                                    href={`/projects/${project.id}`}
                                                    className="block group"
                                                >
                                                    <div className="flex items-start space-x-3">
                                                        <div className="w-12 h-12 rounded bg-primary/10 flex items-center justify-center flex-shrink-0">
                                                            <span className="text-primary font-medium">
                                                                {project.title.charAt(0)}
                                                            </span>
                                                        </div>
                                                        <div>
                                                            <h4 className="font-medium text-gray-900 group-hover:text-primary transition-colors">
                                                                {project.title}
                                                            </h4>
                                                            <p className="text-gray-500 text-sm line-clamp-2">
                                                                {project.description}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </Link>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}

