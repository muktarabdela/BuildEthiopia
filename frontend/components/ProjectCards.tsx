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
                                    <Github className="w-4 h-4" />
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
                                    <ExternalLink className="w-4 h-4" />
                                </Link>
                            </Button>
                        )}
                    </div>
                </CardFooter>
            </Card>
        </motion.div>
    );
}