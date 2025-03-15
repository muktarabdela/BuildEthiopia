import Link from 'next/link';

import { MessageCircle, ArrowUp, Sparkles } from "lucide-react"
import Image from 'next/image';
import UpvoteButton from '@/app/projects/[id]/UpvoteButton';

export function ProjectCard({ project, index }) {
    console.log("ProjectCard", project)
    return (
        <div className="group bg-gray-800 p-6 rounded-xl border border-gray-700 hover:border-primary/50 transition-all duration-300">
            {/* Main content wrapper */}
            <div className="flex justify-between gap-4">
                {/* Left section with project info */}
                <Link
                    key={project.id}
                    href={`/projects/${project.id}`}
                    className="flex items-start gap-4 flex-1"
                >
                    {/* Project Icon or Logo */}
                    <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center ${project.logo_url ? "bg-transparent" : "bg-primary/20"}`}
                    >
                        {project.logo_url ? (
                            <img
                                src={project.logo_url}
                                alt={project.title}
                                className="w-full h-full object-cover rounded-lg"
                            />
                        ) : (
                            <Sparkles className="w-5 h-5 text-primary" />
                        )}
                    </div>

                    {/* Project Details */}
                    <div className="flex-1">
                        <h2 className="text-lg font-semibold text-gray-100 group-hover:text-primary transition-colors">
                            {index + 1}. {project.title}
                        </h2>
                        <p className="text-gray-300 text-sm mt-1">{project.description}</p>
                        {/* <div className="flex gap-2 flex-wrap mt-3">
                            {project.images?.map((image, idx) => (
                                <img key={idx} src={image} alt={`Screenshot ${idx + 1}`} className="w-16 h-16 object-cover rounded-md" />
                            ))}
                        </div> */}
                        <div className="flex gap-2 flex-wrap mt-3">
                            {project.tags?.map((tag) => (
                                <span
                                    key={tag}
                                    className="px-2.5 py-0.5 bg-gray-700 text-gray-300 rounded-full text-xs font-medium"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>

                        {/* Developer Info */}
                        <Link href={`/${project.developer.username}`}
                            className="flex items-center gap-2 mt-4 hover:underline group-hover:text-primary text-gray-100 transition-colors">
                            <div className="relative w-8 h-8 rounded-full overflow-hidden bg-gray-700 mr-2">
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
                            <span className="text-sm font-medium text-gray-300">
                                {project.developer?.name || 'Anonymous Developer'}
                            </span>
                        </Link>
                    </div>
                </Link>

                {/* Right section with actions */}
                <div className="flex flex-col items-end gap-3">
                    {/* Stats */}
                    <div className="flex items-center gap-3 text-gray-400">
                        <div className="flex items-center gap-1">
                            <MessageCircle className="w-4 h-4" />
                            <span className="text-sm">{project.comments_count}</span>
                        </div>

                        <div className="flex items-center gap-1">
                            <UpvoteButton
                                projectId={project?.id}
                                initialUpvotes={project.upvotes_count}
                                className="hover:bg-primary/20"
                            />
                        </div>
                    </div>

                    {/* Hire button */}
                    {/* <button className="px-4 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 rounded-full hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                        Hire {project.developer?.name || 'developer'}
                    </button> */}
                </div>
            </div>
        </div>
    )
}

