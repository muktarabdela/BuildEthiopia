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
                const response = await axios.delete(
                    `/api/projects/${projectId}/upvote`,
                    {
                        data: { user_id: user.id },
                        headers: {
                            Authorization: `Bearer ${session?.access_token}`,
                        },
                    }
                )
                console.log("response from deleting upvote", response)
                if (response.data.message === "Upvote removed successfully") {
                    setUpvotes((prev) => prev - 1)
                    setHasUpvoted(false)
                }
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
                console.log("response from adding upvote", response)
                if (response.data.message === "Project upvoted successfully") {
                    setUpvotes((prev) => prev + 1)
                    setHasUpvoted(true)
                }
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
        <div className="flex items-center gap-2 ">

            <Button
                onClick={handleUpvote}
                disabled={isLoading}
                variant={hasUpvoted ? "default" : "outline"}
                className={cn(
                    "flex items-center gap-2 cursor-pointer border-none",
                    hasUpvoted && "bg-primary hover:bg-primary/90",
                    isLoading && "opacity-70",
                    className
                )}
            >
                <Heart
                    className={cn(
                        "h-4 w-4 transition-all",
                        isAnimating && "scale-125",
                        hasUpvoted ? "fill-current" : "fill-none"
                    )}
                />
                <span>
                    {upvotes} Upvote{upvotes !== 1 ? "s" : ""}
                </span>
            </Button>
        </div>

    )
}

