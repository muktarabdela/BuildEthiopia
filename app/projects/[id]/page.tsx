"use client"

import React from "react"
import { useParams, useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { useEffect } from "react"
import { useAuth } from "@/components/AuthProvider"
import { useLoading } from "@/components/LoadingProvider"
import ProjectHero from "@/components/ProjectHero"
import ProjectActionBar from "@/components/ProjectActionBar"
import ProjectContent from "@/components/ProjectContent"
import ProjectSidebar from "@/components/ProjectSidebar"

// Custom hook to fetch project data
function useProject(projectId: string | undefined) {
    const { user } = useAuth()
    const { setIsLoading } = useLoading()
    const [project, setProject] = React.useState<any>(null)
    const [error, setError] = React.useState<string | null>(null)

    useEffect(() => {
        if (!projectId) return

        const fetchProject = async () => {
            setIsLoading(true) // Start loading
            try {
                const { data, error } = await supabase
                    .from("projects")
                    .select(`
                        *,
                        developer:profiles!projects_developer_id_fkey(
                          id,
                          name,
                          bio,
                          github_url,
                          linkedin_url,
                          contact_visible,
                          profile_picture,
                            username,
                            status
                        ),
                        comments(
                          id,
                          content,
                          created_at,
                          user:profiles(id, name, profile_picture)
                        )
                      `)
                    .eq("id", projectId)
                    .single()

                if (error || !data) {
                    console.error("Error fetching project:", error)
                    throw new Error(error?.message || "Project not found")
                }
                setProject(data)
            } catch (err: any) {
                console.error("Error fetching project:", err)
                setError(err.message)
            } finally {
                setIsLoading(false) // Stop loading
            }
        }

        fetchProject()
    }, [projectId, setIsLoading])

    return { project, error }
}

export default function ProjectPage() {
    const { id } = useParams()
    const router = useRouter()
    const { setIsLoading } = useLoading()

    // @ts-ignore
    const { project, error } = useProject(id)

    // Redirect to a 404 page if there is an error
    useEffect(() => {
        if (error) {
            setIsLoading(true) // Start loading before redirect
            router.push("/404")
        }
    }, [error, router, setIsLoading])

    return (
        <main className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
            {/* Hero Section */}
            {project && <ProjectHero project={project} />}

            {/* Main Content */}
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-4xl mx-auto">
                    {/* Action Bar */}
                    {project && <ProjectActionBar project={project} />}

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Main Content Column */}
                        {project && <ProjectContent project={project} />}

                        {/* Sidebar */}
                        {project && <ProjectSidebar developer={project.developer} />}
                    </div>
                </div>
            </div>
        </main>
    )
}

