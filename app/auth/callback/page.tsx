"use client"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/AuthProvider"
import { useLoading } from "@/components/LoadingProvider"
import axios from "axios"

export default function AuthCallback() {
    const router = useRouter()
    const { user } = useAuth()
    console.log("AuthCallback user data :", user)
    const { setIsLoading } = useLoading()
    const [error, setError] = useState("")
    // console.log("AuthCallback user:", user)
    useEffect(() => {
        const handleProfileInsertion = async () => {
            try {
                setIsLoading(true) // Start loading
                if (user) {
                    const response = await axios.post('/api/auth/callback', user);

                    if (response.status !== 200) {
                        setError(response.data.error || "Profile creation failed");
                        return;
                    }

                    // Refresh page after successful profile insertion
                    router.push("/");
                }
            } catch (error) {
                console.error("Error:", error);
                setError("An unexpected error occurred");
            } finally {
                setIsLoading(false); // Stop loading
            }
        }

        handleProfileInsertion();
    }, [router, user, setIsLoading])

    if (error) {
        return <div>Error: {error}</div>
    }

    return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading...</p>
            </div>
        </div>
    )
}
