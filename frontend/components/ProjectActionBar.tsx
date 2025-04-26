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
                        <svg width="24" height="24" viewBox="0 0 1024 1024" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M8 0C3.58 0 0 3.58 0 8C0 11.54 2.29 14.53 5.47 15.59C5.87 15.66 6.02 15.42 6.02 15.21C6.02 15.02 6.01 14.39 6.01 13.72C4 14.09 3.48 13.23 3.32 12.78C3.23 12.55 2.84 11.84 2.5 11.65C2.22 11.5 1.82 11.13 2.49 11.12C3.12 11.11 3.57 11.7 3.72 11.94C4.44 13.15 5.59 12.81 6.05 12.6C6.12 12.08 6.33 11.73 6.56 11.53C4.78 11.33 2.92 10.64 2.92 7.58C2.92 6.71 3.23 5.99 3.74 5.43C3.66 5.23 3.38 4.41 3.82 3.31C3.82 3.31 4.49 3.1 6.02 4.13C6.66 3.95 7.34 3.86 8.02 3.86C8.7 3.86 9.38 3.95 10.02 4.13C11.55 3.09 12.22 3.31 12.22 3.31C12.66 4.41 12.38 5.23 12.3 5.43C12.81 5.99 13.12 6.7 13.12 7.58C13.12 10.65 11.25 11.33 9.47 11.53C9.76 11.78 10.01 12.26 10.01 13.01C10.01 14.08 10 14.94 10 15.21C10 15.42 10.15 15.67 10.55 15.59C13.71 14.53 16 11.53 16 8C16 3.58 12.42 0 8 0Z" transform="scale(64)" fill="#ffff" />
                        </svg>
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