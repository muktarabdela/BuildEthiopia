import Link from "next/link"
import Image from "next/image"
import { User, Github, Linkedin } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"

export default function ProjectSidebar({ developer }) {

    const statusOptions = [
        { value: 'Open to work', label: 'Open to Work' },
        { value: 'Hiring', label: 'Hiring' },
        { value: 'none', label: 'None' }
    ];
    return (

        <div className="space-y-8">
            {/* Developer Info */}
            <Card className="overflow-hidden bg-gray-800/50 backdrop-blur-sm border border-gray-700/30 hover:border-gray-700/50 transition-all duration-300 sticky top-4">
                <CardHeader className="bg-gray0/30 rounded-md border-b border-gray-700/30">
                    <CardTitle className="flex items-center text-gray-100 text-lg">
                        <User className="h-5 w-5 text-primary mr-2 " />
                        About the Developer
                    </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                    <div className="flex flex-col items-center text-center mb-4">
                        <div className="relative w-20 h-20 rounded-full overflow-hidden bg-gray-700 text-white mb-3 ring-2 ring-primary/20">
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
                            <Link
                                href={developer.github_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-400 hover:text-gray-100 transition-colors"
                            >
                                <Github className="h-5 w-5" />
                            </Link>
                        )}
                        {developer.linkedin_url && (
                            <Link
                                href={developer.linkedin_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-400 hover:text-gray-100 transition-colors"
                            >
                                <Linkedin className="h-5 w-5" />
                            </Link>
                        )}
                    </div>

                    <Link href={`/${developer.username}`}>
                        {/* developer status */}
                        <div className="flex flex-col items-center justify-center mb-4">
                            {/* <span className="text-sm text-gray-400">
                                @{developer.username}
                            </span> */}
                            {/* <span className="mx-2 text-gray-400">|</span> */}
                            <span className="text-sm text-gray-400">
                                {developer?.status && developer.status !== 'none' && (
                                    <div className={`px-4 py-2 rounded-full ${statusOptions.find(opt => opt.value === developer.status)?.color || 'bg-gray-700 text-white'} text-white text-sm font-medium`}>
                                        {statusOptions.find(opt => opt.value === developer.status)?.label}
                                    </div>
                                )}
                            </span>
                        </div>
                        <Button
                            variant="outline"
                            className="w-full text-gray-200 border-gray-700 hover:bg-gray-700 text-white hover:text-white"
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
                            <div className="w-12 h-12 rounded-md bg-gray-700 text-white flex-shrink-0 overflow-hidden">
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
                            <div className="w-12 h-12 rounded-md bg-gray-700 text-white flex-shrink-0 overflow-hidden">
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


export function SkeletonProjectSidebar() {
    return (
        // Maintain overall structure and spacing
        <div className="space-y-8">
            {/* Developer Info Skeleton */}
            <Card className="overflow-hidden bg-muted border border-gray-700 sticky top-4"> {/* Use muted colors, keep sticky */}
                <CardHeader className="border-b border-gray-700">
                    <CardTitle className="flex items-center text-muted-foreground text-lg">
                        <User className="h-5 w-5 text-muted-foreground/50 mr-2" /> {/* Muted icon */}
                        <Skeleton className="bg-gray-700 h-5 w-48" /> {/* "About the Developer" */}
                    </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                    {/* Centered Avatar and Name Placeholder */}
                    <div className="flex flex-col items-center text-center mb-4">
                        <Skeleton className="bg-gray-700 h-20 w-20 rounded-full mb-3" /> {/* Avatar */}
                        <Skeleton className="bg-gray-700 h-6 w-32 mb-1" /> {/* Name */}
                    </div>

                    {/* Bio Placeholder (assume 2-3 lines) */}
                    <div className="space-y-1.5 mb-4">
                        <Skeleton className="bg-gray-700 h-4 w-full" />
                        <Skeleton className="bg-gray-700 h-4 w-11/12" />
                        <Skeleton className="bg-gray-700 h-4 w-5/6" />
                    </div>


                    {/* Social Links Placeholder */}
                    <div className="flex justify-center space-x-3 mb-4">
                        <Skeleton className="bg-gray-700 h-5 w-5" /> {/* GitHub icon placeholder */}
                        <Skeleton className="bg-gray-700 h-5 w-5" /> {/* LinkedIn icon placeholder */}
                    </div>

                    {/* Status Badge Placeholder */}
                    <div className="flex flex-col items-center justify-center mb-4">
                        <Skeleton className="bg-gray-700 h-7 w-28 rounded-full" /> {/* Status Badge */}
                    </div>

                    {/* View Profile Button Placeholder */}
                    <Skeleton className="bg-gray-700 h-9 w-full rounded-md" /> {/* Button */}
                </CardContent>
            </Card>

            {/* Related Projects Skeleton */}
            <Card className="overflow-hidden bg-muted border border-gray-700">
                <CardHeader className="border-b border-gray-700">
                    <CardTitle className="flex items-center text-muted-foreground text-lg">
                        <User className="h-5 w-5 text-muted-foreground/50 mr-2" /> {/* Muted icon */}
                        <Skeleton className="bg-gray-700 h-5 w-40" /> {/* "More by {Name}" */}
                    </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                    {/* List of Project Placeholders (repeat 2-3 times) */}
                    <div className="space-y-4">
                        {/* Placeholder Item 1 */}
                        <div className="flex items-start gap-3">
                            <Skeleton className="bg-gray-700 w-12 h-12 rounded-md flex-shrink-0" /> {/* Thumbnail */}
                            <div className="space-y-1.5 flex-1">
                                <Skeleton className="bg-gray-700 h-5 w-32" /> {/* Project Title */}
                                <Skeleton className="bg-gray-700 h-4 w-full" /> {/* Description Line 1 */}
                                <Skeleton className="bg-gray-700 h-4 w-11/12" /> {/* Description Line 2 */}
                            </div>
                        </div>

                        {/* Placeholder Item 2 */}
                        <div className="flex items-start gap-3">
                            <Skeleton className="bg-gray-700 w-12 h-12 rounded-md flex-shrink-0" /> {/* Thumbnail */}
                            <div className="space-y-1.5 flex-1">
                                <Skeleton className="bg-gray-700 h-5 w-40" /> {/* Project Title */}
                                <Skeleton className="bg-gray-700 h-4 w-full" /> {/* Description Line 1 */}
                                <Skeleton className="bg-gray-700 h-4 w-5/6" /> {/* Description Line 2 */}
                            </div>
                        </div>

                        {/* Placeholder Item 3 (Optional) */}
                        <div className="flex items-start gap-3">
                            <Skeleton className="bg-gray-700 w-12 h-12 rounded-md flex-shrink-0" /> {/* Thumbnail */}
                            <div className="space-y-1.5 flex-1">
                                <Skeleton className="bg-gray-700 h-5 w-28" /> {/* Project Title */}
                                <Skeleton className="bg-gray-700 h-4 w-full" /> {/* Description Line 1 */}
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
