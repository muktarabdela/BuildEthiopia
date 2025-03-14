"use client"

import { useState, useEffect } from "react"
import { ThumbsUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import axios from "axios"
 import { useAuth } from "@/components/AuthProvider"
import { supabase } from "@/lib/supabase"
import { cn } from "@/lib/utils"

export default function UpvoteButton({ projectId, initialUpvotes }) {
    const { user, session } = useAuth()
    const [upvotes, setUpvotes] = useState(initialUpvotes)
    const [hasUpvoted, setHasUpvoted] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [isAnimating, setIsAnimating] = useState(false)

    // Fetch the upvote count on mount
    useEffect(() => {
        const checkUserUpvote = async () => {
            if (!user) return

            try {
                const { data, error } = await supabase
                    .from("upvotes")
                    .select("id")
                    .eq("project_id", projectId)
                    .eq("user_id", user.id)
                    .maybeSingle()

                if (error) {
                    console.error("Error checking upvote:", error)
                } else {
                    setHasUpvoted(!!data)
                }
            } catch (err) {
                console.error("Unexpected error:", err)
            }
        }

        checkUserUpvote()
    }, [projectId, session])

    const handleUpvote = async () => {
        if (!user) {
            // Redirect to login if user is not authenticated
            window.location.href = "/login?redirect=" + encodeURIComponent(window.location.pathname)
            return
        }

        try {
            setIsLoading(true)
            setIsAnimating(true)

            if (hasUpvoted) {
                // Remove upvote if user has already upvoted
                const response = await axios.delete(`/api/projects/${projectId}/upvote`, {
                    headers: {
                        Authorization: `Bearer ${session?.access_token}`,
                    },
                })
                console.log("Remove upvote response:", response.data)
                setUpvotes((prev) => prev - 1)
                setHasUpvoted(false)
            } else {
                // Add upvote
                const response = await axios.post(
                    `/api/projects/${projectId}/upvote`,
                    {
                        user_id: user.id,
                        project_id: projectId,
                    },
                    {
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${session?.access_token}`,
                        },
                    },
                )
                console.log("Upvote response:", response.data)
                setUpvotes((prev) => prev + 1)
                setHasUpvoted(true)
            }
        } catch (error) {
            console.error("Error toggling upvote:", error)
        } finally {
            setIsLoading(false)

            // Reset animation state after animation completes
            setTimeout(() => {
                setIsAnimating(false)
            }, 600)
        }
    }

    return (
        <Button
            onClick={handleUpvote}
            disabled={isLoading}
            variant={hasUpvoted ? "default" : "outline"}
            className={cn(
                "flex items-center space-x-2 transition-all duration-300",
                hasUpvoted ? "bg-primary text-white" : "",
                isLoading && "opacity-70",
            )}
        >
            <span
                className={cn(
                    "inline-block transition-transform duration-300",
                    isAnimating && (hasUpvoted ? "animate-upvote-in" : "animate-upvote-out"),
                )}
            >
                <ThumbsUp className={cn("h-4 w-4 transition-all duration-300", hasUpvoted ? "fill-current" : "")} />
            </span>
            <span>{upvotes} Upvotes</span>
        </Button>
    )
}

