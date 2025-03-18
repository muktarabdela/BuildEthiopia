'use client'

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
// import { ProjectCard } from '@/components/ProjectCard';
import SkillsManager from './SkillsManager';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ProfileCompletionDialog from '@/components/ProfileCompletionDialog';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/components/AuthProvider';
import ProfileHeader from '@/components/profile/profile-header';
import PortfolioSection from '@/components/profile/portfolio';
import AchievementsSection from '@/components/profile/achievements';
import SettingsSection from '@/components/profile/settings';
import { getUserSavedProjects, getUserUpvotedProjects } from '@/lib/services/projectInteractions';
import { ProjectCard } from '@/components/ProjectCard';
import index from 'swr';

// API or database
const userData = {
    id: "1",
    username: "janedoe",
    displayName: "Jane Doe",
    bio: "Full-stack developer passionate about creating beautiful, functional web applications",
    profilePicture: "/placeholder.svg?height=150&width=150",
    socialLinks: {
        github: "https://github.com/janedoe",
        linkedin: "https://linkedin.com/in/janedoe",
        twitter: "https://twitter.com/janedoe",
    },
    featured: {
        isTopDeveloper: true,
        featuredProduct: true,
    },
    stats: {
        totalUpvotes: 1243,
        totalComments: 85,
    },
    badges: [
        { id: 1, name: "Top Developer", icon: "trophy" },
        { id: 2, name: "Most Upvoted Project", icon: "award" },
        { id: 3, name: "Community Contributor", icon: "heart" },
    ],
    projects: [
        {
            id: 1,
            title: "E-commerce Dashboard",
            thumbnail: "/placeholder.svg?height=200&width=300",
            upvotes: 423,
            featured: true,
        },
        {
            id: 2,
            title: "Task Management App",
            thumbnail: "/placeholder.svg?height=200&width=300",
            upvotes: 287,
            featured: false,
        },
        {
            id: 3,
            title: "Portfolio Template",
            thumbnail: "/placeholder.svg?height=200&width=300",
            upvotes: 189,
            featured: false,
        },
        {
            id: 4,
            title: "Weather Forecast App",
            thumbnail: "/placeholder.svg?height=200&width=300",
            upvotes: 156,
            featured: false,
        },
    ],
}

type SocialLinks = {
    github: string;
    linkedin: string;
    twitter: string;
};

type Featured = {
    isTopDeveloper: boolean;
    featuredProduct: boolean;
};

type Stats = {
    totalUpvotes: number;
    totalComments: number;
};

type Badge = {
    id: number;
    name: string;
    icon: string;
};

type Project = {
    id: number;
    title: string;
    description?: string;
    thumbnail: string;
    upvotes: number;
    featured: boolean;
    createdAt?: string;
};

type Profile = {
    id: string;
    username: string;
    displayName: string;
    bio: string;
    profilePicture: string;
    status?: string;
    skill?: string[];
    location?: string;
    website_url?: string;
    socialLinks: SocialLinks;
    featured: Featured;
    stats: Stats;
    badges: Badge[];
    projects: Project[];
};

type ApiProfile = {
    id: string;
    username: string;
    name: string;
    bio?: string;
    profile_picture: string;
    status?: string;
    skill?: string[];
    location?: string;
    website_url?: string;
    github_url?: string;
    linkedin_url?: string;
    telegram_url?: string;
    projects?: {
        id: number;
        title: string;
        description: string;
        images: string[];
        upvotes_count: number;
        comments_count: number;
        created_at: string;
    }[];
};

const transformProfileData = (profile: ApiProfile): Profile => {
    return {
        id: profile.id,
        username: profile.username,
        displayName: profile.name,
        bio: profile.bio || "No bio available",
        profilePicture: profile.profile_picture,
        status: profile.status || 'none',
        skill: profile.skill || [],
        location: profile.location || "Location not specified",
        website_url: profile.website_url || "https://example.com",
        socialLinks: {
            github: profile.github_url || '',
            linkedin: profile.linkedin_url || '',
            twitter: profile.telegram_url || '',
        },
        featured: {
            isTopDeveloper: false,
            featuredProduct: false,
        },
        stats: {
            totalUpvotes: profile.projects?.reduce((sum, project) => sum + (project.upvotes_count || 0), 0) || 0,
            totalComments: profile.projects?.reduce((sum, project) => sum + (project.comments_count || 0), 0) || 0,
        },
        badges: [
            { id: 1, name: "New Member", icon: "award" },
        ],
        projects: profile.projects?.map(project => ({
            id: project.id,
            title: project.title,
            description: project.description,
            thumbnail: project.images[0] || "/placeholder.svg?height=200&width=300",
            upvotes: project.upvotes_count || 0,
            featured: false,
            createdAt: project.created_at
        })) || []
    };
};

