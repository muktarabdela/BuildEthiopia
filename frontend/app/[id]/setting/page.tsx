// app/[username]/setting/page.tsx
'use client'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardHeader, CardDescription, CardContent, CardTitle } from "@/components/ui/card";
import { Link2, Settings, User, UserCircle } from "lucide-react";
import { useState, useEffect } from "react";

import { FullProfileData } from "@/lib/definitions/setting"; // Use the combined type
import { PublicProfileForm } from "@/components/setting/PublicProfileForm"; // Ensure correct path
import { AboutMeForm } from "@/components/setting/AboutMeForm";       // Ensure correct path
import { LinksContactForm } from "@/components/setting/LinksContactForm"; // Ensure correct path
import { useAuth } from "@/components/AuthProvider";

// Define the props for the Server Component to receive params
interface SettingsPageProps {
    params: {
        username: string;
    };
}

// Fetch function adapted for Server Component using fetch
async function getUserProfileData(userId: string): Promise<FullProfileData | null> {
    // Construct the absolute URL for the API endpoint
    // In production, use environment variables for the base URL
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const apiUrl = `${baseUrl}/api/profile/${userId}`;

    try {
        // console.log(`Fetching data from: ${apiUrl}`);
        // Use fetch within Server Components
        const response = await fetch(apiUrl, {
            // Optional: Add caching options if needed
            // cache: 'no-store', // Use 'no-store' to always fetch fresh data
            // next: { revalidate: 60 } // Or specify revalidation time
        });

        console.log(`Response status: ${response.status}`);
        console.log(`Response response: ${response}`);

        if (response.status === 404) {
            console.log(`Profile not found for username: ${userId}`);
            return null; // Return null specifically for not found
        }

        if (!response.ok) {
            // Log more details for other errors
            const errorBody = await response.text();
            console.error(`API request failed with status ${response.status}: ${errorBody}`);
            throw new Error(`Failed to fetch profile data. Status: ${response.status}`);
        }

        const data: FullProfileData = await response.json();
        console.log("Fetched data successfully.");
        return data;

    } catch (error) {
        console.error(`Error fetching profile data for ${userId}:`, error);
        // Re-throw the error to be caught by the component or Next.js error handling
        // Or return null to show a generic error message in the component
        return null; // Indicate failure to fetch/process
    }
}


