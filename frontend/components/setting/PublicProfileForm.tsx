// components/settings/PublicProfileForm.tsx
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { publicProfileSchema, PublicProfileInput } from "@/lib/validations/setting";
import { useState } from "react";
import { ProfileData } from "@/lib/definitions/setting";
import { toast } from "sonner";
import axios from "axios";
import { useAuth } from "../AuthProvider";
import { useRouter } from "next/navigation";

interface PublicProfileFormProps {
    profile: ProfileData;
}

export function PublicProfileForm({ profile }: PublicProfileFormProps) {
    const [isSaving, setIsSaving] = useState(false);
    const { user, session } = useAuth()
    const router = useRouter()
    const form = useForm<PublicProfileInput>({
        resolver: zodResolver(publicProfileSchema),
        defaultValues: {
            username: profile.username ?? "",
            name: profile.name ?? "",
            bio: profile.bio ?? "",
            location: profile.location ?? "",
            website_url: profile.website_url ?? "",
        },
    });

    async function onSubmit(values: PublicProfileInput) {
        setIsSaving(true);
        console.log("Submitting Public Profile:", values);
        try {
            const response = await axios.post('/api/profile/public', values, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${session?.access_token}`
                },
            });

            if (response.status !== 200) {
                throw new Error('Failed to save profile');
            }

            toast("Your public profile information has been saved");
            router.push(`/u/${user?.username}`);

        } catch (error) {
            console.error("Save failed:", error);
            toast("Could not save profile. Please try again.");
        } finally {
            setIsSaving(false);
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-2">
                    <FormLabel className="text-gray-200">Profile Picture</FormLabel>
                    <div className="flex items-center gap-4">
                        <Avatar className="h-20 w-20 border-2 border-gray-700">
                            <AvatarImage src={profile.profile_picture || undefined} alt={profile.name || profile.username || 'User'} />
                            <AvatarFallback className="bg-gray-700 text-gray-200">
                                {(profile.name || profile.username || 'U').substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                    </div>
                    <FormDescription className="text-gray-400">
                        Update your avatar via account settings (if applicable) or Gravatar.
                    </FormDescription>
                </div>

                <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-gray-200">Username</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="your_username"
                                    className="bg-gray-700/50 border-gray-600 placeholder:text-gray-400 text-gray-100"
                                    {...field}
                                />
                            </FormControl>
                            <FormDescription className="text-gray-400">
                                Your unique handle on this platform.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-gray-200">Display Name</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Your Full Name"
                                    className="bg-gray-700/50 border-gray-600 placeholder:text-gray-400 text-gray-100"
                                    {...field}
                                />
                            </FormControl>
                            <FormDescription className="text-gray-400">
                                This name will be displayed publicly on your profile.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="bio"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-gray-200">Bio</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Tell us a little bit about yourself"
                                    className="resize-none bg-gray-700/50 border-gray-600 placeholder:text-gray-400 text-gray-100"
                                    rows={4}
                                    {...field}
                                />
                            </FormControl>
                            <FormDescription className="text-gray-400">
                                A short introduction shown on your profile.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-gray-200">Location</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="City, Country"
                                    className="bg-gray-700/50 border-gray-600 placeholder:text-gray-400 text-gray-100"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="website_url"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-gray-200">Website URL</FormLabel>
                            <FormControl>
                                <Input
                                    type="url"
                                    placeholder="https://yourwebsite.com"
                                    className="bg-gray-700/50 border-gray-600 placeholder:text-gray-400 text-gray-100"
                                    {...field}
                                />
                            </FormControl>
                            <FormDescription className="text-gray-400">
                                Your personal or company website.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button
                    type="submit"
                    disabled={isSaving}
                    className="w-full bg-primary hover:bg-primary/90"
                >
                    {isSaving ? (
                        <div className="flex items-center gap-2">
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                            <span>Saving...</span>
                        </div>
                    ) : (
                        'Save Public Profile'
                    )}
                </Button>
            </form>
        </Form>
    );
}