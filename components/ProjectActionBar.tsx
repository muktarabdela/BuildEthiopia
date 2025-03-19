import { Github, Globe, MessageSquare, Code, Share2, Bookmark } from "lucide-react"
import { Button } from "@/components/ui/button"
import UpvoteButton from "@/app/projects/[id]/UpvoteButton"
import Link from "next/link"

export default function ProjectActionBar({ project }) {
    return (
        <div className="bg-gray-800 rounded-xl shadow-sm border border-gray-700 p-4 -mt-8 mb-8 flex flex-col sm:flex-row gap-4 justify-between items-center backdrop-blur-sm">
            {/* Left Section */}
            <div className="flex flex-wrap gap-3 w-full sm:w-auto justify-center sm:justify-start">
                <UpvoteButton
                    projectId={project?.id}
                    initialUpvotes={project.upvotes_count}
                    className="hover:bg-primary/20"
                />
                <div className="flex items-center text-gray-300">
                    <MessageSquare className="h-5 w-5 mr-1" />
                    <span className="whitespace-nowrap">{project?.comments?.length} Comments</span>
                </div>
                {project.is_open_source && (
                    <div className="flex items-center text-green-400">
                        <Code className="h-5 w-5 mr-1" />
                        <span className="whitespace-nowrap">Open Source</span>
                    </div>
                )}
            </div>

            {/* Right Section */}
            <div className="flex flex-wrap gap-3 w-full sm:w-auto justify-center sm:justify-end">
                {project.github_url && (
                    <Link
                        href={project.github_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-gray-700 text-white hover:bg-gray-600 text-white rounded-lg transition-colors whitespace-nowrap"
                    >
                        <Github className="h-5 w-5" />
                        <span className="hidden sm:inline">GitHub</span>
                    </Link>
                )}

                {project.live_url && (
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

