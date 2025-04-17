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
import { Skeleton } from "@/components/ui/skeleton"
import router from "next/router"
import { useRouter } from "next/navigation"

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

export default function PortfolioSection({ user, upvotedProjects = [], isOwner, about }) {
    // console.log("about from portfolio section:", about)
    const router = useRouter()
    const [editingProject, setEditingProject] = useState(null)
    const [activeTab, setActiveTab] = useState("about")

    const handleUpdateProject = (updatedProject) => {
        // Update the project in the user's projects array
        const updatedProjects = user.projects.map(project =>
            project.id === updatedProject.id ? updatedProject : project
        )
        user.projects = updatedProjects
    }

    if (!about && !about?.about_me && !about?.expertise?.length) {
        return (
            <Card className="bg-gray-900 border-gray-700 rounded-xl shadow-2xl">
                <CardHeader className="px-8 pt-8 pb-6">
                    <CardTitle className="text-3xl font-bold text-white">
                        Portfolio
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-8">
                    <div className="flex flex-col items-center justify-center space-y-6">
                        <div className="text-center">
                            <h3 className="text-2xl font-semibold text-white mb-4">Complete Your Profile</h3>
                            <p className="text-gray-400">To submit projects and showcase your work, please complete your profile.</p>
                        </div>
                        <Link href={`/${user.username}/complete`}>
                            <Button className="bg-yellow-500 hover:bg-yellow-600 text-white">
                                Complete Profile
                            </Button>
                        </Link>
                    </div>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="bg-gray-900 border-gray-700 rounded-xl shadow-2xl">
            <CardHeader className="px-8 pt-8 pb-6">
                <CardTitle className="text-3xl font-bold text-white">
                    Portfolio
                    <span className="ml-4 text-sm font-normal text-gray-400">
                        {user?.projects?.length} projects
                    </span>
                </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="flex justify-start space-x-4 px-8 bg-transparent border-b border-gray-700">
                        {["about", "Project", "upvoted"].map((tab) => (
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

                    {/* About Tab */}
                    <TabsContent value="about" className="space-y-6"> {/* Reduced space slightly for Cards */}
                        {/* Bio Section */}
                        <Card className="bg-gray-800 border-gray-700 m-4">
                            <CardHeader>
                                {/* Using text-2xl for the main section title for hierarchy */}
                                <CardTitle className="text-2xl text-white">About Me</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-gray-400 leading-relaxed">
                                    {about?.about_me || "No bio available."}
                                </p>
                            </CardContent>
                        </Card>

                        {/* Grid for Experience & Expertise */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 m-4">
                            {/* Experience Card */}
                            <Card className="bg-gray-800 border-gray-700">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    {/* Adjusted header for tighter icon/title spacing */}
                                    <CardTitle className="text-base font-medium text-white"> {/* Slightly smaller title */}
                                        Experience
                                    </CardTitle>
                                    <Briefcase className="h-5 w-5 text-gray-400" /> {/* Consistent muted icon color */}
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-gray-400">
                                        {about?.experience_summary || "No experience summary available."}
                                    </p>
                                </CardContent>
                            </Card>

                            {/* Expertise Level Card */}
                            <Card className="bg-gray-800 border-gray-700">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-base font-medium text-white">
                                        Expertise Level
                                    </CardTitle>
                                    <Code className="h-5 w-5 text-gray-400" />
                                </CardHeader>
                                <CardContent>
                                    {/* Display level directly, maybe bolder */}
                                    <div className="text-lg font-semibold text-white">
                                        {about?.Experience_level || "Not specified"}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Grid for Education & Interests */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 m-4">
                            {/* Education Card */}
                            <Card className="bg-gray-800 border-gray-700">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-base font-medium text-white">
                                        Education
                                    </CardTitle>
                                    <GraduationCap className="h-5 w-5 text-gray-400" />
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-gray-400">
                                        {about?.education_summary || "No education summary available."}
                                    </p>
                                </CardContent>
                            </Card>

                            {/* Interests Card */}
                            <Card className="bg-gray-800 border-gray-700">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-base font-medium text-white">
                                        Interests
                                    </CardTitle>
                                    <BookOpen className="h-5 w-5 text-gray-400" />
                                </CardHeader>
                                <CardContent>
                                    {about?.interests && about.interests.length > 0 ? (
                                        <div className="flex flex-wrap gap-2">
                                            {about.interests.map((interest, index) => (
                                                <Badge key={index} variant="secondary" className="bg-blue-500/20 text-blue-400 hover:bg-blue-500/30"> {/* Use Badge component */}
                                                    {interest}
                                                </Badge>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-sm text-gray-400">No interests listed.</p>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    {/* Portfolio Tab */}
                    <TabsContent value="Project" className="p-8">
                        {user.projects?.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {user.projects.map(project => (
                                    <div
                                        key={project.id}
                                        className="group relative bg-gray-800 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer"
                                        onClick={() => router.push(`/projects/${project.id}`)}
                                        role="link"
                                        tabIndex={0}
                                        onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') router.push(`/projects/${project.id}`) }}
                                        aria-label={`View details for ${project.title}`}
                                    >
                                        {/* Edit Icon (only for owner) */}
                                        {isOwner && (
                                            <button
                                                className="absolute top-3 right-3 z-20 bg-gray-900/80 hover:bg-gray-800 p-2 rounded-full text-gray-300 hover:text-yellow-400 transition-colors"
                                                onClick={e => {
                                                    e.stopPropagation();
                                                    setEditingProject(project);
                                                }}
                                                aria-label="Edit project"
                                                tabIndex={0}
                                            >
                                                <Edit className="w-5 h-5" />
                                            </button>
                                        )}
                                        <div className="relative aspect-video w-full">
                                            <Image
                                                src={project.thumbnail}
                                                alt={project?.title}
                                                fill
                                                className="object-cover group-hover:scale-105 transition-transform duration-300"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                        </div>
                                        <div className="p-4">
                                            <h3 className="text-lg font-semibold text-white mb-2">{project?.title}</h3>
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
                        ) : (
                            <div className="flex flex-col items-center justify-center p-8 space-y-6">
                                <div className="text-center max-w-2xl">
                                    <Code className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                                    <h3 className="text-2xl font-semibold text-white mb-2">No Projects Yet</h3>
                                    <p className="text-gray-400 mb-6">
                                        Showcase your skills and experience by adding your first project.
                                        It's a great way to demonstrate your capabilities to potential collaborators and employers.
                                    </p>
                                    <Button
                                        className="bg-primary hover:bg-primary/90"
                                        onClick={() => router.push('/projects/new')}
                                    >
                                        Add Your First Project
                                    </Button>
                                </div>
                            </div>
                        )}
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


export function SkeletonPortfolioSection() {
    return (
        // Mimic the outer card structure with muted styles
        <Card className="bg-muted border border-gray-700 rounded-xl shadow-lg"> {/* Use muted bg and border */}
            <CardHeader className="px-8 pt-8 pb-6">
                {/* Title Placeholder */}
                <div className="flex items-baseline">
                    <Skeleton className="bg-gray-700 h-8 w-36" /> {/* "Portfolio" */}
                    <Skeleton className="bg-gray-700 ml-4 h-4 w-24" /> {/* "X projects" */}
                </div>
            </CardHeader>
            <CardContent className="p-0">
                {/* Tabs Structure Placeholder */}
                <Tabs defaultValue="Project" className="w-full"> {/* Default value doesn't matter much */}
                    <TabsList className="flex justify-start space-x-4 px-8 bg-transparent border-b border-gray-700">
                        {/* Tab Trigger Placeholders */}
                        <Skeleton className="bg-gray-700 h-5 w-16 pb-3" /> {/* "Project" */}
                        <Skeleton className="bg-gray-700 h-5 w-20 pb-3" /> {/* "Upvoted" */}
                        <Skeleton className="bg-gray-700 h-5 w-16 pb-3" /> {/* "About" */}
                    </TabsList>

                    {/* Content for the first tab (Projects) */}
                    <TabsContent value="Project" className="p-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {/* Repeat Project Preview Skeleton */}
                            {[...Array(6)].map((_, i) => ( // Show ~6 placeholders
                                <div key={i} className="group relative bg-background rounded-xl overflow-hidden border border-gray-700/50"> {/* Slightly different bg */}
                                    {/* Image Placeholder */}
                                    <Skeleton className="bg-gray-700 aspect-video w-full" />
                                    <div className="p-4 space-y-2">
                                        {/* Title Placeholder */}
                                        <Skeleton className="bg-gray-700 h-5 w-3/4" />
                                        {/* Tags Placeholder */}
                                        <div className="flex flex-wrap gap-2">
                                            <Skeleton className="bg-gray-700 h-5 w-16 rounded-full" />
                                            <Skeleton className="bg-gray-700 h-5 w-12 rounded-full" />
                                            <Skeleton className="bg-gray-700 h-5 w-20 rounded-full" />
                                        </div>
                                        {/* Stats Placeholder */}
                                        <div className="flex items-center pt-1">
                                            <ThumbsUp className="h-4 w-4 mr-2 text-muted-foreground/50" /> {/* Muted Icon */}
                                            <Skeleton className="bg-gray-700 h-4 w-24" />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </TabsContent>

                    {/* Placeholder for other TabsContent (add if needed, but often showing one tab's skeleton is enough) */}
                    {/* Example for About Tab Skeleton Structure */}
                    <TabsContent value="about" className="p-8 space-y-6">
                        {/* About Me Card Skeleton */}
                        <Card className="bg-background border-gray-700/50">
                            <CardHeader>
                                <Skeleton className="bg-gray-700 h-6 w-28" /> {/* "About Me" */}
                            </CardHeader>
                            <CardContent className="space-y-1.5">
                                <Skeleton className="bg-gray-700 h-4 w-full" />
                                <Skeleton className="bg-gray-700 h-4 w-full" />
                                <Skeleton className="bg-gray-700 h-4 w-5/6" />
                            </CardContent>
                        </Card>

                        {/* Grid for Exp/Expertise Skeleton */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Card className="bg-background border-gray-700/50">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <Skeleton className="bg-gray-700 h-5 w-24" /> {/* Title */}
                                    <Briefcase className="h-5 w-5 text-muted-foreground/50" /> {/* Muted Icon */}
                                </CardHeader>
                                <CardContent className="space-y-1.5">
                                    <Skeleton className="bg-gray-700 h-4 w-full" />
                                    <Skeleton className="bg-gray-700 h-4 w-11/12" />
                                </CardContent>
                            </Card>
                            <Card className="bg-background border-gray-700/50">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <Skeleton className="bg-gray-700 h-5 w-32" /> {/* Title */}
                                    <Code className="h-5 w-5 text-muted-foreground/50" /> {/* Muted Icon */}
                                </CardHeader>
                                <CardContent>
                                    <Skeleton className="bg-gray-700 h-6 w-20" /> {/* Level */}
                                </CardContent>
                            </Card>
                        </div>

                        {/* Grid for Edu/Interests Skeleton */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Card className="bg-background border-gray-700/50">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <Skeleton className="bg-gray-700 h-5 w-24" /> {/* Title */}
                                    <GraduationCap className="h-5 w-5 text-muted-foreground/50" /> {/* Muted Icon */}
                                </CardHeader>
                                <CardContent className="space-y-1.5">
                                    <Skeleton className="bg-gray-700 h-4 w-full" />
                                    <Skeleton className="bg-gray-700 h-4 w-5/6" />
                                </CardContent>
                            </Card>
                            <Card className="bg-background border-gray-700/50">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <Skeleton className="bg-gray-700 h-5 w-24" /> {/* Title */}
                                    <BookOpen className="h-5 w-5 text-muted-foreground/50" /> {/* Muted Icon */}
                                </CardHeader>
                                <CardContent>
                                    <div className="flex flex-wrap gap-2">
                                        <Skeleton className="bg-gray-700 h-5 w-16 rounded-full" />
                                        <Skeleton className="bg-gray-700 h-5 w-20 rounded-full" />
                                        <Skeleton className="bg-gray-700 h-5 w-12 rounded-full" />
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    )
}