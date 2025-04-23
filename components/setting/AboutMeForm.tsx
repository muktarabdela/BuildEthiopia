// components/settings/AboutMeForm.tsx
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
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input"; // Using Input for summaries
import { aboutMeSchema, AboutMeInput, parseCommaSeparatedString } from "@/lib/validations/setting";
import { ProfileData, UserAboutData } from "@/lib/definitions/setting";
import { useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/components/AuthProvider"; // or your auth context/provider

interface AboutMeFormProps {
    about: UserAboutData | null;
    profileSkills: string[] | null; // Pass profile.skill separately if needed
    profileBadges: string[] | null; // Pass profile.badges separately
}

// Helper to safely join arrays for defaultValues
const safeJoin = (arr: string[] | null | undefined): string => (arr ?? []).join(', ');

export function AboutMeForm({ about, profileSkills, profileBadges }: AboutMeFormProps) {
    const { user, accessToken } = useAuth(); // Make sure your AuthProvider exposes the accessToken
    const [isSaving, setIsSaving] = useState(false);

    const form = useForm<AboutMeInput>({
        resolver: zodResolver(aboutMeSchema),
        defaultValues: {
            about_me: about?.about_me ?? "",
            experience_summary: about?.experience_summary ?? "",
            education_summary: about?.education_summary ?? "",
            expertise_str: safeJoin(about?.expertise),
            interests_str: safeJoin(about?.interests),
            badges_str: safeJoin(profileBadges), // From profiles table
            skill_str: safeJoin(profileSkills),   // From profiles table
            position_type: about?.position_type ?? "", // Add position_type
        },
    });

    async function onSubmit(values: AboutMeInput) {
        setIsSaving(true);
        console.log("Submitting About Me Data:", values);

        // Prepare data for API: Convert comma-separated strings back to arrays
        const apiPayload = {
            about_me: values.about_me,
            experience_summary: values.experience_summary,
            education_summary: values.education_summary,
            expertise: parseCommaSeparatedString(values.expertise_str),
            interests: parseCommaSeparatedString(values.interests_str),
            // Also send badge/skill arrays if your API updates them here
            badges: parseCommaSeparatedString(values.badges_str),
            skill: parseCommaSeparatedString(values.skill_str),
            position_type: values.position_type, // Add position_type
        };
        console.log("API Payload:", apiPayload);


        try {
            const response = await fetch('/api/profile/about', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`,
                },
                body: JSON.stringify(apiPayload),
            });

            if (!response.ok) {
                throw new Error('Failed to save about section');
            }

            toast("Your details have been saved.");

        } catch (error) {
            console.error("Save failed:", error);
            toast("Could not save details. Please try again.");
        } finally {
            setIsSaving(false);
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                    control={form.control}
                    name="about_me"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>About Me (Detailed)</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Share more about your passion, focus, and background..."
                                    rows={6}
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="experience_summary"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Experience Summary</FormLabel>
                            <FormControl>
                                {/* Using Input for short summary like "5+ years" */}
                                <Input placeholder="e.g., 5+ years in web development" {...field} />
                                {/* Or use Textarea for longer summaries */}
                                {/* <Textarea placeholder="Summarize your key experience..." rows={3} {...field} /> */}
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="education_summary"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Education Summary</FormLabel>
                            <FormControl>
                                <Input placeholder="e.g., B.Sc. Computer Science, XYZ University" {...field} />
                                {/* <Textarea placeholder="Summarize your education..." rows={2} {...field} /> */}
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="skill_str"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Expertise / Skills</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Comma-separated skills"
                                    rows={2}
                                    {...field}
                                />
                            </FormControl>
                            <FormDescription>
                                Enter your key skills or technologies, separated by commas.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="interests_str"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Interests</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Open Source, DevOps, UI/UX Design"
                                    rows={3}
                                    {...field}
                                />
                            </FormControl>
                            <FormDescription>
                                List your professional or personal interests, separated by commas.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                {/* Include badges and skill (legacy) if they are edited here */}
                {/* <FormField
                    control={form.control}
                    name="badges_str"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Badges</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Top Contributor, Beta Tester"
                                    rows={2}
                                    {...field}
                                />
                            </FormControl>
                            <FormDescription>
                                List any earned badges, separated by commas (from profiles table).
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                /> */}
                <FormField
                    control={form.control}
                    name="position_type"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Position Type</FormLabel>
                            <FormControl>
                                <Input placeholder="e.g., Full-time, Part-time, Freelance" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />


                <Button type="submit" disabled={isSaving}>
                    {isSaving ? 'Saving...' : 'Save About Me Details'}
                </Button>
            </form>
        </Form>
    );
}