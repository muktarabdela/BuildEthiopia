import Link from "next/link"
import Image from "next/image"
import { Calendar } from "lucide-react"

// Helper function to get a random gradient color for the project banner
const getRandomColor = () => {
    const colors = [
        "bg-gradient-to-r from-blue-500 to-indigo-600",
        "bg-gradient-to-r from-purple-500 to-pink-500",
        "bg-gradient-to-r from-green-500 to-teal-500",
        "bg-gradient-to-r from-orange-500 to-red-500",
        "bg-gradient-to-r from-indigo-500 to-purple-600",
    ]
    return colors[Math.floor(Math.random() * colors.length)]
}

export default function ProjectHero({ project }) {
    const developer = project.developer

    return (
        <div className={`${getRandomColor()} text-white relative overflow-hidden`}>
            <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-20"></div>
            <div className="container mx-auto px-4 py-16 relative">
                <div className="max-w-4xl mx-auto">
                    <div className="mb-8">
                        <div className="flex items-center space-x-2 mb-4">
                            <Link href="/projects" className="text-white/80 hover:text-white text-sm font-medium">
                                Projects
                            </Link>
                            <span className="text-white/60">/</span>
                            <span className="text-white/80 text-sm font-medium truncate">{project.title}</span>
                        </div>
                        <div className="flex items-center gap-4 mb-4">
                            {project.logo_url && (
                                <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-white/20 flex-shrink-0 shadow-lg hover:shadow-xl transition-shadow duration-300 hover:-translate-y-1 transform transition-transform">
                                    <Image
                                        src={project.logo_url || "/placeholder.svg"}
                                        alt={`${project.title} logo`}
                                        fill
                                        className="object-contain p-1"
                                    />
                                </div>
                            )}
                            <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/80">
                                {project.title}
                            </h1>
                        </div>
                        <p className="text-xl text-white/90 mb-6 max-w-3xl">{project.description?.split("\n")[0]}</p>

                        {/* Developer Info */}
                        <div className="flex items-center">
                            <Link href={`/${developer?.username}`} className="flex items-center group">
                                <div className="relative w-10 h-10 rounded-full overflow-hidden bg-white/20 mr-3">
                                    {developer?.profile_picture ? (
                                        <Image
                                            src={developer.profile_picture || "/placeholder.svg"}
                                            alt={developer.name}
                                            fill
                                            className="object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-white font-medium">
                                            {developer.name?.charAt(0).toUpperCase() || "D"}
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <p className="font-medium text-white group-hover:underline">{developer.name}</p>
                                    <div className="flex items-center text-white/70 text-sm">
                                        <Calendar className="h-3.5 w-3.5 mr-1" />
                                        <span>{new Date(project.created_at).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