// --- Page Component ---
export default function SettingsPage() {
    const { user, loading } = useAuth();
    const [userData, setUserData] = useState<FullProfileData | null>(null);
    const [isLoading, setIsLoading] = useState(true); // Local loading state
    useEffect(() => {
        console.log("user in useEffect", user);
        console.log("user_metadata", user?.user_metadata);
        console.log("username", user?.user_metadata?.username);
        if (user?.id) {
            const fetchData = async () => {
                setIsLoading(true);
                console.log("Fetching profile for", user.id);
                const data = await getUserProfileData(user.id);
                console.log("Fetched data:", data);
                setUserData(data);
                setIsLoading(false);
            };
            fetchData();
        } else {
            setIsLoading(false);
        }
    }, [user]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Loading...</p>
                </div>
            </div>
        )
    }

    if (!userData) {
        return <div className="container mx-auto py-10 px-4 text-white" >Error loading profile data</div>;
    }

    // Data is valid, proceed to render
    return (
        <main className="bg-gradient-to-br from-gray-900 to-gray-800 min-h-screen">
            <div className="container mx-auto py-10 px-4 md:px-0 max-w-4xl">
                <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-4xl font-bold mb-2 text-white">Profile Settings</h1>
                        <p className="text-gray-50">Customize your profile and manage your preferences.</p>
                    </div>
                    {/* Optionally, you can add a settings icon or avatar here for extra modern feel */}
                </div>

                <Card className="bg-gray-800 border-gray-700 shadow-xl">
                    <CardContent className="p-0">
                        <Tabs defaultValue="public-profile" className="w-full">
                            <div className="flex flex-col md:flex-row md:gap-12">
                                <TabsList
                                    className="
                                        w-full md:w-56 flex-shrink-0 mb-4 md:mb-0
                                        flex flex-row md:flex-col items-stretch gap-2 md:gap-3
                                        p-2 rounded-xl md:rounded-l-2xl md:rounded-r-none shadow-lg
                                        overflow-x-auto md:overflow-visible
                                        sticky top-0 bg-gray-800 z-10
                                    "
                                >
                                    <TabsTrigger
                                        value="public-profile"
                                        className="
                                            flex-1 md:flex-none md:w-full flex items-center gap-2 md:gap-3 px-3 py-3 md:px-5 md:py-4
                                            text-base md:text-lg font-semibold rounded-lg md:rounded-xl transition-all
                                            bg-gray-800 hover:bg-gray-700 lg:mt-20
                                            text-gray-200 data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-lg
                                            focus:outline-none focus:ring-2 focus:ring-primary
                                            whitespace-nowrap
                                        "
                                    >
                                        <User className="w-5 h-5 md:w-6 md:h-6" />
                                        <span>Public Profile</span>
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="about-me"
                                        className="
                                            flex-1 md:flex-none md:w-full flex items-center gap-2 md:gap-3 px-3 py-3 md:px-5 md:py-4
                                            text-base md:text-lg font-semibold rounded-lg md:rounded-xl transition-all
                                            bg-gray-800 hover:bg-gray-700
                                            text-gray-200 data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-lg
                                            focus:outline-none focus:ring-2 focus:ring-primary
                                            whitespace-nowrap
                                        "
                                    >
                                        <UserCircle className="w-5 h-5 md:w-6 md:h-6" />
                                        <span>About Me</span>
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="links-contact"
                                        className="
                                            flex-1 md:flex-none md:w-full flex items-center gap-2 md:gap-3 px-3 py-3 md:px-5 md:py-4
                                            text-base md:text-lg font-semibold rounded-lg md:rounded-xl transition-all
                                            bg-gray-800 hover:bg-gray-700
                                            text-gray-200 data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-lg
                                            focus:outline-none focus:ring-2 focus:ring-primary
                                            whitespace-nowrap
                                        "
                                    >
                                        <Link2 className="w-5 h-5 md:w-6 md:h-6" />
                                        <span>Links & Contact</span>
                                    </TabsTrigger>
                                </TabsList>

                                <div className="flex-grow min-w-0 p-4 md:p-8 bg-gray-900 rounded-xl md:rounded-2xl shadow-lg mt-4 md:mt-0">
                                    <TabsContent value="public-profile" className="mt-0">
                                        <div className="space-y-6">
                                            <div>
                                                <h3 className="text-lg font-medium text-white mb-2">Public Profile Details</h3>
                                                <p className="text-gray-400 text-sm mb-6">
                                                    This information will be displayed publicly on your profile page.
                                                </p>
                                            </div>
                                            <PublicProfileForm profile={userData.profile} />
                                        </div>
                                    </TabsContent>

                                    <TabsContent value="about-me" className="mt-0">
                                        <div className="space-y-6">
                                            <div>
                                                <h3 className="text-lg font-medium text-white mb-2">About Me Details</h3>
                                                <p className="text-gray-400 text-sm mb-6">
                                                    Share your story, expertise, and interests with the community.
                                                </p>
                                            </div>
                                            <AboutMeForm
                                                about={userData.about}
                                                profileSkills={userData.profile.skill}
                                                profileBadges={userData.profile.badges}
                                            />
                                        </div>
                                    </TabsContent>

                                    <TabsContent value="links-contact" className="mt-0">
                                        <div className="space-y-6">
                                            <div>
                                                <h3 className="text-lg font-medium text-white mb-2">Links & Contact Information</h3>
                                                <p className="text-gray-400 text-sm mb-6">
                                                    Manage your social links and contact preferences.
                                                </p>
                                            </div>
                                            <LinksContactForm profile={userData.profile} />
                                        </div>
                                    </TabsContent>
                                </div>
                            </div>
                        </Tabs>
                    </CardContent>
                </Card>
            </div>
        </main>
    );
}