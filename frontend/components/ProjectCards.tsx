// src/components/ProjectCard.tsx
import Link from 'next/link';
import Image from 'next/image'; // Use next/image for optimization
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Github, ExternalLink, MessageSquare, ThumbsUp, Code } from 'lucide-react';
import { motion } from 'framer-motion';
import { Project } from '@/app/projects/page'; // Import the type

interface ProjectCardProps {
    project: Project;
}

const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    show: {
        opacity: 1,
        y: 0,
        transition: {
            type: "spring",
            stiffness: 100,
            damping: 15
        }
    }
};

const projectdummy = {
    "id": "5b2b3497-6d05-48b6-953b-c53c9a01c4d8",
    "title": "habit ",
    "description": "New York, USAghfdsa",
    "category": "Web",
    "post_content": "edia\nUpload images and logo for your project\nOptional: A logo helps your project stand out and builds brand recognition\n\nProvide detailed information about your project, including features, implementation details, challenges faced, and lessons learned...\nMinimum 100 characters. This is the main content of your project post.\n\nBack\nNext\nEthioDev Hub\nThe premier platform for Ethiopian developers to showcase their work and connect with opportunities.\n\nExplore\nProjects\nDevelopers\nPost a Project\nResources",
    "images": [
        "https://cvsolymnpaopcgtoxgke.supabase.co/storage/v1/object/public/project/5de09419-7352-4b5e-ba7a-f61b9f41431b/0.5915359171093524.jpg",
        "https://cvsolymnpaopcgtoxgke.supabase.co/storage/v1/object/public/project/5de09419-7352-4b5e-ba7a-f61b9f41431b/0.3960836859740351.jpg",
        "https://cvsolymnpaopcgtoxgke.supabase.co/storage/v1/object/public/project/5de09419-7352-4b5e-ba7a-f61b9f41431b/0.0981522701542914.jpg"
    ],
    "logo_url": "https://cvsolymnpaopcgtoxgke.supabase.co/storage/v1/object/public/project/5de09419-7352-4b5e-ba7a-f61b9f41431b/0.20638105447722022.jpg",
    "youtube_video_url": "https://youtube.com/watch?v=qgwlWsljG3s",
    "tech_stack": [
        "react",
        "next js"
    ],
    "github_url": "https://github.com/tfgyhj",
    "live_url": "https://github.com/",
    "developer_id": "5de09419-7352-4b5e-ba7a-f61b9f41431b",
    "upvotes_count": 0,
    "comments_count": 0,
    "is_open_source": true,
    "created_at": "2025-04-05T18:03:18.068911Z",
    "updated_at": "2025-04-05T18:03:18.068911Z"
}

