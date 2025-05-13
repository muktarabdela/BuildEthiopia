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
                <CardHeader className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border-b border-indigo-500/20 px-6 py-4 -mt-6">
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
                                <svg width="24" height="24" viewBox="0 0 1024 1024" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path fill-rule="evenodd" clip-rule="evenodd" d="M8 0C3.58 0 0 3.58 0 8C0 11.54 2.29 14.53 5.47 15.59C5.87 15.66 6.02 15.42 6.02 15.21C6.02 15.02 6.01 14.39 6.01 13.72C4 14.09 3.48 13.23 3.32 12.78C3.23 12.55 2.84 11.84 2.5 11.65C2.22 11.5 1.82 11.13 2.49 11.12C3.12 11.11 3.57 11.7 3.72 11.94C4.44 13.15 5.59 12.81 6.05 12.6C6.12 12.08 6.33 11.73 6.56 11.53C4.78 11.33 2.92 10.64 2.92 7.58C2.92 6.71 3.23 5.99 3.74 5.43C3.66 5.23 3.38 4.41 3.82 3.31C3.82 3.31 4.49 3.1 6.02 4.13C6.66 3.95 7.34 3.86 8.02 3.86C8.7 3.86 9.38 3.95 10.02 4.13C11.55 3.09 12.22 3.31 12.22 3.31C12.66 4.41 12.38 5.23 12.3 5.43C12.81 5.99 13.12 6.7 13.12 7.58C13.12 10.65 11.25 11.33 9.47 11.53C9.76 11.78 10.01 12.26 10.01 13.01C10.01 14.08 10 14.94 10 15.21C10 15.42 10.15 15.67 10.55 15.59C13.71 14.53 16 11.53 16 8C16 3.58 12.42 0 8 0Z" transform="scale(64)" fill="#000000" />
                                </svg>
                            </Link>
                        )}
                        {developer.linkedin_url && (
                            <Link
                                href={developer.linkedin_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-400 hover:text-gray-100 transition-colors"
                            >
                                <svg width="24" height="24" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid" viewBox="0 0 256 256"><path d="M218.123 218.127h-37.931v-59.403c0-14.165-.253-32.4-19.728-32.4-19.756 0-22.779 15.434-22.779 31.369v60.43h-37.93V95.967h36.413v16.694h.51a39.907 39.907 0 0 1 35.928-19.733c38.445 0 45.533 25.288 45.533 58.186l-.016 67.013ZM56.955 79.27c-12.157.002-22.014-9.852-22.016-22.009-.002-12.157 9.851-22.014 22.008-22.016 12.157-.003 22.014 9.851 22.016 22.008A22.013 22.013 0 0 1 56.955 79.27m18.966 138.858H37.95V95.967h37.97v122.16ZM237.033.018H18.89C8.58-.098.125 8.161-.001 18.471v219.053c.122 10.315 8.576 18.582 18.89 18.474h218.144c10.336.128 18.823-8.139 18.966-18.474V18.454c-.147-10.33-8.635-18.588-18.966-18.453" fill="#0A66C2" /></svg>
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
            {/* <Card className="overflow-hidden bg-gray-800/50 backdrop-blur-sm border border-gray-700/30 hover:border-gray-700/50 transition-all duration-300">
                <CardHeader className="bg-gray-800/30 border-b border-gray-700/30">
                    <CardTitle className="flex items-center text-gray-100">
                        <User className="h-5 w-5 text-primary mr-2" />
                        More by {developer.name}
                    </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                    <div className="space-y-4">
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
            </Card> */}
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
