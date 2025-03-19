"use client"

import { useState, useEffect } from "react"
import { Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import axios from "axios"
import { useAuth } from "@/components/AuthProvider"
import { supabase } from "@/lib/supabase"
import { cn } from "@/lib/utils"

type Props = {
    projectId: string;
    initialUpvotes: number;
    className?: string;
};

export default function UpvoteButton({ projectId, initialUpvotes, className }: Props) {
    const { user, session } = useAuth()
    const [upvotes, setUpvotes] = useState<number>(initialUpvotes)
    const [hasUpvoted, setHasUpvoted] = useState<boolean>(false)
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [isAnimating, setIsAnimating] = useState<boolean>(false)

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
    }, [projectId, session, user])

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
        <div className="flex items-center gap-2 bg-gray-700 rounded-full hover:bg-gray-700 text-white transition-colors duration-200">
            <Button
                onClick={handleUpvote}
                disabled={isLoading}
                variant={hasUpvoted ? "default" : "outline"}
                className={cn(
                    "flex items-center space-x-2 transition-all duration-300 cursor-pointer border-none",
                    hasUpvoted ? "bg-primary text-white" : "text-white",
                    isLoading && "opacity-70",
                    className
                )}
            >
                <span
                    className={cn(
                        "inline-block transition-transform duration-300",
                        isAnimating && (hasUpvoted ? "animate-upvote-in" : "animate-upvote-out"),
                    )}
                >
                    {/* Before upvoting */}
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        className={cn(
                            "transition-all duration-300",
                            hasUpvoted ? "hidden" : "block",
                            "fill-current text-gray-400 hover:text-primary"
                        )}
                    >
                        <path d="M12 2L2 22h20L12 2zm0 4.5l7.2 13.5H4.8L12 6.5z" />
                    </svg>

                    {/* After upvoting */}
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        className={cn(
                            "transition-all duration-300",
                            hasUpvoted ? "block" : "hidden",
                            "fill-current text-"
                        )}
                    >
                        <path d="M12 2l10 20H2L12 2zm0 4.5L4.8 20h14.4L12 6.5z" />
                        <path d="M12 6.5l7.2 13.5H4.8L12 6.5z" fill="currentColor" />
                    </svg>
                </span>
                <span>{upvotes} Upvote</span>
            </Button>
        </div>
    )
}