export default function ProjectCards({ project }: ProjectCardProps) {
    const fallbackImage = "/placeholder-image.png"; // Add a placeholder image in your public folder

    return (
        <motion.div variants={cardVariants} className="h-full">
            <Card className="group relative flex flex-col h-full transition-all duration-300 hover:translate-y-[-2px] bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 border-gray-800 overflow-hidden backdrop-blur-sm">
                {/* Gradient overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <CardHeader className="p-4 relative z-10">
                    <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                            <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-gray-700 bg-gray-800">
                                <Image
                                    src={project.logo_url || fallbackImage}
                                    alt={`${project.title} logo`}
                                    fill
                                    className="object-cover transition-transform group-hover:scale-110"
                                    onError={(e) => (e.currentTarget.src = fallbackImage)}
                                />
                            </div>
                            <CardTitle className="text-lg font-semibold leading-tight">
                                <Link href={`/projects/${project.id}`} className="text-gray-100 hover:text-primary transition-colors">
                                    {project.title}
                                </Link>
                            </CardTitle>
                        </div>
                        {project.is_open_source && (
                            <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
                                <Code className="w-3 h-3 mr-1" /> Open Source
                            </Badge>
                        )}
                    </div>

                    <p className="text-sm text-gray-400 pt-3 line-clamp-2">
                        {project.description}
                    </p>
                </CardHeader>

                <CardContent className="p-4 pt-0 flex-grow relative z-10">
                    {/* Display first image if available */}
                    {project.images && project.images.length > 0 && (
                        <div className="mb-4 rounded-lg overflow-hidden aspect-video relative bg-gray-800 group-hover:shadow-lg transition-shadow">
                            <Image
                                src={project.images[0] || fallbackImage}
                                alt={`${project.title} preview`}
                                fill
                                className="object-cover transition-transform duration-300 group-hover:scale-105"
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                onError={(e) => (e.currentTarget.style.display = 'none')}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/40 to-transparent" />
                        </div>
                    )}

                    {/* Tech Stack */}
                    {project.tech_stack && project.tech_stack.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-3">
                            {project.tech_stack.slice(0, 5).map((tech) => (
                                <Badge
                                    key={tech}
                                    variant="outline"
                                    className="text-xs capitalize px-2 py-0.5 bg-gray-800/50 border-gray-700 text-gray-300 hover:bg-gray-700/50"
                                >
                                    {tech}
                                </Badge>
                            ))}
                            {project.tech_stack.length > 5 && (
                                <Badge
                                    variant="outline"
                                    className="text-xs px-2 py-0.5 bg-gray-800/50 border-gray-700 text-gray-300"
                                >
                                    +{project.tech_stack.length - 5}
                                </Badge>
                            )}
                        </div>
                    )}
                </CardContent>


                <CardFooter className="p-4 pt-2 flex justify-between items-center border-t border-gray-800 mt-auto relative z-10 bg-gray-900/50">
                    <div className="flex items-center gap-4 text-sm text-gray-400">
                        <button className="flex items-center gap-1.5 hover:text-primary transition-colors">
                            <ThumbsUp className="w-4 h-4" /> {project.upvotes_count ?? 0}
                        </button>
                        <button className="flex items-center gap-1.5 hover:text-primary transition-colors">
                            <MessageSquare className="w-4 h-4" /> {project.comments_count ?? 0}
                        </button>
                    </div>
                    <div className="flex items-center gap-2">
                        {project.github_url && (
                            <Button
                                variant="ghost"
                                size="icon"
                                className="hover:bg-gray-800 hover:text-primary transition-colors"
                                asChild
                            >
                                <Link href={project.github_url} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
                                    <svg width="24" height="24" viewBox="0 0 1024 1024" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path fill-rule="evenodd" clip-rule="evenodd" d="M8 0C3.58 0 0 3.58 0 8C0 11.54 2.29 14.53 5.47 15.59C5.87 15.66 6.02 15.42 6.02 15.21C6.02 15.02 6.01 14.39 6.01 13.72C4 14.09 3.48 13.23 3.32 12.78C3.23 12.55 2.84 11.84 2.5 11.65C2.22 11.5 1.82 11.13 2.49 11.12C3.12 11.11 3.57 11.7 3.72 11.94C4.44 13.15 5.59 12.81 6.05 12.6C6.12 12.08 6.33 11.73 6.56 11.53C4.78 11.33 2.92 10.64 2.92 7.58C2.92 6.71 3.23 5.99 3.74 5.43C3.66 5.23 3.38 4.41 3.82 3.31C3.82 3.31 4.49 3.1 6.02 4.13C6.66 3.95 7.34 3.86 8.02 3.86C8.7 3.86 9.38 3.95 10.02 4.13C11.55 3.09 12.22 3.31 12.22 3.31C12.66 4.41 12.38 5.23 12.3 5.43C12.81 5.99 13.12 6.7 13.12 7.58C13.12 10.65 11.25 11.33 9.47 11.53C9.76 11.78 10.01 12.26 10.01 13.01C10.01 14.08 10 14.94 10 15.21C10 15.42 10.15 15.67 10.55 15.59C13.71 14.53 16 11.53 16 8C16 3.58 12.42 0 8 0Z" transform="scale(64)" fill="#ffff" />
                                    </svg>
                                </Link>
                            </Button>
                        )}
                        {project.live_url && (
                            <Button
                                variant="ghost"
                                size="icon"
                                className="hover:bg-gray-800 hover:text-primary transition-colors"
                                asChild
                            >
                                <Link href={project.live_url} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
                                    <ExternalLink className="w-4 h-4 text-gray-200" />
                                </Link>
                            </Button>
                        )}
                    </div>
                </CardFooter>
            </Card>
        </motion.div>
    );
}