// components/UpvoteButton.tsx (or wherever it lives)
"use client";

import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button"; // Ensure path is correct
import axios from "axios";
import { useAuth } from "@/components/AuthProvider"; // Ensure path is correct
import { cn } from "@/lib/utils"; // Ensure path is correct
import { useRouter } from 'next/navigation'; // For redirect

type Props = {
    projectId: string;
    initialUpvotes: number;
    initialHasUpvoted: boolean | undefined; // Allow undefined for loading state
    className?: string;
    size?: 'sm' | 'default' | 'lg'; // Optional size prop for flexibility
};

export default function UpvoteButton({
    projectId,
    initialUpvotes,
    initialHasUpvoted,
    className,
    size
}: Props) {
    const { user, session } = useAuth();
    const router = useRouter();

    // State derived from props, allowing internal updates
    const [upvotes, setUpvotes] = useState<number>(initialUpvotes);
    const [hasUpvoted, setHasUpvoted] = useState<boolean | undefined>(initialHasUpvoted);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isAnimating, setIsAnimating] = useState<boolean>(false);

    // Sync state if props change (e.g., navigating between project pages)
    useEffect(() => {
        setUpvotes(initialUpvotes);
    }, [initialUpvotes]);

    useEffect(() => {
        setHasUpvoted(initialHasUpvoted);
    }, [initialHasUpvoted]);

    const handleUpvote = async () => {
        if (!user || !session) {
            // Use router push for client-side navigation redirect
            router.push("/login?redirect=" + encodeURIComponent(window.location.pathname + window.location.search));
            return;
        }

        // Prevent action if initial state is still loading
        if (hasUpvoted === undefined) {
            console.log("Initial upvote state not determined yet.");
            return;
        }

        setIsLoading(true);
        setIsAnimating(true); // Trigger animation

        // --- Optimistic Update ---
        const originalUpvotes = upvotes;
        const originalHasUpvoted = hasUpvoted;

        const newHasUpvoted = !originalHasUpvoted;
        const newUpvotes = newHasUpvoted ? originalUpvotes + 1 : originalUpvotes - 1;

        setHasUpvoted(newHasUpvoted);
        setUpvotes(newUpvotes);
        // --- End Optimistic Update ---

        try {
            const method = originalHasUpvoted ? 'DELETE' : 'POST';
            const url = `/api/projects/${projectId}/upvote`;
            const headers = { Authorization: `Bearer ${session.access_token}` };

            let response;
            if (method === 'DELETE') {
                response = await axios.delete(url, {
                    data: { user_id: user.id, project_id: projectId }, // Include user_id and project_id
                    headers: headers,
                });
                console.log("Response from deleting upvote", response);
                if (response.status !== 200 && response.status !== 204) { // Check for success status
                    throw new Error(`API Error: ${response.status}`);
                }
            } else { // POST
                response = await axios.post(url,
                    {
                        user_id: user.id, // Include user_id
                        project_id: projectId // Include project_id
                    },
                    {
                        headers: { ...headers, 'Content-Type': 'application/json' },
                    }
                );
                console.log("Response from adding upvote", response);
                if (response.status !== 200 && response.status !== 201) { // Check for success status
                    throw new Error(`API Error: ${response.status}`);
                }
            }

            // Optional: If API returns the *actual* new count, update state here for consistency
            // const data = response.data;
            // if (data && typeof data.newCount === 'number') {
            //     setUpvotes(data.newCount);
            // }

        } catch (error) {
            console.error("Error toggling upvote:", error);
            // --- Revert Optimistic Update on Error ---
            setHasUpvoted(originalHasUpvoted);
            setUpvotes(originalUpvotes);
            // Optionally show an error toast/message to the user
        } finally {
            setIsLoading(false);
            // Reset animation state after animation completes (CSS duration)
            setTimeout(() => {
                setIsAnimating(false);
            }, 300); // Match animation duration
        }
    };

    // Handle case where initial state is still loading
    const isDisabled = isLoading || hasUpvoted === undefined;
    const buttonVariant = hasUpvoted === true ? "default" : "outline";
    const buttonText = `Upvote${upvotes !== 1 ? 's' : ''}`;

    return (
        // Removed outer div, Button component is sufficient
        <Button
            onClick={handleUpvote}
            disabled={isDisabled}
            variant={buttonVariant}
            size={size} // Use the size prop
            aria-pressed={hasUpvoted === true} // Correct ARIA attribute for toggle buttons
            aria-label={hasUpvoted === true ? `Remove upvote, currently ${upvotes} upvotes` : `Upvote project, currently ${upvotes} upvotes`}
            className={cn(
                "flex items-center gap-1.5 cursor-pointer transition-all duration-200 ease-in-out text-white", // Adjusted gap
                // Custom styling for filled vs outline
                hasUpvoted === true
                    ? "bg-green-600 text-white hover:bg-green-700 border-green-600" // Green background for upvoted state
                    : "border-border hover:bg-accent hover:text-accent-foreground", // Standard outline hover
                isDisabled && "opacity-60 cursor-not-allowed",
                // Removed border-none as variant handles it
                className // Allow overriding classes
            )}
        >
            <Heart
                className={cn(
                    "h-4 w-4 transition-all duration-300 ease-in-out text-white",
                    // Animation effect
                    isAnimating && hasUpvoted ? "scale-125 rotate-12" : "scale-100 rotate-0",
                    // Fill based on state
                    hasUpvoted === true ? "fill-current text-white" : "fill-none text-current", // Ensure correct color inheritance
                    // Adjust stroke width for outline
                    hasUpvoted !== true && "stroke-[1.5px]"
                )}
            />
            {/* Show count only if defined */}
            {typeof upvotes === 'number' && (
                <span className="text-sm font-medium">
                    {upvotes} {/* Display count */}
                </span>
            )}
            {/* Show text only if size is 'lg' */}
            {size === 'lg' && (
                <span className="text-sm font-medium text-white">
                    {buttonText} {/* Display "Upvote" or "Upvotes" */}
                </span>
            )}
        </Button>
    );
}