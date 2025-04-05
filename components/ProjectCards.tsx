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
    show: { opacity: 1, y: 0 }
};

export default function ProjectCards({ project }: ProjectCardProps) {
    const fallbackImage = "/placeholder-image.png"; // Add a placeholder image in your public folder

    return (
        <motion.div variants={cardVariants} className="h-full">
            <Card className="group flex flex-col h-full hover:shadow-lg transition-shadow duration-300 border bg-card overflow-hidden">
                <CardHeader className="p-4">
                    <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                            <Image
                                src={project.logo_url || fallbackImage}
                                alt={`${project.title} logo`}
                                width={40}
                                height={40}
                                className="rounded-md object-cover border"
                                onError={(e) => (e.currentTarget.src = fallbackImage)} // Handle broken images
                            />
                            <CardTitle className="text-lg font-semibold leading-tight hover:text-primary transition-colors">
                                <Link href={`/projects/${project.id}`} className="stretched-link">
                                    {project.title}
                                </Link>
                            </CardTitle>
                        </div>
                        {project.is_open_source && (
                            <Badge variant="secondary" className="text-xs whitespace-nowrap">
                                <Code className="w-3 h-3 mr-1" /> Open Source
                            </Badge>
                        )}
                    </div>

                    <p className="text-sm text-muted-foreground pt-2 line-clamp-2">
                        {project.description}
                    </p>
                </CardHeader>

                <CardContent className="p-4 pt-0 flex-grow">
                    {/* Display first image if available */}
                    {project.images && project.images.length > 0 && (
                        <div className="mb-4 rounded-md overflow-hidden aspect-video relative bg-muted">
                            <Image
                                src={project.images[0] || fallbackImage}
                                alt={`${project.title} preview`}
                                fill // Use fill for aspect ratio container
                                className="object-cover"
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                onError={(e) => (e.currentTarget.style.display = 'none')} // Hide if broken
                            />
                        </div>
                    )}

                    {/* Tech Stack */}
                    {project.tech_stack && project.tech_stack.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-3">
                            {project.tech_stack.slice(0, 5).map((tech) => ( // Limit displayed techs
                                <Badge key={tech} variant="outline" className="text-xs capitalize px-1.5 py-0.5">
                                    {tech}
                                </Badge>
                            ))}
                            {project.tech_stack.length > 5 && (
                                <Badge variant="outline" className="text-xs px-1.5 py-0.5">...</Badge>
                            )}
                        </div>
                    )}
                </CardContent>

                <CardFooter className="p-4 pt-2 flex justify-between items-center border-t mt-auto">
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1" title="Upvotes">
                            <ThumbsUp className="w-4 h-4" /> {project.upvotes_count ?? 0}
                        </span>
                        <span className="flex items-center gap-1" title="Comments">
                            <MessageSquare className="w-4 h-4" /> {project.comments_count ?? 0}
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        {project.github_url && (
                            <Button variant="ghost" size="icon" asChild title="GitHub Repository">
                                <Link href={project.github_url} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
                                    <Github className="w-4 h-4" />
                                </Link>
                            </Button>
                        )}
                        {project.live_url && (
                            <Button variant="ghost" size="icon" asChild title="Live Demo">
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