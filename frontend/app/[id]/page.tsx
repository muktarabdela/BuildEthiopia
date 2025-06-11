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
import ProfileHeader, { SkeletonProfileHeader } from '@/components/profile/profile-header';
import PortfolioSection, { SkeletonPortfolioSection } from '@/components/profile/portfolio';
import AchievementsSection, { SkeletonAchievementsSection } from '@/components/profile/achievements';
import SettingsSection from '@/components/profile/settings';
import { getUserUpvotedProjects } from '@/lib/services/projectInteractions';
import { ProjectCard } from '@/components/ProjectCard';
import index from 'swr';
import { useLoading } from '@/components/LoadingProvider';
import axios from 'axios';
import { Star } from 'lucide-react';
import Link from 'next/link';
import { profile } from 'console';

// API or database


type SocialLinks = {
    github: string;
    linkedin: string;
    twitter: string;
    telegram: string;
    website: string;
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

type About = {
    about_me: string;
    experience_summary: string;
    expertise: string[];
    education_summary: string;
    interestsExpertise: string[];
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

const transformProfileData = (profile: ApiProfile, about: About, projects: Project[]): Profile => {
    return {
        id: profile.id,
        username: profile.username,
        displayName: profile.name,
        bio: about?.about_me || "No bio available",
        profilePicture: profile?.profile_picture,
        status: profile?.status || 'none',
        skill: about?.expertise || [],
        location: profile.location || "Location not specified",
        website_url: profile.website_url || "https://example.com",
        socialLinks: {
            github: profile.github_url || '',
            linkedin: profile.linkedin_url || '',
            twitter: profile.telegram_url || '',
            telegram: profile.telegram_url || '',
            website: profile.website_url || '',

        },
        featured: {
            isTopDeveloper: false,
            featuredProduct: false,
        },
        stats: {
            totalUpvotes: projects.reduce((sum, project) => sum + (project.upvotes_count || 0), 0) || 0,
            totalComments: projects.reduce((sum, project) => sum + (project.comments_count || 0), 0) || 0,
        },
        badges: [
            { id: 1, name: "New Member", icon: "award" },
        ],
        projects: projects?.map(project => ({
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
    const [about, setAbout] = useState<About | null>(null);
    const [showDialog, setShowDialog] = useState<boolean>(false);
    const [isOwner, setIsOwner] = useState<boolean>(false);
    const [upvotedProjects, setUpvotedProjects] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [showProfileCompletionAlert, setShowProfileCompletionAlert] = useState<boolean>(false);
    const [isGuestMode, setIsGuestMode] = useState<boolean>(false);
    const [isGuestModeLoading, setIsGuestModeLoading] = useState<boolean>(false);
    const [profileNotFound, setProfileNotFound] = useState<boolean>(false);

    useEffect(() => {
        async function getProfile() {
            try {
                setIsLoading(true);
                if (!params) return;

                const username = params?.id;
                const response = await axios.get(`/api/profile/${username}`);
                if (response.status !== 200) {
                    setProfileNotFound(true);
                    return;
                }

                const profile = response.data.profile;
                const about = response.data.about;
                setAbout(about);
                const projects = response.data.projects;
                const transformedProfile = transformProfileData(profile, about, projects);
                setProfile(transformedProfile);

                const isProfileIncomplete = !about || !profile?.bio || !profile?.github_url || !profile?.linkedin_url;
                setShowProfileCompletionAlert(isProfileIncomplete && user?.id === profile?.id);

                if (user?.id === profile?.id) {
                    setIsOwner(true);
                    if (isProfileIncomplete) {
                        setShowDialog(true);
                    }

                    if (session) {
                        const [upvoted] = await Promise.all([
                            getUserUpvotedProjects(user.id, session?.access_token)
                        ]);
                        setUpvotedProjects(upvoted);
                    }
                }
            } catch (error) {
                console.error('Error:', error);
                setProfileNotFound(true);
            } finally {
                setIsLoading(false);
            }
        }

        getProfile();
    }, [params, user, session, setIsLoading]);

    const handleGuestModeToggle = async () => {
        setIsGuestModeLoading(true);
        // Add a small delay for smooth transition
        await new Promise(resolve => setTimeout(resolve, 500));
        setIsGuestMode(!isGuestMode);
        setIsGuestModeLoading(false);
    };

    if (profileNotFound) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-white mb-4">Profile Not Found</h1>
                    <p className="text-gray-300 mb-8">The profile you are looking for does not exist or may have been removed.</p>
                    <div className="flex justify-center space-x-4">
                        <Button onClick={() => router.push('/')} className="bg-indigo-600 hover:bg-indigo-700 text-white">
                            Back to Home
                        </Button>
                        <Button onClick={() => router.push('/developers')} className="bg-green-600 hover:bg-green-700 text-white">
                            Explore Developers
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    if (!profile) return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading...</p>
            </div>
        </div>
    );

    const { projects } = profile;
    const username = params?.id;

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
            {isGuestModeLoading && (
                <div className="fixed inset-0 z-50 bg-gray-900/90 flex items-center justify-center">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                        <p className="text-muted-foreground">Switching view mode...</p>
                    </div>
                </div>
            )}
            {showProfileCompletionAlert && (
                <div className="bg-yellow-500/20 border-l-4 border-yellow-500 text-white p-4 mb-8">
                    <div className="flex items-center justify-between max-w-7xl mx-auto">
                        <div className="flex items-center space-x-4">
                            <Star className="h-6 w-6 text-yellow-500" />
                            <p className="text-sm md:text-base">
                                Please complete your profile to submit projects and get discovered by recruiters!
                            </p>
                        </div>
                        <Link href={`/${username}/complete`}>
                            <Button className="bg-yellow-500 hover:bg-yellow-600 text-white">
                                Complete Profile
                            </Button>
                        </Link>
                    </div>
                </div>
            )}
            {isOwner && (
                <div className="fixed bottom-4 right-4 z-50">
                    <Button
                        onClick={handleGuestModeToggle}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white"
                    >
                        {isGuestMode ? 'Exit Guest Mode' : 'View in Guest Mode'}
                    </Button>
                </div>
            )}
            <main className="container py-8 px-4 md:px-6 max-w-7xl mx-auto">
                <div className="grid gap-8">
                    {isLoading ? (
                        <SkeletonProfileHeader />
                    ) : (
                        profile && <ProfileHeader user={profile} isOwner={isGuestMode ? false : isOwner} about={about} />
                    )}
                    <div className="grid gap-8 md:grid-cols-3">
                        <div className="md:col-span-2">
                            {isLoading ? (
                                <SkeletonPortfolioSection />
                            ) : (
                                profile && <PortfolioSection user={profile} about={about} upvotedProjects={upvotedProjects} isOwner={isGuestMode ? false : isOwner} />
                            )}
                        </div>
                        <div className="space-y-8">
                            {isLoading ? (
                                <SkeletonAchievementsSection />
                            ) : (
                                profile && <AchievementsSection user={profile} />
                            )}
                            {profile && isOwner && !isGuestMode && <SettingsSection user={profile} isOpen={false} onClose={() => { }} />}
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

