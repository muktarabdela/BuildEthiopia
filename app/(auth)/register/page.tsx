'use client';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import VerificationModal from '@/components/VerificationModal';
import Image from "next/image"
import { supabase } from '@/lib/supabase'
import { Eye, EyeOff, Github } from 'lucide-react';

type FormData = {
    email: string;
    password: string;
    confirmPassword: string;
    name: string;
    username: string;
};

type AuthError = {
    message: string;
};

export default function RegisterPage() {

    const router = useRouter();
    const [error, setError] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [isModalOpen, setModalOpen] = useState<boolean>(false);
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const formData = new FormData(e.currentTarget);
        const data: FormData = {
            email: formData.get('email') as string,
            password: formData.get('password') as string,
            confirmPassword: formData.get('confirmPassword') as string,
            name: formData.get('name') as string,
            username: formData.get('username') as string,
        };

        if (data.password !== data.confirmPassword) {
            setError('Passwords do not match');
            setLoading(false);
            return;
        }

        try {
            const response = await axios.post('/api/auth/register', data);
            if (response.data) {
                setModalOpen(true);
            } else {
                throw new Error('Failed to register');
            }
        } catch (err: unknown) {
            if (axios.isAxiosError(err) && err.response) {
                setError(err.response.data?.error || 'Registration failed. Please try again.');
            } else if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('An unexpected error occurred. Please try again later.');
            }
        } finally {
            setLoading(false);
        }
    }

    const handleGoogleLogin = async () => {
        try {
            setLoading(true);
            setError('');
            const { error } = await supabase.auth.signInWithOAuth({
                provider: "google",
                options: {
                    redirectTo: `${window.location.origin}/auth/callback`,
                },
            });

            if (error) throw error;
        } catch (error: unknown) {
            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError('An error occurred during Google login');
            }
        } finally {
            setLoading(false);
        }
    }

    const handleGitHubLogin = async () => {
        try {
            setLoading(true);
            setError('');
            const { error } = await supabase.auth.signInWithOAuth({
                provider: "github",
                options: {
                    redirectTo: `${window.location.origin}/auth/callback`,
                },
            });

            if (error) throw error;
        } catch (error: unknown) {
            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError('An error occurred during GitHub login');
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center px-4">
            <Card className="w-full max-w-md bg-gray-900 border-gray-800 shadow-lg">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl font-bold text-white">Create an Account</CardTitle>
                    <p className="text-sm text-gray-400">Sign up to get started</p>
                </CardHeader>
                <CardContent className="space-y-6">
                    {error && (
                        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-md text-sm text-red-400">
                            {error}
                        </div>
                    )}


                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label
                                htmlFor="name"
                                className="block text-sm font-medium text-gray-300 mb-1">

                                Full Name
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                required
                                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-500 focus:ring-2 focus:ring-primary focus:border-transparent"
                                placeholder="John Doe"
                            />
                        </div>
                        <div>
                            <label
                                htmlFor="username"
                                className="block text-sm font-medium text-gray-300 mb-1">
                                user name
                            </label>
                            <input
                                type="text"
                                id="username"
                                name="username"
                                required
                                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-500 focus:ring-2 focus:ring-primary focus:border-transparent"
                                placeholder="@johndoe"
                            />
                        </div>
                        <div>
                            <label
                                htmlFor="email"
                                className="block text-sm font-medium text-gray-300 mb-1"                            >
                                Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                required
                                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-500 focus:ring-2 focus:ring-primary focus:border-transparent"
                                placeholder="you@example.com"
                            />
                        </div>
                        <div className="relative">
                            <label
                                htmlFor="password"
                                className="block text-sm font-medium text-gray-300 mb-1"
                            >
                                Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type={showPassword ? "text" : "password"}
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
                        <div className="relative">
                            <label
                                htmlFor="confirmPassword"
                                className="block text-sm font-medium text-gray-300 mb-1">
                                Confirm Password
                            </label>
                            <input
                                id="confirmPassword"
                                name="confirmPassword"
                                type={showConfirmPassword ? "text" : "password"}
                                required
                                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-500 focus:ring-2 focus:ring-primary focus:border-transparent pr-10"
                                placeholder="••••••••"
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-300"
                            >
                                {showConfirmPassword ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                            </button>
                        </div>
                        <Button
                            type="submit"
                            className="w-full bg-primary hover:bg-primary/90 text-white font-medium transition-all"
                            disabled={loading}
                        >
                            {loading ? 'Creating Account...' : 'Create Account'}
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
                            className="w-full bg-white hover:bg-gray-100 text-gray-700 font-medium transition-all cursor-pointer"
                            onClick={handleGoogleLogin}
                            disabled={loading}
                        >
                            <div className="relative w-5 h-5 mr-2 cursor-pointer">
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


                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-400">
                            Already have an account?{' '}
                            <Link href="/login" className="text-primary hover:underline font-medium">
                                Sign in
                            </Link>
                        </p>
                    </div>
                </CardContent>
            </Card>
            <VerificationModal isOpen={isModalOpen} onClose={() => setModalOpen(false)} />
        </div>
    );
}
