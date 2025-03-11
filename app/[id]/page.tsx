'use client'

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase';
// import { ProjectCard } from '@/components/ProjectCard';
import SkillsManager from './SkillsManager';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ProfileCompletionDialog from '@/components/ProfileCompletionDialog';
import Image from 'next/image';

export default function ProfilePage() {
    const params = useParams();

    const router = useRouter();
    const supabase = createClient();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showDialog, setShowDialog] = useState(false);



    useEffect(() => {
        async function getProfile() {
            if (!params) return;

            const username = params?.id; // ✅ Now accessing username safely

            const sessionData = localStorage.getItem('session');
            const parsedSession = sessionData ? JSON.parse(sessionData) : null;

            if (!parsedSession) {
                console.log("No valid session found, redirecting to login");
                router.push('/login');
                return;
            }

            const { data: profile, error: profileError } = await supabase
                .from('profiles')
                .select(`*`)
                .eq('username', username)
                .maybeSingle();

            if (profileError) {
                console.error("Profile fetch error:", profileError);
            } else {
                console.log("Profile data:", profile);
                setProfile(profile);
                if (!profile?.bio || !profile?.github_url) {
                    setShowDialog(true);
                }
            }

            setLoading(false);
        }

        getProfile();
    }, [params]); // ⬅️ Re-run when params change

    if (loading) return <div>Loading...</div>;
    if (!profile) return <div>Profile not found.</div>;

    const { projects } = profile;
    const totalUpvotes = projects?.reduce((sum, project) => sum + project.upvotes_count, 0) || 0;
    const totalComments = projects?.reduce((sum, project) => sum + project.comments_count, 0) || 0;
    const generateColor = (name) => {
        if (!name) return "bg-gray-300"; // Default fallback
        const colors = [
            "bg-blue-500", "bg-red-500", "bg-green-500", "bg-yellow-500", "bg-purple-500", "bg-pink-500", "bg-indigo-500"
        ];
        const index = name.charCodeAt(0) % colors.length;
        return colors[index]; // Choose a color based on the first letter
    };
    return (
        <main className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto">
                {/* Profile Header */}


                <div className="mb-8 flex items-center">
                    <div className="h-24 w-24 rounded-full border-2 border-gray-300 shadow-lg overflow-hidden flex items-center justify-center">
                        {profile.profile_picture ? (
                            <Image
                                src={profile.profile_picture}
                                alt={profile.name}
                                width={96}
                                height={96}
                                className="h-full w-full object-cover rounded-full"
                            />
                        ) : (
                            <div className={`w-full h-full flex items-center justify-center text-white text-3xl font-semibold ${generateColor(profile.name)}`}>
                                {profile.name?.charAt(0).toUpperCase() || "?"}
                            </div>
                        )}
                    </div>
                    <div className="ml-4">
                        <h1 className="text-4xl font-bold">{profile.name}</h1>
                        <p className="text-lg text-gray-600">{profile.bio || 'No bio added yet.'}</p>
                        <div className="mt-2">
                            <Button asChild>
                                <a href="/profile/edit">Edit Profile</a>
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Contact Information */}
                <Card className="mb-8">
                    <CardHeader>
                        <CardTitle>Contact Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <dl className="space-y-4">
                            <div>
                                <dt className="font-medium">Email</dt>
                                <dd>{profile.email}</dd>
                            </div>
                            <div>
                                <dt className="font-medium">GitHub</dt>
                                <dd>
                                    {profile.github_url ? (
                                        <a href={profile.github_url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                                            {profile.github_url}
                                        </a>
                                    ) : 'Not added'}
                                </dd>
                            </div>
                            <div>
                                <dt className="font-medium">LinkedIn</dt>
                                <dd>
                                    {profile.linkedin_url ? (
                                        <a href={profile.linkedin_url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                                            {profile.linkedin_url}
                                        </a>
                                    ) : 'Not added'}
                                </dd>
                            </div>
                            <div>
                                <dt className="font-medium">Telegram</dt>
                                <dd>{profile.telegram_url || 'Not added'}</dd>
                            </div>
                        </dl>
                    </CardContent>
                </Card>

                {/* Profile Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-center">{profile.projects?.length || 0}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-center text-muted-foreground">Projects</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-center">{totalUpvotes}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-center text-muted-foreground">Total Upvotes</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-center">{totalComments}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-center text-muted-foreground">Total Comments</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Skills Section - Only for developers */}
                {profile.role === 'developer' && (
                    <SkillsManager userId={profile.id} />
                )}

                {/* Projects Section */}
                {/* {profile.role === 'developer' && (
                    <div className="mb-8">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold">My Projects</h2>
                            <Button asChild>
                                <a href="/projects/new">Add New Project</a>
                            </Button>
                        </div>
                        {projects?.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {projects.map((project) => (
                                    <ProjectCard key={project.id} project={project} />
                                ))}
                            </div>
                        ) : (
                            <Card>
                                <CardContent className="text-center py-12">
                                    <p className="text-muted-foreground mb-4">
                                        You haven't added any projects yet.
                                    </p>
                                    <Button asChild>
                                        <a href="/projects/new">Add Your First Project</a>
                                    </Button>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                )} */}
            </div>
            {/* ✅ Show profile completion dialog if needed */}
            {showDialog && <ProfileCompletionDialog userId={profile.id} onClose={() => setShowDialog(false)} />}
        </main>
    );
} 