import React from 'react';
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TagInput } from './TagInput';

interface FinalDetailsStepProps {
    data: {
        about_me: string;
        interests: string[];
        contact_visible: boolean;
    };
    onChange: (field: 'about_me' | 'interests' | 'contact_visible', value: string | string[] | boolean) => void;
    isLoading?: boolean;
}

export function FinalDetailsStep({ data, onChange, isLoading }: FinalDetailsStepProps) {
    return (
        <>
            <CardHeader>
                <CardTitle>Additional Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-2">
                    <Label htmlFor="about_me">About Me</Label>
                    <Textarea
                        id="about_me"
                        name="about_me"
                        value={data.about_me}
                        onChange={(e) => onChange('about_me', e.target.value)}
                        placeholder="Tell us more about yourself, your journey in tech, and what drives you..."
                        className="min-h-[150px]"
                        disabled={isLoading}
                    />
                    <p className="text-sm text-muted-foreground">
                        Share your story, motivations, and what makes you unique.
                    </p>
                </div>

                <div className="space-y-2">
                    <Label>Interests & Hobbies</Label>
                    <TagInput
                        value={data.interests}
                        onChange={(interests) => onChange('interests', interests)}
                        placeholder="Add your interests and press Enter"
                    />
                    <p className="text-sm text-muted-foreground">
                        Add your interests, hobbies, or activities you enjoy outside of work.
                    </p>
                </div>

                <div className="flex items-center justify-between space-x-2">
                    <div className="space-y-0.5">
                        <Label htmlFor="contact_visible">Contact Visibility</Label>
                        <p className="text-sm text-muted-foreground">
                            Allow others to see your contact information
                        </p>
                    </div>
                    {/* <Switch
                        id="contact_visible"
                        checked={data.contact_visible}
                        onCheckedChange={(checked: boolean) => onChange('contact_visible', checked)}
                        disabled={isLoading}
                    /> */}
                </div>
            </CardContent>
        </>
    );
}
