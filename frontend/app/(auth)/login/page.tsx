"use client"
import Link from "next/link"
import type React from "react"
import Image from "next/image"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { supabase } from "@/lib/supabase"
import { Eye, EyeOff, Github } from "lucide-react"
import { useLoading } from '@/components/LoadingProvider'



export default function LoginPage() {
    const router = useRouter()
    const { setIsLoading } = useLoading()
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)

    // Simulate loading during filtering
    useEffect(() => {
        setIsLoading(true); // Start loading when filters change
        const timeout = setTimeout(() => {
            setIsLoading(false); // Stop loading after a short delay (simulate filtering)
        }, 400); // Adjust the delay as needed

        return () => clearTimeout(timeout);
    }, [setIsLoading]);

    useEffect(() => {
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((event, session) => {
            if (event === "SIGNED_IN" && session) {
                router.push("/")
            }
        })

        return () => {
            subscription.unsubscribe()
        }
    }, [router])

    const handleEmailLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            setLoading(true)
            setError("")

            // Validate inputs
            if (!email || !password) {
                throw new Error("Please fill in all fields")
            }

            const { data, error } = await supabase.auth.signInWithPassword({
                email: email.trim(),
                password: password.trim(),
            })

            // console.log("Login response:", data)
            if (error) {
                console.error("Login error:", error)
                // Handle specific error cases
                if (error.message.includes("Invalid login credentials")) {
                    throw new Error("Invalid email or password")
                }
                throw error
            }

            // Check if email is verified
            if (data.user && data.user.confirmed_at === null) {
                throw new Error("Please verify your email before logging in")
            }
        } catch (error: any) {
            console.error("Login error:", error)
            setError(error.message || "An error occurred during login")
        } finally {
            setLoading(false)
        }
    }

    const handleGitHubLogin = async () => {
        try {
            setLoading(true)
            setError("")

            const { data, error } = await supabase.auth.signInWithOAuth({
                provider: "github",
                options: {
                    redirectTo: `${window.location.origin}/auth/callback`,
                },
            })
            // console.log("GitHub login response:", data)

            if (error) {
                console.error("GitHub login error:", error)
                throw error
            }
        } catch (error: any) {
            console.error("GitHub login error:", error)
            setError(error.message || "An error occurred during GitHub login")
        } finally {
            setLoading(false)
        }
    }

    const handleGoogleLogin = async () => {
        try {
            setIsLoading(true)
            setError("")

            const { data, error } = await supabase.auth.signInWithOAuth({
                provider: "google",
                options: {
                    redirectTo: `${window.location.origin}/auth/callback`,
                },
            })

            if (error) {
                console.error("Google login error:", error)
                throw error
            }
        } catch (error: any) {
            console.error("Google login error:", error)
            setError(error.message || "An error occurred during Google login")
        } finally {
            setIsLoading(false)
        }
    }


    return (
        <div className="min-h-screen flex items-center justify-center px-4">
            <Card className="w-full max-w-md bg-gray-900 border-gray-800 shadow-lg">
                <CardHeader className="text-center space-y-2">
                    <CardTitle className="text-2xl font-bold text-white">Welcome Back</CardTitle>
                    <p className="text-sm text-gray-400">Sign in to continue to your account</p>
                </CardHeader>
                <CardContent className="space-y-6">
                    {error && (
                        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-md text-sm text-red-400">
                            {error}
                        </div>
                    )}
                    <form onSubmit={handleEmailLogin} className="space-y-4">
                        <div className="space-y-2">
                            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                                Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                autoComplete="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-500 focus:ring-2 focus:ring-primary focus:border-transparent"
                                placeholder="you@example.com"
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-500 focus:ring-2 focus:ring-primary focus:border-transparent pr-10"
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-300"
                                >
                                    {showPassword ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>
                        <Button
                            type="submit"
                            className="w-full bg-primary hover:bg-primary/90 text-white font-medium transition-all"
                            disabled={loading}
                        >
                            {loading ? "Signing in..." : "Sign In"}
                        </Button>
                    </form>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-gray-700" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-gray-900 px-2 text-gray-400">Or continue with</span>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <Button
                            type="button"
                            className="w-full bg-white hover:bg-gray-100 text-gray-700 font-medium transition-all"
                            onClick={handleGoogleLogin}
                            disabled={loading}
                        >
                            <div className="relative w-5 h-5 mr-2">
                                <Image
                                    src="/google-icon-logo-svgrepo-com.svg"
                                    alt="Google logo"
                                    fill
                                    className="object-contain"
                                />
                            </div>
                            <span>Continue with Google</span>
                        </Button>

                        <Button
                            type="button"
                            className="w-full bg-gray-800 hover:bg-gray-700 text-white font-medium transition-all"
                            onClick={handleGitHubLogin}
                            disabled={loading}
                        >
                            <svg width="24" height="24" viewBox="0 0 1024 1024" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M8 0C3.58 0 0 3.58 0 8C0 11.54 2.29 14.53 5.47 15.59C5.87 15.66 6.02 15.42 6.02 15.21C6.02 15.02 6.01 14.39 6.01 13.72C4 14.09 3.48 13.23 3.32 12.78C3.23 12.55 2.84 11.84 2.5 11.65C2.22 11.5 1.82 11.13 2.49 11.12C3.12 11.11 3.57 11.7 3.72 11.94C4.44 13.15 5.59 12.81 6.05 12.6C6.12 12.08 6.33 11.73 6.56 11.53C4.78 11.33 2.92 10.64 2.92 7.58C2.92 6.71 3.23 5.99 3.74 5.43C3.66 5.23 3.38 4.41 3.82 3.31C3.82 3.31 4.49 3.1 6.02 4.13C6.66 3.95 7.34 3.86 8.02 3.86C8.7 3.86 9.38 3.95 10.02 4.13C11.55 3.09 12.22 3.31 12.22 3.31C12.66 4.41 12.38 5.23 12.3 5.43C12.81 5.99 13.12 6.7 13.12 7.58C13.12 10.65 11.25 11.33 9.47 11.53C9.76 11.78 10.01 12.26 10.01 13.01C10.01 14.08 10 14.94 10 15.21C10 15.42 10.15 15.67 10.55 15.59C13.71 14.53 16 11.53 16 8C16 3.58 12.42 0 8 0Z" transform="scale(64)" fill="#ffff" />
                            </svg>
                            <span>Continue with GitHub</span>
                        </Button>
                    </div>

                    <div className="mt-4 text-center">
                        <p className="text-sm text-gray-400">
                            Don't have an account?{" "}
                            <Link href="/register" className="text-primary hover:underline font-medium">
                                Sign up
                            </Link>
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

