import { Github, Globe, MessageSquare, Code, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import UpvoteButton from "@/app/projects/[id]/UpvoteButton"
import Link from "next/link"

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

export default function ProjectActionBar({ project, initialHasUpvoted }: ProjectActionBarProps) {
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
                // You might want to show a toast notification here
                console.log('Link copied to clipboard');
            }
        } catch (error) {
            console.error('Error sharing:', error);
        }
    };

    return (
        <div className="bg-gray-800 rounded-xl shadow-sm border border-gray-700 p-4 -mt-8 mb-8 flex flex-col sm:flex-row gap-4 justify-between items-center backdrop-blur-sm">
            {/* Left Section */}
            <div className="flex flex-wrap gap-3 w-full sm:w-auto justify-center sm:justify-start">
                {projectId && (
                    <UpvoteButton
                        projectId={projectId}
                        initialUpvotes={initialUpvotes}
                        initialHasUpvoted={initialHasUpvoted}
                        size="lg"
                        className="hover:bg-primary/20"
                    />
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

