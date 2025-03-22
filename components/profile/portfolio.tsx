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

const aboutDeveloper = {
    fullName: "Jane Developer",
    bio: "A passionate full-stack developer focused on building scalable and accessible web applications.",
    experience: "5+ years",
    expertise: ["React", "Next.js", "Node.js", "TypeScript", "PostgreSQL"],
    education: "B.Sc. in Computer Science, XYZ University",
    interests: "Open-source, DevOps, UI/UX design"
};

export default function PortfolioSection({ user, upvotedProjects = [], isOwner }) {
    console.log("is owner from portfolio", isOwner)
    const [editingProject, setEditingProject] = useState(null)

    const handleUpdateProject = (updatedProject) => {
        // Update the project in the user's projects array
        const updatedProjects = user.projects.map(project =>
            project.id === updatedProject.id ? updatedProject : project
        )
        user.projects = updatedProjects
    }

    return (
        <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
                <CardTitle className="text-white">Portfolio</CardTitle>
            </CardHeader>
            <CardContent>
                <Tabs defaultValue="portfolio" className="w-full">
                    <TabsList className="grid w-full grid-cols-4 bg-gray-700">
                        <TabsTrigger value="portfolio" className="text-white data-[state=active]:bg-gray-600">
                            Portfolio
                        </TabsTrigger>
                        <TabsTrigger value="upvoted" className="text-white data-[state=active]:bg-gray-600">
                            Upvoted
                        </TabsTrigger>
                        <TabsTrigger value="about" className="text-white data-[state=active]:bg-gray-600">
                            About
                        </TabsTrigger>
                    </TabsList>

                    {/* Portfolio Tab */}
                    <TabsContent value="portfolio">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                            {user.projects.map(project => (
                                <div key={project.id} className="bg-gray-700 text-white rounded-lg p-4 hover:bg-gray-600 transition-colors">
                                    <div className="flex justify-between items-start">
                                        <Link href={`/projects/${project.id}`} className="flex-1">
                                            <div className="relative h-40 w-full mb-4">
                                                <Image
                                                    src={project.thumbnail}
                                                    alt={project.title}
                                                    fill
                                                    className="rounded-lg object-cover"
                                                />
                                            </div>
                                            <h3 className="text-lg font-semibold text-white">{project.title}</h3>
                                            <p className="text-gray-300 mt-2">{project.description}</p>
                                            <div className="flex items-center mt-4 text-white">
                                                <ThumbsUp className="h-4 w-4 mr-1" />
                                                <span>{project.upvotes} upvotes</span>
                                            </div>
                                        </Link>
                                        {isOwner && (
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => setEditingProject(project)}
                                                className="text-gray-400 hover:text-white"
                                                aria-label="Edit project"
                                            >
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </TabsContent>

                    {/* Upvoted Tab */}
                    <TabsContent value="upvoted">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    <TabsContent value="about" className="mt-6">
                        <div className="space-y-8">
                            {/* Bio Section */}
                            <div className="bg-gray-700 p-6 rounded-lg">
                                <h3 className="text-xl font-semibold text-white mb-4">About Me</h3>
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

