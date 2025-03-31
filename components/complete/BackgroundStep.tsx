import React from 'react';
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface BackgroundStepProps {
    data: {
        experience_summary: string;
        education_summary: string;
    };
    onChange: (field: 'experience_summary' | 'education_summary', value: string) => void;
    isLoading?: boolean;
}

export function BackgroundStep({ data, onChange, isLoading }: BackgroundStepProps) {
    return (
        <>
            <CardHeader>
                <CardTitle>Professional Background</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-2">
                    <Label htmlFor="experience_summary">Professional Experience</Label>
                    <Textarea
                        id="experience_summary"
                        name="experience_summary"
                        value={data.experience_summary}
                        onChange={(e) => onChange('experience_summary', e.target.value)}
                        placeholder="Summarize your professional experience, including key roles, achievements, and years of experience..."
                        className="min-h-[150px]"
                        disabled={isLoading}
                    />
                    <p className="text-sm text-muted-foreground">
                        Share your work history, key responsibilities, and notable achievements.
                    </p>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="education_summary">Education Background</Label>
                    <Textarea
                        id="education_summary"
                        name="education_summary"
                        value={data.education_summary}
                        onChange={(e) => onChange('education_summary', e.target.value)}
                        placeholder="Detail your educational background, including degrees, certifications, and relevant coursework..."
                        className="min-h-[150px]"
                        disabled={isLoading}
                    />
                    <p className="text-sm text-muted-foreground">
                        Include your degrees, certifications, and any relevant training or courses.
                    </p>
                </div>
            </CardContent>
        </>
    );
}