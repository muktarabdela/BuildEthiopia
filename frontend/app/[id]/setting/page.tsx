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
import { notFound } from "next/navigation";

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
        <div className="container mx-auto py-10 px-4 md:px-0 max-w-4xl">
            <Card>
                <CardHeader className="">
                    <CardTitle className="text-2xl font-bold tracking-tight flex items-center gap-2">
                        <Settings className="w-6 h-6" />
                        Profile Settings
                    </CardTitle>
                    <CardDescription className="text-muted-foreground mt-2">
                        Manage and customize your profile information, preferences, and visibility settings.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Tabs defaultValue="public-profile" className="flex flex-col md:flex-row md:gap-8">
                        {/* Use flex-col for vertical layout on medium+ screens */}
                        <TabsList className="w-full md:w-48 flex-shrink-0 mb-6 md:mb-0 flex flex-row md:flex-col items-start gap-2 md:gap-1 mt-6 overflow-x-auto md:overflow-visible">
                            <TabsTrigger
                                value="public-profile"
                                className="w-full justify-start px-3 py-2 hover:bg-muted rounded-md transition-colors text-muted-foreground data-[state=active]:bg-muted data-[state=active]:text-foreground data-[state=active]:font-medium whitespace-nowrap"
                            >
                                <User className="w-4 h-4 mr-2 inline-block" />
                                Public Profile
                            </TabsTrigger>
                            <TabsTrigger
                                value="about-me"
                                className="w-full justify-start px-3 py-2 hover:bg-muted rounded-md transition-colors text-muted-foreground data-[state=active]:bg-muted data-[state=active]:text-foreground data-[state=active]:font-medium whitespace-nowrap"
                            >
                                <UserCircle className="w-4 h-4 mr-2 inline-block" />
                                About Me
                            </TabsTrigger>
                            <TabsTrigger
                                value="links-contact"
                                className="w-full justify-start px-3 py-2 hover:bg-muted rounded-md transition-colors text-muted-foreground data-[state=active]:bg-muted data-[state=active]:text-foreground data-[state=active]:font-medium whitespace-nowrap"
                            >
                                <Link2 className="w-4 h-4 mr-2 inline-block" />
                                Links & Contact
                            </TabsTrigger>
                        </TabsList>

                        <div className="flex-grow min-w-0"> {/* Added min-w-0 for flex child overflow */}
                            <TabsContent value="public-profile" className="mt-0"> {/* Remove extra margin-top */}
                                <h3 className="text-lg font-medium mb-6">Public Profile Details</h3>
                                <PublicProfileForm profile={userData.profile} />
                            </TabsContent>

                            <TabsContent value="about-me" className="mt-0">
                                <h3 className="text-lg font-medium mb-6">About Me Details</h3>
                                {/* Pass profileSkills/Badges from profile data */}
                                <AboutMeForm
                                    about={userData.about}
                                    profileSkills={userData.profile.skill}
                                    profileBadges={userData.profile.badges}
                                />
                            </TabsContent>

                            <TabsContent value="links-contact" className="mt-0">
                                <h3 className="text-lg font-medium mb-6">Links & Contact Information</h3>
                                <LinksContactForm profile={userData.profile} />
                            </TabsContent>
                        </div>
                    </Tabs>
                </CardContent>
            </Card>
        </div>
    );
}