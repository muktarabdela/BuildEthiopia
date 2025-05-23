import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { MessageCircle, Sparkles } from "lucide-react"; // Removed ArrowUp, Bookmark
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from './AuthProvider'; // Assuming path is correct
import { useState, useEffect } from 'react';
import { getUserUpvotedProjects } from '@/lib/services/projectInteractions'; // Assuming path is correct
import UpvoteButton from '@/app/projects/[id]/UpvoteButton';

// Define Project and Developer types
interface Developer {
    id: string;
    name: string;
    username?: string;
    profile_picture?: string;
}

interface Project {
    id: string;
    title: string;
    description: string;
    category?: string;
    logo_url?: string;
    tech_stack?: string[];
    comments_count: number;
    upvotes_count: number;
    developer?: Developer;
}

interface ProjectCardProps {
    project: Project;
    index?: number;
}

export function ProjectCard({ project, index }: ProjectCardProps) {
    if (!project) return null;

    const router = useRouter();
    const { user, session } = useAuth();

    // State to hold the initial upvoted status fetched for the current user
    const [initialHasUpvoted, setInitialHasUpvoted] = useState<boolean | undefined>(undefined); // Undefined means loading
    const [isLoadingUserInteraction, setIsLoadingUserInteraction] = useState(true);

    useEffect(() => {
        let isMounted = true;
        // console.log(`ProjectCard Effect running for Project ID: ${project.id}`);
        // console.log('User:', user);
        // console.log('Session:', session);

        setInitialHasUpvoted(undefined);
        setIsLoadingUserInteraction(true);

        if (user && session) {
            // console.log(`Fetching upvoted projects for User ID: ${user.id}`);
            getUserUpvotedProjects(user.id, session.access_token)
                .then((upvotedProjectObjects) => { // Renamed for clarity
                    // console.log(`Received upvoted Project Objects for user ${user.id}:`, upvotedProjectObjects);
                    if (isMounted) {
                        const currentProjectId = project.id;

                        // --- *** THE FIX IS HERE *** ---
                        // Check if the received data is an array before using .some()
                        // Use .some() to check if any object in the array has a matching ID
                        const upvotedStatus = Array.isArray(upvotedProjectObjects)
                            ? upvotedProjectObjects.some(upvotedProj => String(upvotedProj.id) === String(currentProjectId))
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
    }, [user, session, project.id]);

    return (
        <div
            className="group bg-gray-800 p-4 md:p-4 rounded-xl border border-gray-700 hover:border-primary/50 transition-all duration-300 relative overflow-hidden"
        >
            {/* Background pattern */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:20px_20px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />

            <div className="relative z-10 flex flex-col justify-between h-full">
                {/* Top part: Info */}
                <div className="space-y-3 mb-4">
                    {/* Project Logo & Title/Category - Make this section clickable */}
                    <div className="flex items-center gap-4">
                        <Link
                            href={`/projects/${project.id}`}
                            className="flex items-center gap-4 group/title cursor-pointer"
                        >
                            <div className={`flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center ${project.logo_url ? "bg-transparent" : "bg-primary/20"} group-hover/title:bg-primary/30 transition-colors duration-300`}>
                                {project.logo_url ? (
                                    <img src={project.logo_url} alt={`${project.title} logo`} className="w-full h-full object-cover rounded-lg" />
                                ) : (
                                    <Sparkles className="w-6 h-6 text-primary group-hover/title:text-primary-400 transition-colors duration-300" />
                                )}
                            </div>
                            <div className="flex-grow min-w-0">
                                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                                    <h2 className="text-xl font-semibold text-gray-100 group-hover/title:text-primary transition-colors duration-300 truncate">
                                        {index != null ? `${index + 1}. ` : ''}{project.title}
                                    </h2>
                                    {project.category && (
                                        <span className="flex-shrink-0 inline-block px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full whitespace-nowrap">
                                            {project.category}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </Link>
                    </div>

                    {/* Description - No changes needed */}
                    <p className="text-gray-300 text-base line-clamp-2">{project.description}</p>

                    {/* Tech stack section - No changes needed */}
                    {project.tech_stack && project.tech_stack.length > 0 && (
                        <div className="flex gap-2 flex-wrap mt-2">
                            {project.tech_stack.slice(0, 5).map((tech: string) => (
                                <span key={tech} className="px-3 py-1 bg-gray-700 rounded-full text-sm font-medium text-white">
                                    {tech}
                                </span>
                            ))}
                            {project.tech_stack.length > 5 && (
                                <span className="px-3 py-1 bg-gray-700 rounded-full text-sm font-medium text-gray-400">
                                    +{project.tech_stack.length - 5} more
                                </span>
                            )}
                        </div>
                    )}

                    {/* Developer Info Link - Already properly implemented */}
                    <Link
                        href={`/${project.developer?.username ?? '#'}`}
                        className="inline-flex items-center gap-3 mt-4 group/devinfo focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-primary rounded cursor-pointer"
                        aria-label={`View profile of ${project.developer?.name || 'developer'}`}
                        {...(!project.developer?.username ? { 'aria-disabled': true, tabIndex: -1, style: { pointerEvents: 'none' } } : {})}
                    >
                        <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gray-700 text-white group-hover/devinfo:ring-2 group-hover/devinfo:ring-primary transition-all duration-300 flex-shrink-0">
                            {project.developer?.profile_picture ? (
                                <Image src={project.developer.profile_picture} alt={project.developer.name || 'Developer'} fill sizes="40px" className="object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-primary/20 text-primary font-medium">
                                    {project.developer?.name?.charAt(0).toUpperCase() || 'D'}
                                </div>
                            )}
                        </div>
                        <span className="text-base font-medium text-gray-300 group-hover/devinfo:text-primary transition-colors duration-300 truncate">
                            {project.developer?.name || 'Anonymous Developer'}
                        </span>
                    </Link>
                </div>

                {/* Bottom part: Actions */}
                <div className="flex justify-end items-center">
                    <div className="flex gap-2 md:gap-3 text-gray-400">
                        {/* Comments Link */}
                        <Link
                            href={`/projects/${project.id}`}
                            className="flex items-center gap-1.5 bg-gray-700/50 px-3 py-1.5 rounded-full hover:bg-gray-700 text-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-primary cursor-pointer"
                            aria-label={`${project.comments_count} comments, view comments`}
                            title={`${project.comments_count} comments`}
                        >
                            <MessageCircle className="w-4 h-4 flex-shrink-0" />
                            <span className="text-sm font-medium">{project.comments_count ?? 0}</span>
                        </Link>

                        {/* Upvote Button - Already properly implemented */}
                        {!isLoadingUserInteraction ? (
                            <div>
                                <UpvoteButton
                                    projectId={project.id}
                                    initialUpvotes={project.upvotes_count ?? 0}
                                    initialHasUpvoted={initialHasUpvoted}
                                    size="sm"
                                />
                            </div>
                        ) : (
                            <Skeleton className="bg-gray-700 h-8 w-20 bg-gray-700 rounded-full" />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

// SkeletonProjectCard remains largely the same, just ensure its structure
// mimics the final ProjectCard layout (especially the actions part).
export function SkeletonProjectCard() {
    return (
        <div className="bg-gray-800 p-4 md:p-6 rounded-xl border border-gray-700">
            <div className="flex flex-col justify-between h-full"> {/* Mimic structure */}
                {/* Top part Skeleton */}
                <div className="space-y-3 mb-4">
                    <div className="flex items-center gap-4">
                        <Skeleton className="bg-gray-700 w-12 h-12 rounded-lg bg-gray-700 flex-shrink-0" />
                        <div className="flex-grow space-y-2">
                            <Skeleton className="bg-gray-700 h-6 w-3/4 bg-gray-700" />
                            <Skeleton className="bg-gray-700 h-4 w-1/4 bg-gray-700" />
                        </div>
                    </div>
                    <Skeleton className="bg-gray-700 h-4 w-full bg-gray-700" />
                    <Skeleton className="bg-gray-700 h-4 w-5/6 bg-gray-700" />
                    <div className="flex gap-2 flex-wrap mt-2">
                        <Skeleton className="bg-gray-700 h-6 w-16 bg-gray-700 rounded-full" />
                        <Skeleton className="bg-gray-700 h-6 w-20 bg-gray-700 rounded-full" />
                        <Skeleton className="bg-gray-700 h-6 w-12 bg-gray-700 rounded-full" />
                    </div>
                    <div className="flex items-center gap-3 mt-4">
                        <Skeleton className="bg-gray-700 w-10 h-10 rounded-full bg-gray-700" />
                        <Skeleton className="bg-gray-700 h-4 w-24 bg-gray-700" />
                    </div>
                </div>
                {/* Bottom part Skeleton */}
                <div className="flex justify-end items-center"> {/* Mimic alignment */}
                    <div className="flex gap-2 md:gap-3"> {/* Mimic gap */}
                        <Skeleton className="bg-gray-700 h-8 w-16 bg-gray-700 rounded-full" /> {/* Comments */}
                        <Skeleton className="bg-gray-700 h-8 w-20 bg-gray-700 rounded-full" /> {/* Upvote */}
                    </div>
                </div>
            </div>
        </div>
    )
}