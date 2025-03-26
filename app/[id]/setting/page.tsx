// app/settings/page.tsx
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

import { FullProfileData } from "@/lib/definitions/setting"; // Use the combined type
import { PublicProfileForm } from "@/components/setting/PublicProfileForm";
import { AboutMeForm } from "@/components/setting/AboutMeForm";
import { LinksContactForm } from "@/components/setting/LinksContactForm";
// import { use, useEffect } from "react";
import { useLoading } from "@/components/LoadingProvider";
import { Link2, User, UserCircle } from "lucide-react";

// --- Mock Data Fetching ---
// Replace this with your actual data fetching logic (e.g., from getServerSideProps,
// a server component async function, or client-side useEffect fetch)
async function getUserProfileData(): Promise<FullProfileData> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Mock data based on your schema
    return {
        profile: {
            id: 'uuid-123-abc',
            username: 'johndoe',
            name: 'John Doe',
            bio: 'Passionate developer focused on building great things.',
            github_url: 'https://github.com/johndoe',
            linkedin_url: 'https://linkedin.com/in/johndoe',
            contact_visible: false,
            profile_picture: 'https://github.com/shadcn.png', // Example avatar
            telegram_url: 'https://t.me/johndoe',
            email: 'john.doe@example.com',
            is_verify_email: true,
            role: 'developer',
            status: 'active',
            skill: ['JavaScript', 'React'], // Legacy skills
            website_url: 'https://johndoe.dev',
            location: 'New York, USA',
            badges: ['Early Adopter'],
        },
        about: {
            profile_id: 'uuid-123-abc',
            about_me: 'A more detailed description about being a full-stack developer, loving open source and building scalable applications with modern technologies.',
            experience_summary: '5+ years professional experience',
            expertise: ['React', 'Next.js', 'Node.js', 'TypeScript', 'PostgreSQL'],
            education_summary: 'B.Sc. in Computer Science, Example University',
            interests: ['Open Source', 'DevOps', 'UI/UX Design', 'Photography'],
        },
    };
}
// --- End Mock Data Fetching ---


export default async function SettingsPage() {
    // const { setIsLoading } = useLoading()
    // Fetch data (using await directly in Server Component)
    // Simulate loading during filtering
    // useEffect(() => {
    //     setIsLoading(true); // Start loading when filters change
    //     const timeout = setTimeout(() => {
    //         setIsLoading(false); // Stop loading after a short delay (simulate filtering)
    //     }, 200); // Adjust the delay as needed

    //     return () => clearTimeout(timeout);
    // }, [setIsLoading]);

    const userData = await getUserProfileData();

    if (!userData?.profile) {
        // Handle case where profile data couldn't be loaded
        return <div>Error loading profile data. Please try again later.</div>;
    }

    return (
        <div className="container mx-auto py-10 px-4 md:px-0 max-w-4xl">
            <Card>
                <CardHeader>
                    <CardTitle>Profile Settings</CardTitle>
                    <CardDescription>
                        Manage your profile information and preferences.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {/* Use vertical orientation for sidebar-like feel on larger screens */}
                    <Tabs defaultValue="public-profile" className="flex flex-row md:flex-row md:gap-8 " orientation="vertical">
                        <TabsList className="w-full md:w-64 flex-shrink-0 mb-6 md:mb-0 flex flex-col space-y-2 border-r border-gray-200 pr-6 mt-10">
                            <TabsTrigger
                                value="public-profile"
                                className="w-full justify-start px-4 py-3 hover:bg-gray-50 rounded-lg transition-all text-gray-700 hover:text-gray-900 data-[state=active]:bg-gray-100 data-[state=active]:text-gray-900 data-[state=active]:font-medium"
                            >
                                <User className="w-4 h-4 mr-2" />
                                Public Profile
                            </TabsTrigger>
                            <TabsTrigger
                                value="about-me"
                                className="w-full justify-start px-4 py-3 hover:bg-gray-50 rounded-lg transition-all text-gray-700 hover:text-gray-900 data-[state=active]:bg-gray-100 data-[state=active]:text-gray-900 data-[state=active]:font-medium"
                            >
                                <UserCircle className="w-4 h-4 mr-2" />
                                About Me
                            </TabsTrigger>
                            <TabsTrigger
                                value="links-contact"
                                className="w-full justify-start px-4 py-3 hover:bg-gray-50 rounded-lg transition-all text-gray-700 hover:text-gray-900 data-[state=active]:bg-gray-100 data-[state=active]:text-gray-900 data-[state=active]:font-medium"
                            >
                                <Link2 className="w-4 h-4 mr-2" />
                                Links & Contact
                            </TabsTrigger>
                            {/* Add more triggers if you create more sections */}
                        </TabsList>

                        <div className="flex-grow flex flex-row">
                            <TabsContent value="public-profile">
                                <h3 className="text-lg font-medium mb-4">Public Profile Details</h3>
                                <PublicProfileForm profile={userData.profile} />
                            </TabsContent>

                            <TabsContent value="about-me">
                                <h3 className="text-lg font-medium mb-4">About Me Details</h3>
                                <AboutMeForm
                                    about={userData.about}
                                    profileSkills={userData.profile.skill}
                                    profileBadges={userData.profile.badges}
                                />
                            </TabsContent>

                            <TabsContent value="links-contact">
                                <h3 className="text-lg font-medium mb-4">Links & Contact Information</h3>
                                <LinksContactForm profile={userData.profile} />
                            </TabsContent>
                            {/* Add more <TabsContent> for other sections */}
                        </div>
                    </Tabs>
                </CardContent>
            </Card>
        </div>
    );
}