import Image from "next/image"
import { ThumbsUp, MessageSquare } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"

export default function PortfolioSection({ user }) {
    console.log("user", user.projects)
    return (
        <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
                <CardTitle className="text-white">Portfolio</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {user.projects.map(project => (
                        <Link href={`/projects/${project.id}`} key={project.id} className="bg-gray-700 rounded-lg p-4 hover:bg-gray-600 transition-colors">
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
                            <div className="flex items-center mt-4 text-gray-400">
                                <ThumbsUp className="h-4 w-4 mr-1" />
                                <span>{project.upvotes} upvotes</span>
                            </div>
                        </Link>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}

