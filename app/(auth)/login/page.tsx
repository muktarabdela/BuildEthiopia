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

            console.log("Login response:", data)
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
            console.log("GitHub login response:", data)

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
                            <Github className="h-5 w-5 mr-2" />
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

