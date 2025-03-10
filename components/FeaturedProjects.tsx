import Link from 'next/link';
import Image from 'next/image';
import { ThumbsUp, MessageSquare, ExternalLink, Github, Calendar } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';

export default function FeaturedProjects({ projects, title = "Featured Projects", showViewAll = true, showHeader = true }) {
    // Generate a random color for project cards without images
    const getRandomColor = () => {
        const colors = [
            'bg-blue-500', 'bg-green-500', 'bg-purple-500',
            'bg-pink-500', 'bg-indigo-500', 'bg-teal-500'
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    };

    // Format date to readable format
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    return (
        <div className="w-full">
            {showHeader && (
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-2xl md:text-3xl font-bold mb-2">
                            {title}
                        </h2>
                        <p className="text-gray-500">
                            Discover the most popular projects from Ethiopian developers
                        </p>
                    </div>
                    {showViewAll && (
                        <Link href="/projects">
                            <Button variant="outline">View All</Button>
                        </Link>
                    )}
                </div>
            )}

            <div className="grid grid-cols-1 gap-6">
                {projects && projects.length > 0 ? (
                    projects.map((project, index) => (
                        <Link
                            key={project.id}
                            href={`/projects/${project.id}`}
                            className="block transition-transform hover:-translate-y-1 duration-200"
                        >
                            <Card className="overflow-hidden border border-gray-200 hover:shadow-md transition-shadow duration-200">
                                <div className="flex flex-col md:flex-row">
                                    {/* Project Thumbnail/Icon */}
                                    <div className={`w-full md:w-48 h-40 md:h-auto flex items-center justify-center ${getRandomColor()} text-white`}>
                                        {project.thumbnail_url ? (
                                            <Image
                                                src={project.thumbnail_url}
                                                alt={project.title}
                                                width={192}
                                                height={160}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="text-3xl font-bold">
                                                {project.title.charAt(0)}
                                            </div>
                                        )}
                                    </div>

                                    {/* Project Details */}
                                    <div className="flex-1 p-6">
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="text-xl font-bold hover:text-primary transition-colors">
                                                {project.title}
                                            </h3>
                                            <div className="flex items-center text-gray-500 text-sm">
                                                <Calendar className="h-4 w-4 mr-1" />
                                                {formatDate(project.created_at)}
                                            </div>
                                        </div>

                                        <p className="text-gray-600 mb-4 line-clamp-2">
                                            {project.description}
                                        </p>

                                        {/* Developer Info */}
                                        <div className="flex items-center mb-4">
                                            <div className="relative w-8 h-8 rounded-full overflow-hidden bg-gray-200 mr-2">
                                                {project.developer?.avatar_url ? (
                                                    <Image
                                                        src={project.developer.avatar_url}
                                                        alt={project.developer.name}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary font-medium">
                                                        {project.developer?.name?.charAt(0).toUpperCase() || 'D'}
                                                    </div>
                                                )}
                                            </div>
                                            <Link
                                                href={`/developers/${project.developer?.id}`}
                                                className="text-sm font-medium hover:text-primary"
                                            >
                                                {project.developer?.name || 'Anonymous'}
                                            </Link>
                                        </div>

                                        {/* Project Stats & Links */}
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
                                                        <ExternalLink className="h-5 w-5" />
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </Link>
                    ))
                ) : (
                    <div className="text-center py-8 text-gray-500">
                        No projects available
                    </div>
                )}
            </div>
        </div>
    );
} 