import Link from "next/link"
import Image from "next/image"
import { User, Github, Linkedin } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function ProjectSidebar({ developer }) {
    return (
        <div className="space-y-8">
            {/* Developer Info */}
            <Card className="overflow-hidden bg-gray-800/50 backdrop-blur-sm border border-gray-700/30 hover:border-gray-700/50 transition-all duration-300 sticky top-4">
                <CardHeader className="bg-gray-800/30 border-b border-gray-700/30">
                    <CardTitle className="flex items-center text-gray-100">
                        <User className="h-5 w-5 text-primary mr-2" />
                        About the Developer
                    </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                    <div className="flex flex-col items-center text-center mb-4">
                        <div className="relative w-20 h-20 rounded-full overflow-hidden bg-gray-700 mb-3 ring-2 ring-primary/20">
                            {developer.profile_picture ? (
                                <Image
                                    src={developer.profile_picture || "/placeholder.svg"}
                                    alt={developer.name}
                                    fill
                                    className="object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary font-medium text-xl">
                                    {developer.name?.charAt(0).toUpperCase() || "D"}
                                </div>
                            )}
                        </div>
                        <h3 className="text-lg font-bold mb-1 text-gray-100">{developer.name}</h3>
                    </div>

                    {developer.bio && <p className="text-gray-300 mb-4 text-sm">{developer.bio}</p>}

                    <div className="flex justify-center space-x-3 mb-4">
                        {developer.github_url && (
                            <a
                                href={developer.github_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-400 hover:text-gray-100 transition-colors"
                            >
                                <Github className="h-5 w-5" />
                            </a>
                        )}
                        {developer.linkedin_url && (
                            <a
                                href={developer.linkedin_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-400 hover:text-gray-100 transition-colors"
                            >
                                <Linkedin className="h-5 w-5" />
                            </a>
                        )}
                    </div>

                    <Link href={`/developers/${developer.id}`}>
                        <Button
                            variant="outline"
                            className="w-full text-gray-200 border-gray-700 hover:bg-gray-700 hover:text-white"
                        >
                            View Profile
                        </Button>
                    </Link>
                </CardContent>
            </Card>

            {/* Related Projects Card */}
            <Card className="overflow-hidden bg-gray-800/50 backdrop-blur-sm border border-gray-700/30 hover:border-gray-700/50 transition-all duration-300">
                <CardHeader className="bg-gray-800/30 border-b border-gray-700/30">
                    <CardTitle className="flex items-center text-gray-100">
                        <User className="h-5 w-5 text-primary mr-2" />
                        More by {developer.name}
                    </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                    <div className="space-y-4">
                        {/* This would be populated with actual data in a real implementation */}
                        <div className="flex items-start gap-3 group">
                            <div className="w-12 h-12 rounded-md bg-gray-700 flex-shrink-0 overflow-hidden">
                                <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary">P</div>
                            </div>
                            <div>
                                <h4 className="font-medium text-gray-200 group-hover:text-primary transition-colors">
                                    Another Project
                                </h4>
                                <p className="text-sm text-gray-400 line-clamp-2">
                                    A brief description of another project by this developer.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3 group">
                            <div className="w-12 h-12 rounded-md bg-gray-700 flex-shrink-0 overflow-hidden">
                                <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary">P</div>
                            </div>
                            <div>
                                <h4 className="font-medium text-gray-200 group-hover:text-primary transition-colors">
                                    Portfolio Website
                                </h4>
                                <p className="text-sm text-gray-400 line-clamp-2">
                                    Developer's personal portfolio showcasing their work.
                                </p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

