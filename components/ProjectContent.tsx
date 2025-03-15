import Image from "next/image"
import { Layers, Code, CheckCircle, Video, ChevronLeft, ChevronRight, X } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import CommentsSection from "@/app/projects/[id]/CommentsSection"
import { Dialog, DialogContent } from "./ui/dialog"
import { Button } from "./ui/button"
import { useState } from "react"

// Helper function to extract YouTube video ID from URL
const getYouTubeVideoId = (url: string | null): string => {
    if (!url) return ""

    // Handle different YouTube URL formats
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
    const match = url.match(regExp)

    return match && match[2].length === 11 ? match[2] : ""
}

export default function ProjectContent({ project }) {
    const comments = project.comments

    return (
        <div className="md:col-span-2 space-y-8">
            {/* Project Description */}
            <Card className="overflow-hidden bg-gray-800/50 backdrop-blur-sm border border-gray-700/30 hover:border-gray-700/50 transition-all duration-300">
                <CardHeader className="bg-/30 border-b rounded-md border-gray-300/30 ">
                    <CardTitle className="flex items-center text-gray-100 text-lg">
                        <Layers className="h-5 w-5 text-primary mr-2" />
                        Project Overview
                    </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                    <div className="prose max-w-none text-gray-300">
                        <p className="whitespace-pre-wrap">{project.description}</p>

                        {project.post_content && (
                            <div className="mt-6 pt-6 border-t border-gray-700">
                                <h3 className="text-lg font-medium mb-3 text-gray-100">Detailed Information</h3>
                                <p className="whitespace-pre-wrap">{project.post_content}</p>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Media Gallery - YouTube + Images */}
            <ProjectMediaGallery project={project} />

            {/* Tech Stack */}
            <Card className="overflow-hidden bg-gray-800/50 backdrop-blur-sm border border-gray-700/30 hover:border-gray-700/50 transition-all duration-300">
                <CardHeader className="bg-0/30 border-b rounded-md border-gray-700/30">
                    <CardTitle className="flex items-center text-gray-100 text-lg">
                        <Code className="h-5 w-5 text-primary mr-2 " />
                        Tech Stack
                    </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                    <div className="flex flex-wrap gap-2">
                        {project.tech_stack && project.tech_stack.length > 0 ? (
                            project.tech_stack.map((tech, index) => {
                                const colors = [
                                    "bg-blue-500/10 text-blue-400 border border-blue-500/20",
                                    "bg-green-500/10 text-green-400 border border-green-500/20",
                                    "bg-purple-500/10 text-purple-400 border border-purple-500/20",
                                    "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20",
                                    "bg-pink-500/10 text-pink-400 border border-pink-500/20",
                                ]
                                const colorClass = colors[index % colors.length]

                                return (
                                    <span
                                        key={index}
                                        className={`px-3 py-1 ${colorClass} rounded-full text-sm hover:scale-105 transition-transform`}
                                    >
                                        {tech}
                                    </span>
                                )
                            })
                        ) : (
                            <span className="text-gray-400 text-sm">No technologies specified</span>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Key Features */}
            <Card className="overflow-hidden bg-gray-800/50 backdrop-blur-sm border border-gray-700/30 hover:border-gray-700/50 transition-all duration-300">
                <CardHeader className="bg-gray00/30 rounded-md border-b border-gray-700/30">
                    <CardTitle className="flex items-center text-gray-100 text-lg">
                        <CheckCircle className="h-5 w-5 text-primary mr-2" />
                        Key Features
                    </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                    <ul className="space-y-3">
                        <li className="flex items-start">
                            <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-300">Responsive design that works on all devices</span>
                        </li>
                        <li className="flex items-start">
                            <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-300">Real-time updates using WebSockets</span>
                        </li>
                        <li className="flex items-start">
                            <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-300">Authentication with social login options</span>
                        </li>
                        <li className="flex items-start">
                            <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-300">Optimized performance with server-side rendering</span>
                        </li>
                    </ul>
                </CardContent>
            </Card>

            {/* Comments Section */}
            <CommentsSection projectId={project?.id} initialComments={comments} commentsCount={project.comments_count} />
        </div>
    )
}

// Media Gallery Component
function ProjectMediaGallery({ project }) {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [selectedMedia, setSelectedMedia] = useState<{ type: "video" | "image"; src: string } | null>(null)
    const [currentImageIndex, setCurrentImageIndex] = useState(0)

    const hasVideo = project.youtube_video_url && getYouTubeVideoId(project.youtube_video_url)
    const hasImages = project.images && project.images.length > 0

    if (!hasVideo && !hasImages) return null

    const handleVideoClick = () => {
        setSelectedMedia({
            type: "video",
            src: `https://www.youtube.com/embed/${getYouTubeVideoId(project.youtube_video_url)}?autoplay=1`,
        })
        setIsModalOpen(true)
    }

    const handleImageClick = (index: number) => {
        setCurrentImageIndex(index)
        setSelectedMedia({
            type: "image",
            src: project.images[index],
        })
        setIsModalOpen(true)
    }

    const handlePrevious = () => {
        setCurrentImageIndex((prev) => {
            const newIndex = prev - 1
            setSelectedMedia({
                type: "image",
                src: project.images[newIndex],
            })
            return newIndex
        })
    }

    const handleNext = () => {
        setCurrentImageIndex((prev) => {
            const newIndex = prev + 1
            setSelectedMedia({
                type: "image",
                src: project.images[newIndex],
            })
            return newIndex
        })
    }

    return (
        <>
            <Card className="overflow-hidden bg-gray-800/50 backdrop-blur-sm border border-gray-700/30 hover:border-gray-700/50 transition-all duration-300">
                <CardHeader className="bg-gray-800/30 border-b rounded-md border-gray-700/30">
                    <CardTitle className="flex items-center text-gray-100 text-lg">
                        <Video className="h-5 w-5 text-primary mr-2" />
                        Project Gallery
                    </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                    <div className="grid grid-cols-2 gap-6 overflow-y-auto">
                        {/* YouTube Video */}
                        {hasVideo && (
                            <div
                                className="relative aspect-video rounded-lg overflow-hidden border border-gray-700/30 cursor-pointer"
                                onClick={handleVideoClick}
                            >
                                <iframe
                                    src={`https://www.youtube.com/embed/${getYouTubeVideoId(project.youtube_video_url)}`}
                                    title="YouTube video player"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                    className="absolute top-0 left-0 w-full h-full"
                                />
                            </div>
                        )}

                        {/* Image Gallery */}
                        {hasImages && (
                            <div
                                className={`relative aspect-video rounded-lg overflow-hidden border border-gray-700/30 cursor-pointer`}
                            >
                                {project.images.slice(0, 4).map((image, index) => (
                                    <div
                                        key={index}
                                        className="relative aspect-video rounded-lg overflow-hidden border border-gray-700/30 hover:border-gray-700/50 transition-all group cursor-pointer"
                                        onClick={() => handleImageClick(index)}
                                    >
                                        <Image
                                            src={image || "/placeholder.svg"}
                                            alt={`Project image ${index + 1}`}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                                        />
                                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </div>
                                ))}
                                {project.images.length > 4 && (
                                    <div
                                        className="relative aspect-video rounded-lg overflow-hidden border border-gray-700/30 hover:border-gray-700/50 transition-all group cursor-pointer"
                                        onClick={() => handleImageClick(4)}
                                    >
                                        <Image
                                            src={project.images[4] || "/placeholder.svg"}
                                            alt="Project image 5"
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                                        />
                                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                            <span className="text-white font-medium text-lg">+{project.images.length - 4} more</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Full-screen Modal */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="max-w-7xl bg-black/90 border-gray-800">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-4 top-4 text-gray-400 hover:text-white"
                        onClick={() => setIsModalOpen(false)}
                    >
                        <X className="h-6 w-6" />
                    </Button>

                    <div className="relative w-full aspect-video">
                        {selectedMedia?.type === "video" ? (
                            <iframe
                                src={selectedMedia.src}
                                title="YouTube video player"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                className="absolute top-0 left-0 w-full h-full"
                            />
                        ) : (
                            <div className="relative w-full h-full">
                                <Image src={selectedMedia?.src || ""} alt="Project image" fill className="object-contain" />
                                {selectedMedia?.type === "image" && project.images.length > 1 && (
                                    <>
                                        {currentImageIndex > 0 && (
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                                                onClick={handlePrevious}
                                            >
                                                <ChevronLeft className="h-8 w-8" />
                                            </Button>
                                        )}
                                        {currentImageIndex < project.images.length - 1 && (
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                                                onClick={handleNext}
                                            >
                                                <ChevronRight className="h-8 w-8" />
                                            </Button>
                                        )}
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
}

