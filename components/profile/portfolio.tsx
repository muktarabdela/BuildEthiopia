import Image from "next/image"
import { ThumbsUp, MessageSquare, Bookmark, Heart } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import { ProjectCard } from "@/components/ProjectCard"

export default function PortfolioSection({ user, savedProjects = [], upvotedProjects = [] }) {
    return (
        <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
                <CardTitle className="text-white">Portfolio</CardTitle>
            </CardHeader>
            <CardContent>
                <Tabs defaultValue="portfolio" className="w-full">
                    <TabsList className="grid w-full grid-cols-3 bg-gray-700">
                        <TabsTrigger value="portfolio" className="text-white data-[state=active]:bg-gray-600">
                            Portfolio
                        </TabsTrigger>
                        <TabsTrigger value="upvoted" className="text-white data-[state=active]:bg-gray-600">
                            Upvoted
                        </TabsTrigger>
                        <TabsTrigger value="saved" className="text-white data-[state=active]:bg-gray-600">
                            Saved
                        </TabsTrigger>
                    </TabsList>

                    {/* Portfolio Tab */}
                    <TabsContent value="portfolio">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                            {user.projects.map(project => (
                                <Link href={`/projects/${project.id}`} key={project.id} className="bg-gray-700 text-white rounded-lg p-4 hover:bg-gray-600 transition-colors">
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
                            ))}
                        </div>
                    </TabsContent>

                    {/* Upvoted Tab */}
                    <TabsContent value="upvoted">
                        <div className="-4">
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

                    {/* Saved Tab */}
                    <TabsContent value="saved">
                        <div className="gri-4">
                            {savedProjects.length > 0 ? (
                                savedProjects.map((project, index) => (
                                    <ProjectCard key={project.id} project={project} index={index} />
                                ))
                            ) : (
                                <div className="col-span-2 flex flex-col items-center justify-center p-8">
                                    <Bookmark className="h-12 w-12 text-gray-400 mb-4" />
                                    <p className="text-gray-400">No saved projects yet.</p>
                                </div>
                            )}
                        </div>
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    )
}

