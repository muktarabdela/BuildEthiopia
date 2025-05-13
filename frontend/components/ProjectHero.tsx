import Link from "next/link"
import Image from "next/image"
import { Calendar } from "lucide-react"
import { Skeleton } from "./ui/skeleton"

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
        <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-500 text-white relative overflow-hidden">
            {/* Subtle layered background */}
            <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent"></div>

            <div className="container mx-auto px-4 py-12 relative">
                <div className="max-w-4xl mx-auto">
                    {/* Breadcrumbs */}
                    <div className="flex items-center space-x-2 mb-3">
                        <Link href="/projects" className="text-white/80 hover:text-white text-sm font-medium">
                            Projects
                        </Link>
                        <span className="text-white/60">/</span>
                        <span className="text-white/80 text-sm font-medium truncate">{project.title}</span>
                    </div>

                    {/* Logo and Title */}
                    <div className="flex items-center gap-4 mb-6">
                        {project.logo_url && (
                            <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-white/10 flex-shrink-0 shadow-sm hover:shadow-md transition-shadow duration-300 hover:-translate-y-0.5 transform transition-transform">
                                <Image
                                    src={project.logo_url || "/placeholder.svg"}
                                    alt={`${project.title} logo`}
                                    fill
                                    className="object-contain p-1"
                                />
                            </div>
                        )}
                        <h1 className="text-3xl md:text-4xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/80">
                            {project.title}
                        </h1>
                    </div>

                    {/* Description */}
                    <p className="text-lg text-white/90 mb-6 max-w-3xl">{project.description?.split("\n")[0]}</p>

                    {/* Developer Info */}
                    <div className="flex items-center">
                        <Link href={`/${developer?.username}`} className="flex items-center group">
                            <div className="relative w-8 h-8 rounded-full overflow-hidden bg-white/10 mr-3">
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
    )
}

export function SkeletonProjectHero() {
    return (
        // Use a neutral background, like muted or gray, standard for skeletons
        // Removed the random color logic as it's for the loaded state.
        <div className="bg-muted relative overflow-hidden">
            {/* Optional: Add a very subtle static overlay if you want to mimic that effect */}
            {/* <div className="absolute inset-0 bg-gradient-to-r from-black/5 to-transparent opacity-10"></div> */}

            <div className="container mx-auto px-4 py-16 relative">
                <div className="max-w-4xl mx-auto">
                    <div className="mb-8">
                        {/* Breadcrumbs Skeleton */}
                        <div className="flex items-center space-x-2 mb-4">
                            <Skeleton className="bg-gray-700 h-4 w-20 rounded " />
                            <span className="text-muted-foreground">/</span> {/* Keep static elements */}
                            <Skeleton className="bg-gray-700 h-4 w-32 rounded" />
                        </div>

                        {/* Logo and Title Skeleton */}
                        <div className="flex items-center gap-4 mb-4">
                            {/* Logo Skeleton */}
                            <Skeleton className="bg-gray-700 h-16 w-16 rounded-lg flex-shrink-0" />
                            {/* Title Skeleton */}
                            <Skeleton className="bg-gray-700 h-10 md:h-12 w-3/4 rounded" />
                        </div>

                        {/* Description Skeleton */}
                        <div className="space-y-2 mb-6 max-w-3xl">
                            <Skeleton className="bg-gray-700 h-5 w-full rounded" />
                            <Skeleton className="bg-gray-700 h-5 w-5/6 rounded" /> {/* Simulate slightly shorter second line */}
                        </div>


                        {/* Developer Info Skeleton */}
                        <div className="flex items-center">
                            <div className="flex items-center group">
                                {/* Avatar Skeleton */}
                                <Skeleton className="bg-gray-700 h-10 w-10 rounded-full mr-3" />
                                {/* Name and Date Skeleton */}
                                <div className="space-y-1.5">
                                    <Skeleton className="bg-gray-700 h-4 w-28 rounded" /> {/* Developer Name */}
                                    <div className="flex items-center text-muted-foreground text-sm">
                                        {/* Keep the icon for structure, grayed out */}
                                        <Calendar className="h-3.5 w-3.5 mr-1 text-muted-foreground/50" />
                                        <Skeleton className="bg-gray-700 h-3 w-20 rounded" /> {/* Date */}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
