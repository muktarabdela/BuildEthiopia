'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import axios from 'axios';
import { supabase } from '@/lib/supabase';

export default function NewProjectPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [uuid, setUuid] = useState<string | null>(null);

    useEffect(() => {
        async function checkAccess() {
            const session = localStorage.getItem('session');
            const parsedSession = session ? JSON.parse(session) : null;
            if (!parsedSession) {
                console.log("No valid session found, redirecting to login");
                router.push('/login');
                return;
            }
            setUuid(parsedSession?.id);
            const { data: profile, error: profileError } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', parsedSession?.id)
                .single();

            console.log("Profile data:", profile);
            console.log("Profile error:", profileError);

            if (!profile) {
                router.push('/');
                return;
            }

            setLoading(false);
        }

        checkAccess();
    }, [router]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const formData = new FormData(e.currentTarget);
        const data = {
            title: formData.get('title'),
            description: formData.get('description'),
            images: ["https://picsum.photos/200/300?grayscale", "https://picsum.photos/200/300"],
            logo_url: formData.get('logo_url'),
            developer_id: uuid,
            github_url: formData.get('github_url'),
            live_url: formData.get('live_url'),
        };

        try {
            const response = await axios.post('/api/projects', data, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            console.log(response)
            console.log("Project created successfully:", response.data);
            // router.push('/projects'); // Redirect to projects page or show success message
        } catch (err) {
            console.error('Error:', err);
            if (axios.isAxiosError(err) && err.response) {
                setError(err.response.data?.error || 'Failed to create project. Please try again.');
            } else {
                setError('An unexpected error occurred. Please try again later.');
            }
        } finally {
            setLoading(false);
        }
    };

    // if (loading) {
    //     return <div>Loading...</div>;
    // }

    return (
        <main className="container mx-auto px-4 py-8">
            <div className="max-w-2xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold mb-4">Submit a New Project</h1>
                    <p className="text-muted-foreground">
                        Share your project with the Ethiopian developer community.
                    </p>
                </div>

                <form onSubmit={handleSubmit}>
                    <Card className="mb-8">
                        <CardHeader>
                            <CardTitle>Project Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <label
                                    htmlFor="title"
                                    className="block text-sm font-medium text-muted-foreground mb-1"
                                >
                                    Project Title
                                </label>
                                <input
                                    type="text"
                                    id="title"
                                    name="title"
                                    className="w-full px-3 py-2 border rounded-md"
                                    required
                                    placeholder="Enter your project title"
                                />
                            </div>
                            <div>
                                <label
                                    htmlFor="description"
                                    className="block text-sm font-medium text-muted-foreground mb-1"
                                >
                                    Project Description
                                </label>
                                <textarea
                                    id="description"
                                    name="description"
                                    rows={6}
                                    className="w-full px-3 py-2 border rounded-md"
                                    required
                                    placeholder="Describe your project, its features, and the problem it solves..."
                                />
                            </div>
                            <div>
                                <label
                                    htmlFor="logo_url"
                                    className="block text-sm font-medium text-muted-foreground mb-1"
                                >
                                    Project Logo URL
                                </label>
                                <input
                                    type="url"
                                    id="logo_url"
                                    name="logo_url"
                                    className="w-full px-3 py-2 border rounded-md"
                                    placeholder="https://example.com/logo.png"
                                />
                            </div>
                            <div>
                                <label
                                    htmlFor="images"
                                    className="block text-sm font-medium text-muted-foreground mb-1"
                                >
                                    Project Screenshots
                                </label>
                                <input
                                    type="file"
                                    id="images"
                                    name="images"
                                    multiple
                                    accept="image/*"
                                    className="w-full px-3 py-2 border rounded-md"
                                />
                                <p className="text-sm text-muted-foreground mt-1">
                                    Upload multiple screenshots of your project
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="mb-8">
                        <CardHeader>
                            <CardTitle>Project Links</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <label
                                    htmlFor="github_url"
                                    className="block text-sm font-medium text-muted-foreground mb-1"
                                >
                                    GitHub Repository URL
                                </label>
                                <input
                                    type="url"
                                    id="github_url"
                                    name="github_url"
                                    className="w-full px-3 py-2 border rounded-md"
                                    placeholder="https://github.com/username/project"
                                />
                            </div>
                            <div>
                                <label
                                    htmlFor="live_url"
                                    className="block text-sm font-medium text-muted-foreground mb-1"
                                >
                                    Live Demo URL
                                </label>
                                <input
                                    type="url"
                                    id="live_url"
                                    name="live_url"
                                    className="w-full px-3 py-2 border rounded-md"
                                    placeholder="https://your-project.com"
                                />
                            </div>
                            <input
                                type="hidden"
                                name="developer_id"
                                id="developer_id"
                                value={uuid}
                            />
                        </CardContent>
                    </Card>

                    <div className="flex justify-end space-x-4">
                        <Button variant="outline" asChild>
                            <a href="/profile">Cancel</a>
                        </Button>
                        <Button type="submit">Submit Project</Button>
                    </div>
                </form>
                {error && <div className="text-red-500">{error}</div>}
            </div>
        </main>
    );
}

