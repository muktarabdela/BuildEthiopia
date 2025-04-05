'use client'
import { Github, Globe, MessageSquare, Code, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import UpvoteButton from "@/app/projects/[id]/UpvoteButton"
import Link from "next/link"
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { getUserUpvotedProjects } from "@/lib/services/projectInteractions"
import { useAuth } from "./AuthProvider"
import { Skeleton } from "./ui/skeleton"

interface Developer {
    id: string;
    name: string;
    username?: string;
}

interface Project {
    id: string;
    title: string;
    github_url?: string;
    live_url?: string;
    is_open_source?: boolean;
    upvotes_count: number;
    comments?: Array<any>;
    developer?: Developer;
}

interface ProjectActionBarProps {
    project: Project;
    initialHasUpvoted: boolean | undefined;
}

export default function ProjectActionBar({ project }: ProjectActionBarProps, isLoading = false) {
    const [isLoadingUserInteraction, setIsLoadingUserInteraction] = useState(true);
    const [initialHasUpvoted, setInitialHasUpvoted] = useState<boolean | undefined>(undefined); // Undefined means loading
    const { user, session } = useAuth(); // Assuming you have a custom hook for authentication
    useEffect(() => {
        let isMounted = true;
        // console.log(`ProjectCard Effect running for Project ID: ${project.id}`);
        // console.log('User:', user);
        // console.log('Session:', session);

        setInitialHasUpvoted(undefined);
        setIsLoadingUserInteraction(true);

        if (user && session) {
            // console.log(`Fetching upvoted projects for User ID: ${user.id}`);
            getUserUpvotedProjects(user?.id, session.access_token)
                .then((upvotedProjectObjects) => { // Renamed for clarity
                    // console.log(`Received upvoted Project Objects for user ${user.id}:`, upvotedProjectObjects);
                    if (isMounted) {
                        const currentProjectId = project?.id;

                        // --- *** THE FIX IS HERE *** ---
                        // Check if the received data is an array before using .some()
                        // Use .some() to check if any object in the array has a matching ID
                        const upvotedStatus = Array.isArray(upvotedProjectObjects)
                            ? upvotedProjectObjects.some(upvotedProj => String(upvotedProj?.id) === String(currentProjectId))
                            : false; // Default to false if not an array
                        // --- *** END FIX *** ---

                        // console.log(`Checking if ${currentProjectId} (Type: ${typeof currentProjectId}) has a matching ID in`, upvotedProjectObjects);
                        console.log(`Result (upvotedStatus for ${currentProjectId}): ${upvotedStatus}`); // Log result with project ID
                        setInitialHasUpvoted(upvotedStatus);
                        setIsLoadingUserInteraction(false);
                    }
                })
                .catch(error => {
                    console.error("Error fetching user upvoted projects:", error);
                    if (isMounted) {
                        setInitialHasUpvoted(false);
                        setIsLoadingUserInteraction(false);
                    }
                });
        } else {
            // console.log('User or Session missing, setting initialHasUpvoted to false.');
            if (isMounted) {
                setInitialHasUpvoted(false);
                setIsLoadingUserInteraction(false);
            }
        }

        return () => {
            isMounted = false;
        };
    }, [user, session, project?.id]);
    const projectId = project?.id;
    const initialUpvotes = project?.upvotes_count ?? 0;
    const commentsCount = project?.comments?.length ?? 0;

    const handleShare = async () => {
        try {
            if (navigator.share) {
                await navigator.share({
                    title: project.title,
                    text: `Check out this project: ${project.title}`,
                    url: window.location.href,
                });
            } else {
                await navigator.clipboard.writeText(window.location.href);
                // Show a toast notification
                toast("Link copied to clipboard!")
            }
        } catch (error) {
            console.error('Error sharing:', error);
            toast('Failed to share the project. Please try again.'); // Replace this with a proper toast notification library
        }
    };

    return (
        <div className="bg-gray-800 rounded-xl shadow-sm border border-gray-700 p-4 -mt-8 mb-8 flex flex-col sm:flex-row gap-4 justify-between items-center backdrop-blur-sm">
            {/* Left Section */}
            <div className="flex flex-wrap gap-3 w-full sm:w-auto justify-center sm:justify-start">
                {!isLoadingUserInteraction ? (
                    <div onClick={(e) => e.stopPropagation()}> {/* Wrapper to stop propagation */}
                        <UpvoteButton
                            projectId={project?.id}
                            initialUpvotes={project?.upvotes_count ?? 0}
                            initialHasUpvoted={initialHasUpvoted}
                            size="lg" // Make it slightly smaller to fit better maybe
                        // Pass any specific className if needed
                        // className="px-3 py-1.5" // Example if you need specific padding different from default
                        />
                    </div>
                ) : (
                    // Skeleton/Placeholder for the button while loading initial state
                    <Skeleton className="bg-gray-700 h-8 w-20 bg-gray-700 rounded-full" />
                )}
                <div className="flex items-center text-gray-300">
                    <MessageSquare className="h-5 w-5 mr-1" />
                    <span className="whitespace-nowrap">{commentsCount} Comments</span>
                </div>
                {project?.is_open_source && (
                    <div className="flex items-center text-green-400">
                        <Code className="h-5 w-5 mr-1" />
                        <span className="whitespace-nowrap">Open Source</span>
                    </div>
                )}
            </div>

            {/* Right Section */}
            <div className="flex flex-wrap gap-3 w-full sm:w-auto justify-center sm:justify-end">
                {project?.github_url && (
                    <Link
                        href={project.github_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-gray-700 text-white hover:bg-gray-600 rounded-lg transition-colors whitespace-nowrap"
                    >
                        <Github className="h-5 w-5" />
                        <span className="hidden sm:inline">GitHub</span>
                    </Link>
                )}

                {project?.live_url && (
                    <Link
                        href={project.live_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg transition-colors whitespace-nowrap"
                    >
                        <Globe className="h-5 w-5" />
                        <span className="hidden sm:inline">Live Demo</span>
                    </Link>
                )}

                <Button
                    onClick={handleShare}
                    variant="outline"
                    size="icon"
                    className="text-gray-300 hover:text-gray-100 border-gray-600"
                    aria-label="Share project"
                >
                    <Share2 className="h-5 w-5" />
                </Button>
            </div>
        </div>
    )
}


export function SkeletonProjectActionBar() {
    return (
        // Maintain the same container structure, padding, margin, border, and background (using muted)
        <div className="bg-muted rounded-xl shadow-sm border border-gray-700 p-4 -mt-8 mb-8 flex flex-col sm:flex-row gap-4 justify-between items-center">

            {/* Left Section Skeleton */}
            <div className="flex flex-wrap gap-3 w-full sm:w-auto justify-center sm:justify-start items-center">
                {/* Upvote Button Placeholder */}
                <Skeleton className="bg-gray-700 h-9 w-20 rounded-full" />

                {/* Comments Count Placeholder */}
                <div className="flex items-center gap-1 text-muted-foreground">
                    <MessageSquare className="h-5 w-5 text-muted-foreground/50" /> {/* Muted Icon */}
                    <Skeleton className="bg-gray-700 h-5 w-24 rounded" /> {/* "X Comments" */}
                </div>

                {/* Open Source Badge Placeholder (Assume it might be there for layout stability) */}
                <div className="flex items-center gap-1 text-muted-foreground">
                    <Code className="h-5 w-5 text-muted-foreground/50" /> {/* Muted Icon */}
                    <Skeleton className="bg-gray-700 h-5 w-28 rounded" /> {/* "Open Source" */}
                </div>
            </div>

            {/* Right Section Skeleton */}
            <div className="flex flex-wrap gap-3 w-full sm:w-auto justify-center sm:justify-end items-center">
                {/* GitHub Button Placeholder (Assume it might be there) */}
                <Skeleton className="bg-gray-700 h-9 w-[110px] rounded-lg" /> {/* Approx size of icon + "GitHub" */}

                {/* Live Demo Button Placeholder (Assume it might be there) */}
                <Skeleton className="bg-gray-700 h-9 w-[125px] rounded-lg" /> {/* Approx size of icon + "Live Demo" */}

                {/* Share Button Placeholder */}
                <Skeleton className="bg-gray-700 h-9 w-9 rounded-lg" /> {/* Icon button size */}
            </div>
        </div>
    )
}