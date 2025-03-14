"use client"
import Link from "next/link"
import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { supabase } from "@/lib/supabase"
import { Eye, EyeOff, Github } from "lucide-react"

export default function LoginPage() {
    const router = useRouter()
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)

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

    return (
        <div className="min-h-screen flex items-center justify-center px-4">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl">Welcome Back</CardTitle>
                </CardHeader>
                <CardContent>
                    {error && (
                        <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-md text-sm text-destructive">
                            {error}
                        </div>
                    )}
                    <form onSubmit={handleEmailLogin} className="space-y-4">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-muted-foreground mb-1">
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
                                className="w-full px-3 py-2 border rounded-md"
                                placeholder="you@example.com"
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-muted-foreground mb-1">
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
                                    className="w-full px-3 py-2 border rounded-md pr-10"
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-500"
                                >
                                    {showPassword ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>
                        <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-white" disabled={loading}>
                            {loading ? "Signing in..." : "Sign In"}
                        </Button>
                    </form>

                    <div className="mt-4 relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
                        </div>
                    </div>

                    <Button
                        type="button"
                        variant="outline"
                        className="w-full mt-4 flex items-center justify-center gap-2"
                        onClick={handleGitHubLogin}
                        disabled={loading}
                    >
                        <Github className="h-4 w-4" />
                        <span>GitHub</span>
                    </Button>

                    <div className="mt-6 text-center">
                        <p className="text-sm text-muted-foreground">
                            Don't have an account?{" "}
                            <Link href="/register" className="text-primary hover:underline">
                                Sign up
                            </Link>
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

