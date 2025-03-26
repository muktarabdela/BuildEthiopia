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

interface PublicProfileFormProps {
    profile: ProfileData;
}

export function PublicProfileForm({ profile }: PublicProfileFormProps) {
    const [isSaving, setIsSaving] = useState(false);

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
            const response = await fetch('/api/profile/public', {
                method: 'POST', // or PUT/PATCH depending on your API design
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(values),
            });

            if (!response.ok) {
                throw new Error('Failed to save profile');
            }

            const result = await response.json();
            console.log("Save successful:", result);
            toast("Your public profile information has been saved")

            // toast({ title: "Profile Updated", description: "Your public profile information has been saved." });
            // Optionally refetch data or update state if needed

        } catch (error) {
            console.error("Save failed:", error);

            toast("Could not save profile. Please try again.");
        } finally {
            setIsSaving(false);
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                {/* Profile Picture - Read only display for now */}
                <div className="space-y-2">
                    <FormLabel>Profile Picture</FormLabel>
                    <div className="flex items-center gap-4">
                        <Avatar className="h-20 w-20">
                            <AvatarImage src={profile.profile_picture || undefined} alt={profile.name || profile.username || 'User'} />
                            <AvatarFallback>{(profile.name || profile.username || 'U').substring(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        {/* <Button type="button" variant="outline" size="sm">Upload New</Button> */}
                        {/* Note: File upload requires more complex state management & API handling */}
                    </div>
                    <FormDescription>Update your avatar via account settings (if applicable) or Gravatar.</FormDescription>
                </div>

                <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Username</FormLabel>
                            <FormControl>
                                <Input placeholder="your_username" {...field} />
                            </FormControl>
                            <FormDescription>
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
                            <FormLabel>Display Name</FormLabel>
                            <FormControl>
                                <Input placeholder="Your Full Name" {...field} />
                            </FormControl>
                            <FormDescription>
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
                            <FormLabel>Bio</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Tell us a little bit about yourself"
                                    className="resize-none" // Optional: prevent resize
                                    rows={4}
                                    {...field}
                                />
                            </FormControl>
                            <FormDescription>A short introduction shown on your profile.</FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Location</FormLabel>
                            <FormControl>
                                <Input placeholder="City, Country" {...field} />
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
                            <FormLabel>Website URL</FormLabel>
                            <FormControl>
                                <Input type="url" placeholder="https://yourwebsite.com" {...field} />
                            </FormControl>
                            <FormDescription>Your personal or company website.</FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" disabled={isSaving}>
                    {isSaving ? 'Saving...' : 'Save Public Profile'}
                </Button>
            </form>
        </Form>
    );
}