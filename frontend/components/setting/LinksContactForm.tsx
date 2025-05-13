// components/settings/LinksContactForm.tsx
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
import { Checkbox } from "@/components/ui/checkbox";
import { linksContactSchema, LinksContactInput } from "@/lib/validations/setting";
import { ProfileData } from "@/lib/definitions/setting";
import { useState } from "react";
import { toast } from "sonner";

interface LinksContactFormProps {
    profile: ProfileData;
}

export function LinksContactForm({ profile }: LinksContactFormProps) {
    const [isSaving, setIsSaving] = useState(false);

    const form = useForm<LinksContactInput>({
        resolver: zodResolver(linksContactSchema),
        defaultValues: {
            email: profile.email ?? "",
            github_url: profile.github_url ?? "",
            linkedin_url: profile.linkedin_url ?? "",
            telegram_url: profile.telegram_url ?? "",
            contact_visible: profile.contact_visible ?? false,
        },
    });

    async function onSubmit(values: LinksContactInput) {
        setIsSaving(true);
        try {
            const response = await fetch('/api/profile/links', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(values),
            });

            if (!response.ok) {
                throw new Error('Failed to save links & contact info');
            }

            toast("Your information has been saved.");

        } catch (error) {
            console.error("Save failed:", error);
            toast("Could not save information. Please try again.");
        } finally {
            setIsSaving(false);
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-gray-200">Email Address</FormLabel>
                            <FormControl>
                                <Input
                                    type="email"
                                    placeholder="your.email@example.com"
                                    className="bg-gray-700/50 border-gray-600 placeholder:text-gray-400 text-gray-100"
                                    {...field}
                                />
                            </FormControl>
                            <FormDescription className="text-gray-400">
                                Your primary contact email. {profile.is_verify_email ? '(Verified)' : '(Not Verified - Verification needed)'}
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="github_url"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-gray-200">GitHub URL</FormLabel>
                            <FormControl>
                                <Input
                                    type="url"
                                    placeholder="https://github.com/yourusername"
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
                    name="linkedin_url"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-gray-200">LinkedIn URL</FormLabel>
                            <FormControl>
                                <Input
                                    type="url"
                                    placeholder="https://linkedin.com/in/yourprofile"
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
                    name="telegram_url"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-gray-200">Telegram URL</FormLabel>
                            <FormControl>
                                <Input
                                    type="url"
                                    placeholder="https://t.me/yourusername"
                                    className="bg-gray-700/50 border-gray-600 placeholder:text-gray-400 text-gray-100"
                                    {...field}
                                />
                            </FormControl>
                            <FormDescription className="text-gray-400">
                                Link to your Telegram profile (optional).
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="contact_visible"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border border-gray-700 bg-gray-800/50 p-4">
                            <FormControl>
                                <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                    className="border-gray-600 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                                />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                                <FormLabel className="text-gray-200">
                                    Make Contact Info Visible
                                </FormLabel>
                                <FormDescription className="text-gray-400">
                                    Allow others to see your Email and Telegram link on your public profile.
                                </FormDescription>
                            </div>
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
                        'Save Links & Contact'
                    )}
                </Button>
            </form>
        </Form>
    );
}