export default function ProfilePage() {
    const { user, session } = useAuth();
    const params = useParams<{ id: string }>();
    const router = useRouter();
    const [profile, setProfile] = useState<Profile | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [showDialog, setShowDialog] = useState<boolean>(false);
    const [isOwner, setIsOwner] = useState<boolean>(false);
    const [savedProjects, setSavedProjects] = useState<string[]>([]);
    const [upvotedProjects, setUpvotedProjects] = useState<string[]>([]);

    useEffect(() => {
        async function getProfile() {
            if (!params) return;

            const username = params?.id;
            const response = await fetch(`/api/profile/${username}`);

            if (!response.ok) {
                router.push('/login');
                return;
            }

            const profile = await response.json();
            const transformedProfile = transformProfileData(profile);
            setProfile(transformedProfile);

            if (user?.id === profile?.id) {
                setIsOwner(true);
                if (!profile?.bio || !profile?.github_url) {
                    setShowDialog(true);
                }

                if (session) {
                    const [saved, upvoted] = await Promise.all([
                        getUserSavedProjects(user.id, session?.access_token),
                        getUserUpvotedProjects(user.id, session?.access_token)
                    ]);
                    console.log("Saved Projects from profile page:", saved);
                    setSavedProjects(saved);
                    setUpvotedProjects(upvoted);
                }
            }
            setLoading(false);
        }

        getProfile();
    }, [params, user, session]);

    if (loading) return <div>Loading...</div>;
    if (!profile) return <div>Profile not found.</div>;

    const { projects } = profile;

    // const totalUpvotes = projects?.reduce((sum, project) => sum + project.upvotes_count, 0) || 0;
    // const totalComments = projects?.reduce((sum, project) => sum + project.comments_count, 0) || 0;
    const generateColor = (name: string | undefined): string => {
        if (!name) return "bg-gray-300";
        const colors = [
            "bg-blue-500", "bg-red-500", "bg-green-500", "bg-yellow-500", "bg-purple-500", "bg-pink-500", "bg-indigo-500"
        ];
        const index = name.charCodeAt(0) % colors.length;
        return colors[index]; // Choose a color based on the first letter
    };
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
            <main className="container mx-auto py-8 px-4 md:px-6">
                <div className="grid gap-8">
                    {profile && <ProfileHeader user={profile} />}
                    <div className="grid gap-8 md:grid-cols-3">
                        <div className="md:col-span-2">
                            {profile && <PortfolioSection user={profile} />}
                            {isOwner && (
                                <>
                                    <div className="mt-8">
                                        <h2 className="text-2xl font-bold text-white mb-4">Saved Projects</h2>
                                        {savedProjects.length > 0 ? (
                                            savedProjects.map((project, index) => (
                                                <ProjectCard key={project.id} project={project} index={index} />
                                            ))
                                        ) : (
                                            <p className="text-gray-400">No saved projects yet.</p>
                                        )}
                                    </div>
                                    <div className="mt-8">
                                        <h2 className="text-2xl font-bold text-white mb-4">Upvoted Projects</h2>
                                        {upvotedProjects.length > 0 ? (
                                            upvotedProjects.map((project, index) => (
                                                <ProjectCard key={project.id} project={project} index={index} />
                                            ))
                                        ) : (
                                            <p className="text-gray-400">No upvoted projects yet.</p>
                                        )}
                                    </div>
                                </>
                            )}
                        </div>
                        <div className="space-y-8">
                            {profile && <AchievementsSection user={profile} />}
                            {profile && isOwner && <SettingsSection user={profile} isOpen={false} onClose={() => { }} />}
                        </div>
                    </div>
                </div>
            </main>
        </div>
        // <main className="container mx-auto px-4 py-8">
        //     <div className="max-w-4xl mx-auto">
        //         {/* Profile Header */}

        //         {/* Contact Information - Only show to owner */}


        //         {/* Profile Stats - Show to everyone */}

        //         {/* Skills Section - Only for developers */}
        //         {profile.role === 'developer' && isOwner && (
        //             <SkillsManager userId={profile.id} />
        //         )}

        //         {/* Projects Section */}
        //     </div>
        //     {/* ✅ Show profile completion dialog only to owner */}
        //     {showDialog && isOwner && <ProfileCompletionDialog userId={profile.id} onClose={() => setShowDialog(false)} />}
        // </main>
    );
}

