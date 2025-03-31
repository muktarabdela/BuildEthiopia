import Image from "next/image"
import { ThumbsUp, MessageSquare, Bookmark, Heart, Edit, GraduationCap, Briefcase, Code, BookOpen } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import { ProjectCard } from "@/components/ProjectCard"
import { EditProjectModal } from '@/components/projects/EditProjectModal'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"

const aboutDeveloper = {
    fullName: "Jane Developer",
    bio: "A passionate full-stack developer focused on building scalable and accessible web applications.",
    experience: "5+ years",
    expertise: ["React", "Next.js", "Node.js", "TypeScript", "PostgreSQL"],
    education: "B.Sc. in Computer Science, XYZ University",
    interests: "Open-source, DevOps, UI/UX design"
};

const socialLinks = [
    { name: "GitHub", icon: Code, url: "https://github.com" },
    { name: "LinkedIn", icon: Briefcase, url: "https://linkedin.com" },
    { name: "Twitter", icon: MessageSquare, url: "https://twitter.com" }
];

export default function PortfolioSection({ user, upvotedProjects = [], isOwner }) {
    const [editingProject, setEditingProject] = useState(null)
    const [activeTab, setActiveTab] = useState("Project")

    const handleUpdateProject = (updatedProject) => {
        // Update the project in the user's projects array
        const updatedProjects = user.projects.map(project =>
            project.id === updatedProject.id ? updatedProject : project
        )
        user.projects = updatedProjects
    }

    return (
        <Card className="bg-gray-900 border-gray-700 rounded-xl shadow-2xl">
            <CardHeader className="px-8 pt-8 pb-6">
                <CardTitle className="text-3xl font-bold text-white">
                    Project
                    <span className="ml-4 text-sm font-normal text-gray-400">
                        {user.projects.length} projects
                    </span>
                </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="flex justify-start space-x-4 px-8 bg-transparent border-b border-gray-700">
                        {["Project", "upvoted", "about"].map((tab) => (
                            <TabsTrigger
                                key={tab}
                                value={tab}
                                className="relative px-0 pb-3 text-sm font-medium text-gray-400 hover:text-white transition-colors data-[state=active]:text-white"
                            >
                                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-500 scale-x-0 data-[state=active]:scale-x-100 transition-transform duration-300" />
                            </TabsTrigger>
                        ))}
                    </TabsList>

                    {/* Portfolio Tab */}
                    <TabsContent value="Project" className="p-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {user.projects.map(project => (
                                <div
                                    key={project.id}
                                    className="group relative bg-gray-800 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300"
                                >
                                    <div className="relative aspect-video w-full">
                                        <Image
                                            src={project.thumbnail}
                                            alt={project.title}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                    </div>
                                    <div className="p-4">
                                        <h3 className="text-lg font-semibold text-white mb-2">{project.title}</h3>
                                        <div className="flex flex-wrap gap-2 mb-4">
                                            {project.tags?.map((tag, index) => (
                                                <Badge
                                                    key={index}
                                                    className="bg-blue-500/20 text-blue-400 hover:bg-blue-500/30"
                                                >
                                                    {tag}
                                                </Badge>
                                            ))}
                                        </div>
                                        <div className="flex items-center text-sm text-gray-400">
                                            <ThumbsUp className="h-4 w-4 mr-2" />
                                            <span>{project.upvotes} upvotes</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </TabsContent>

                    {/* Upvoted Tab */}
                    <TabsContent value="upvoted" className="p-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {upvotedProjects.length > 0 ? (
                                upvotedProjects.map((project, index) => (
                                    <ProjectCard key={project.id} project={project} index={index} />
                                ))
                            ) : (
                                <div className="col-span-2 flex flex-col items-center justify-center p-8">
                                    <Heart className="h-12 w-12 text-gray-400 mb-4" />
                                    <p className="text-gray-400">No upvoted projects yet.</p>
                                </div>
                            )}
                        </div>
                    </TabsContent>

                    {/* About Tab */}
                    <TabsContent value="about" className="p-8">
                        <div className="space-y-8">
                            {/* Profile Header
                            <div className="bg-gray-800 p-8 rounded-xl flex flex-col items-center text-center">
                                <Avatar className="h-32 w-32 mb-6 border-4 border-blue-500/20">
                                    <AvatarImage src="/avatar.jpg" />
                                    <AvatarFallback>JD</AvatarFallback>
                                </Avatar>
                                <h2 className="text-3xl font-bold text-white mb-2">{aboutDeveloper.fullName}</h2>
                                <div className="flex gap-4 mt-4">
                                    {socialLinks.map((link) => (
                                        <a
                                            key={link.name}
                                            href={link.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-gray-400 hover:text-white transition-colors"
                                            aria-label={link.name}
                                        >
                                            <link.icon className="h-6 w-6" />
                                        </a>
                                    ))}
                                </div>
                            </div> */}

                            {/* Bio Section */}
                            <div className="bg-gray-800 p-8 rounded-xl">
                                <h3 className="text-xl font-semibold text-white mb-6">About Me</h3>
                                <p className="text-gray-300 leading-relaxed">{aboutDeveloper.bio}</p>
                            </div>

                            {/* Experience & Expertise */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-gray-700 p-6 rounded-lg">
                                    <div className="flex items-center gap-3 mb-4">
                                        <Briefcase className="h-6 w-6 text-blue-400" />
                                        <h4 className="text-lg font-semibold text-white">Experience</h4>
                                    </div>
                                    <p className="text-gray-300">{aboutDeveloper.experience}</p>
                                </div>

                                <div className="bg-gray-700 p-6 rounded-lg">
                                    <div className="flex items-center gap-3 mb-4">
                                        <Code className="h-6 w-6 text-green-400" />
                                        <h4 className="text-lg font-semibold text-white">Expertise</h4>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {aboutDeveloper.expertise.map((skill, index) => (
                                            <Badge key={index} className="bg-blue-500 hover:bg-blue-600 text-white">
                                                {skill}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Education & Interests */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-gray-700 p-6 rounded-lg">
                                    <div className="flex items-center gap-3 mb-4">
                                        <GraduationCap className="h-6 w-6 text-purple-400" />
                                        <h4 className="text-lg font-semibold text-white">Education</h4>
                                    </div>
                                    <p className="text-gray-300">{aboutDeveloper.education}</p>
                                </div>

                                <div className="bg-gray-700 p-6 rounded-lg">
                                    <div className="flex items-center gap-3 mb-4">
                                        <BookOpen className="h-6 w-6 text-yellow-400" />
                                        <h4 className="text-lg font-semibold text-white">Interests</h4>
                                    </div>
                                    <p className="text-gray-300">{aboutDeveloper.interests}</p>
                                </div>
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>

                {editingProject && (
                    <EditProjectModal
                        project={editingProject}
                        isOpen={!!editingProject}
                        onClose={() => setEditingProject(null)}
                        onUpdate={handleUpdateProject}
                    />
                )}
            </CardContent>
        </Card>
    )
}

