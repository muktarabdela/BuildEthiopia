// components/profile-steps/SkillsStep.tsx
'use client';

import React from 'react';
import { Label } from '@/components/ui/label';
import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TagInput } from './TagInput';

interface SkillsStepProps {
    data: {
        skill: string[];
        expertise: string[];
    };
    onChange: (field: keyof SkillsStepProps['data'], value: string[]) => void;
    isLoading: boolean;
}

export function SkillsStep({ data, onChange, isLoading }: SkillsStepProps) {
    return (
        <>
            <CardHeader className="px-0 pt-0">
                <CardTitle>Skills & Expertise</CardTitle>
                <CardDescription>List your key skills and broader areas of expertise.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 px-0 pb-0">
                {/* Skills */}
                <div className="space-y-2">
                    <Label>Skills</Label> {/* No htmlFor needed if TagInput handles its own label internally or via aria-label */}
                    <TagInput
                        value={data.skill}
                        onChange={(tags) => onChange('skill', tags)}
                        placeholder="Add skills (e.g., React, Node.js)..."
                        aria-label="Skills input" // Add aria-label for accessibility
                    // maxTags={15}
                    />
                    <p className="text-xs text-muted-foreground">Specific technologies, languages, or tools you use.</p>
                </div>

                {/* Expertise */}
                <div className="space-y-2">
                    <Label>Areas of Expertise</Label>
                    <TagInput
                        value={data.expertise}
                        onChange={(tags) => onChange('expertise', tags)}
                        placeholder="Add expertise (e.g., Frontend Dev)..."
                        aria-label="Expertise input"
                    // maxTags={10}
                    />
                    <p className="text-xs text-muted-foreground">Broader domains or concepts you specialize in.</p>
                </div>
            </CardContent>
        </>
    );
}

// Create similar components for BackgroundStep, LinksStep, and FinalDetailsStep,
// accepting appropriate 'data', 'onChange', and 'isLoading' props.