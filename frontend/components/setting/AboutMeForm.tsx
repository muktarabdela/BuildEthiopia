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
import { Input } from "@/components/ui/input";
import { aboutMeSchema, AboutMeInput, parseCommaSeparatedString } from "@/lib/validations/setting";
import { ProfileData, UserAboutData } from "@/lib/definitions/setting";
import { useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/components/AuthProvider";

interface AboutMeFormProps {
    about: UserAboutData | null;
    profileSkills: string[] | null;
    profileBadges: string[] | null;
}

const safeJoin = (arr: string[] | null): string => (arr ?? []).join(', ');

export function AboutMeForm({ about, profileSkills, profileBadges }: AboutMeFormProps) {
    const { user, accessToken } = useAuth();
    const [isSaving, setIsSaving] = useState(false);

    const form = useForm<AboutMeInput>({
        resolver: zodResolver(aboutMeSchema),
        defaultValues: {
            about_me: about?.about_me ?? "",
            experience_summary: about?.experience_summary ?? "",
            education_summary: about?.education_summary ?? "",
            expertise_str: safeJoin(about?.expertise),
            interests_str: safeJoin(about?.interests),
            badges_str: safeJoin(profileBadges),
            skill_str: safeJoin(profileSkills),
            position_type: about?.position_type ?? "",
        },
    });

    async function onSubmit(values: AboutMeInput) {
        setIsSaving(true);
        console.log("Submitting About Me Data:", values);

        const apiPayload = {
            about_me: values.about_me,
            experience_summary: values.experience_summary,
            education_summary: values.education_summary,
            expertise: parseCommaSeparatedString(values.expertise_str),
            interests: parseCommaSeparatedString(values.interests_str),
            badges: parseCommaSeparatedString(values.badges_str),
            skill: parseCommaSeparatedString(values.skill_str),
            position_type: values.position_type,
        };

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
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                    control={form.control}
                    name="about_me"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-gray-200">About Me (Detailed)</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Share more about your passion, focus, and background..."
                                    rows={6}
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
                    name="experience_summary"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-gray-200">Experience Summary</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="e.g., 5+ years in web development"
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
                    name="education_summary"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-gray-200">Education Summary</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="e.g., B.Sc. Computer Science, XYZ University"
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
                    name="skill_str"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-gray-200">Expertise / Skills</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Comma-separated skills"
                                    rows={2}
                                    className="bg-gray-700/50 border-gray-600 placeholder:text-gray-400 text-gray-100"
                                    {...field}
                                />
                            </FormControl>
                            <FormDescription className="text-gray-400">
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
                            <FormLabel className="text-gray-200">Interests</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Open Source, DevOps, UI/UX Design"
                                    rows={3}
                                    className="bg-gray-700/50 border-gray-600 placeholder:text-gray-400 text-gray-100"
                                    {...field}
                                />
                            </FormControl>
                            <FormDescription className="text-gray-400">
                                List your professional or personal interests, separated by commas.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="position_type"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-gray-200">Position Type</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="e.g., Full-time, Part-time, Freelance"
                                    className="bg-gray-700/50 border-gray-600 placeholder:text-gray-400 text-gray-100"
                                    {...field}
                                />
                            </FormControl>
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
                        'Save About Me Details'
                    )}
                </Button>
            </form>
        </Form>
    );
}