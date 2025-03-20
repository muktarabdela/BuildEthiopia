import Link from 'next/link';

import { MessageCircle, ArrowUp, Sparkles, Bookmark } from "lucide-react"
import Image from 'next/image';
import UpvoteButton from '@/app/projects/[id]/UpvoteButton';
import { Skeleton } from "@/components/ui/skeleton"
import { useAuth } from './AuthProvider';
import { useState, useEffect } from 'react';
import { upvoteProject, getUserUpvotedProjects } from '@/lib/services/projectInteractions';
import { supabase } from '@/lib/supabase';

export function ProjectCard({ project, index }) {
    // console.log("Project card data", project);
    // Ensure project is defined
    if (!project) return null;

    const { user, session } = useAuth();
    const [isSaved, setIsSaved] = useState(false);
    const [isUpvoted, setIsUpvoted] = useState(false);
    // console.log("session data from project card", session);
    useEffect(() => {
        if (user) {
            if (session) {
                Promise.all([
                    // getUserSavedProjects(user.id, session.access_token),
                    getUserUpvotedProjects(user.id, session.access_token),
                ]).then(([upvoted]) => {
                    // setIsSaved(saved.some(savedProject => savedProject.id === project.id));
                    setIsUpvoted(upvoted?.includes(project.id));
                });
            }
        }
    }, [user, project.id]);

    const handleUpvote = async () => {
        if (!user) return;
        if (!session) return;

        try {
            if (isUpvoted) {
                await fetch(`/api/projects/${project.id}/upvote`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${session?.access_token}`,
                    },
                });
            } else {
                await upvoteProject(user.id, project.id, session.access_token);
            }
            setIsUpvoted(!isUpvoted);
        } catch (error) {
            console.error('Error upvoting project:', error);
        }
    };
    return (
        <div className="group bg-gray-800 p-4 md:p-4 rounded-xl border border-gray-700 hover:border-primary/50 transition-all duration-300 relative overflow-hidden">
            {/* Background pattern */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:20px_20px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />

            {/* Main content wrapped in Link */}
            <Link
                href={`/projects/${project.id}`}
                className="block relative z-10"
                onClick={(e) => {
                    // If the click originated from a button or link, don't navigate
                    if ((e.target as HTMLElement).closest('button, a')) {
                        e.preventDefault();
                    }
                }}
            >
                {/* Project Logo */}
                <div className="space-y-3">
                    <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${project.logo_url ? "bg-transparent" : "bg-primary/20"} group-hover:bg-primary/30 transition-colors duration-300`}>
                            {project.logo_url ? (
                                <img
                                    src={project.logo_url}
                                    alt={project.title}
                                    className="w-full h-full object-cover rounded-lg"
                                />
                            ) : (
                                <Sparkles className="w-6 h-6 text-primary group-hover:text-primary-400 transition-colors duration-300" />
                            )}
                        </div>
                        {/* Project Details */}
                        <div className="flex flex-col md:flex-row md:items-center justify-center gap-2">
                            <h2 className="text-xl font-semibold text-gray-100 group-hover:text-primary transition-colors duration-300">
                                {index + 1}. {project.title}
                            </h2>
                            {project.category && (
                                <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full">
                                    {project.category}
                                </span>
                            )}
                        </div>
                    </div>

                    <p className="text-gray-300 text-base line-clamp-2">{project.description}</p>

                    {/* Tech stack */}
                    {project.tech_stack?.length > 0 && (
                        <div className="flex gap-2 flex-wrap mt-2">
                            {project.tech_stack.map((tech) => (
                                <span
                                    key={tech}
                                    className="px-3 py-1 bg-gray-700 rounded-full text-sm font-medium hover:bg-gray-700 text-white transition-colors duration-200"
                                >
                                    {tech}
                                </span>
                            ))}
                        </div>
                    )}
                    {/* Developer Info */}
                    <div
                        className="flex items-center gap-3 mt-4 hover:underline cursor-pointer"
                        onClick={(e) => {
                            e.stopPropagation();
                            window.location.href = `/${project.developer.username}`;
                        }}
                        role="link"
                        tabIndex={0}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                                window.location.href = `/${project.developer.username}`;
                            }
                        }}
                        aria-label={`View ${project.developer?.name || 'Anonymous Developer'}'s profile`}
                    >
                        <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gray-700 text-white group-hover:ring-2 group-hover:ring-primary transition-all duration-300">
                            {project.developer?.profile_picture ? (
                                <Image
                                    src={project.developer.profile_picture}
                                    alt={project.developer.name}
                                    fill
                                    className="object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-primary/20 text-primary font-medium">
                                    {project.developer?.name?.charAt(0).toUpperCase() || 'D'}
                                </div>
                            )}
                        </div>
                        <span className="text-base font-medium text-gray-300 group-hover:text-primary transition-colors duration-300">
                            {project.developer?.name || 'Anonymous Developer'}
                        </span>
                    </div>
                </div>
            </Link>

            {/* Right section with actions - outside the main Link */}
            <div className="flex justify-end">
                <div className="flex gap-3 text-gray-400">
                    {/* Comments */}
                    <Link
                        href={`/projects/${project.id}`}
                        className="flex items-center gap-2 bg-gray-700 px-3 py-1.5 rounded-full hover:bg-gray-700 text-white transition-colors duration-200"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <MessageCircle className="w-4 h-4" />
                        <span className="text-sm">{project.comments_count}</span>
                    </Link>

                    {/* Upvote */}
                    <div
                        className="flex items-center gap-2 bg-gray-700 rounded-full hover:bg-gray-700 text-white transition-colors duration-200"
                        onClick={(e) => {
                            e.stopPropagation();
                            handleUpvote();
                        }}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                                handleUpvote();
                            }
                        }}
                        aria-label={`Upvote ${project.title}`}
                    >
                        <UpvoteButton
                            projectId={project?.id}
                            initialUpvotes={project.upvotes_count}
                            className=""
                        />
                    </div>


                </div>
            </div>
        </div>
    )
}

