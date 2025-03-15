import Link from 'next/link';

import { MessageCircle, ArrowUp, Sparkles } from "lucide-react"
import Image from 'next/image';
import UpvoteButton from '@/app/projects/[id]/UpvoteButton';

export function ProjectCard({ project, index }) {
    return (
        <div className="group bg-gray-800 p-4 md:p-6 rounded-xl border border-gray-700 hover:border-primary/50 transition-all duration-300 relative overflow-hidden">
            {/* Subtle background pattern */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:20px_20px] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            <div className="flex flex-col md:flex-row justify-between gap-6 relative z-10">
                {/* Left section with project info */}
                <Link
                    key={project.id}
                    href={`/projects/${project.id}`}
                    className="flex items-start gap-4 flex-1"
                >
                    {/* Project Icon or Logo */}
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${project.logo_url ? "bg-transparent" : "bg-primary/20"} group-hover:bg-primary/30 transition-colors duration-300`}>
                        {project.logo_url ? (
                            <img
                                src={project.logo_url}
                                alt={project.title}
                                className="w-full h-full object-cover rounded-lg"
                            />
                        ) : (
                            <Sparkles className="w-5 h-5 text-primary group-hover:text-primary-400 transition-colors duration-300" />
                        )}
                    </div>

                    {/* Project Details */}
                    <div className="flex-1 space-y-2">
                        <h2 className="text-lg font-semibold text-gray-100 group-hover:text-primary transition-colors duration-300">
                            {index + 1}. {project.title}
                        </h2>

                        {project.category && (
                            <span className="inline-block px-2 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full">
                                {project.category}
                            </span>
                        )}

                        <p className="text-gray-300 text-sm line-clamp-2">{project.description}</p>

                        {/* Tech stack */}
                        {project.tech_stack?.length > 0 && (
                            <div className="flex gap-2 flex-wrap mt-2">
                                {project.tech_stack.map((tech) => (
                                    <span
                                        key={tech}
                                        className="px-2 py-1 bg-gray-700/50 text-gray-300 rounded-full text-xs font-medium hover:bg-gray-700 transition-colors duration-200"
                                    >
                                        {tech}
                                    </span>
                                ))}
                            </div>
                        )}

                        {/* Tags */}
                        {project.tags?.length > 0 && (
                            <div className="flex gap-2 flex-wrap">
                                {project.tags.map((tag) => (
                                    <span
                                        key={tag}
                                        className="px-2 py-1 bg-gray-700/50 text-gray-300 rounded-full text-xs font-medium hover:bg-gray-700 transition-colors duration-200"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        )}

                        {/* Developer Info */}
                        <Link
                            href={`/${project.developer.username}`}
                            className="flex items-center gap-2 mt-4 hover:underline"
                        >
                            <div className="relative w-8 h-8 rounded-full overflow-hidden bg-gray-700 group-hover:ring-2 group-hover:ring-primary transition-all duration-300">
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
                            <span className="text-sm font-medium text-gray-300 group-hover:text-primary transition-colors duration-300">
                                {project.developer?.name || 'Anonymous Developer'}
                            </span>
                        </Link>
                    </div>
                </Link>

                {/* Right section with actions */}
                <div className="flex flex-row md:flex-col items-start md:items-end gap-4">
                    {/* Stats */}
                    <div className="flex items-center gap-4 text-gray-400">
                        <div className="flex items-center gap-2 bg-gray-700/50 px-3 py-1.5 rounded-full hover:bg-gray-700 transition-colors duration-200">
                            <MessageCircle className="w-4 h-4" />
                            <span className="text-sm">{project.comments_count}</span>
                        </div>

                        <div className="flex items-center gap-2 bg-gray-700/50 px-3 py-1.5 rounded-full hover:bg-gray-700 transition-colors duration-200">
                            <UpvoteButton
                                projectId={project?.id}
                                initialUpvotes={project.upvotes_count}
                                className="hover:bg-primary/20"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

