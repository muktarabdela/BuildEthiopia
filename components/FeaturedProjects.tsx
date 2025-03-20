import Link from 'next/link';
import Image from 'next/image';
import { ThumbsUp, MessageSquare, ExternalLink, Github, Calendar } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { ProjectCard, SkeletonProjectCard } from './ProjectCard';
import index from 'swr';

interface FeaturedProjectsProps {
    projects: Array<{
        id: string;
        title: string;
        description: string;
        featured: boolean;
        // ... other project fields
    }>;
    title?: string;
    showViewAll?: boolean;
    showHeader?: boolean;
    isLoading?: boolean;
}

export default function FeaturedProjects({
    projects,
    title = "Featured Projects",
    showViewAll = true,
    showHeader = true,
    isLoading
}: FeaturedProjectsProps) {
    console.log('Featured Projects from FeaturedProjects componet:', projects);

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
                {isLoading ? (
                    // Show 3 skeleton cards while loading
                    Array.from({ length: 3 }).map((_, index) => (
                        <SkeletonProjectCard key={`skeleton-${index}`} />
                    ))
                ) : projects.length > 0 ? (
                    projects.map((project, index) => (
                        <ProjectCard
                            key={project.id}
                            project={project}
                            index={index}
                        />
                    ))
                ) : (
                    <div className="text-center py-8 text-gray-500">
                        No featured projects available
                    </div>
                )}
            </div>
        </div>
    );
} 