export function SkeletonProjectCard() {
    return (
        <div className="bg-gray-800 p-4 md:p-6 rounded-xl border border-gray-700">
            <div className="flex flex-col md:flex-row justify-between gap-6">
                {/* Left section */}
                <div className="flex items-start gap-4 flex-1">
                    {/* Project Icon */}
                    <Skeleton className="w-10 h-10 rounded-lg bg-gray-700 text-white" />

                    {/* Project Details */}
                    <div className="flex-1 space-y-3">
                        <Skeleton className="h-6 w-3/4 bg-gray-700 text-white" />
                        <Skeleton className="h-4 w-1/4 bg-gray-700 text-white" />
                        <Skeleton className="h-4 w-full bg-gray-700 text-white" />
                        <Skeleton className="h-4 w-2/3 bg-gray-700 text-white" />

                        {/* Tech stack */}
                        <div className="flex gap-2">
                            <Skeleton className="h-6 w-16 bg-gray-700 text-white rounded-full" />
                            <Skeleton className="h-6 w-16 bg-gray-700 text-white rounded-full" />
                        </div>

                        {/* Developer Info */}
                        <div className="flex items-center gap-2 mt-4">
                            <Skeleton className="w-8 h-8 rounded-full bg-gray-700 text-white" />
                            <Skeleton className="h-4 w-24 bg-gray-700 text-white" />
                        </div>
                    </div>
                </div>

                {/* Right section */}
                <div className="flex flex-row md:flex-col items-start md:items-end gap-4">
                    <div className="flex items-center gap-4">
                        <Skeleton className="h-8 w-8 bg-gray-700 text-white rounded-full" />
                        <Skeleton className="h-8 w-8 bg-gray-700 text-white rounded-full" />
                    </div>
                </div>
            </div>
        </div>
    )
}

