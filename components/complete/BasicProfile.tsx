// components/profile-steps/BasicInfoStep.tsx
'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"; // No Card needed here
import { toast } from "sonner";

interface BasicInfoStepProps {
    data: {
        profilePictureUrl: string | null; // Preview URL or existing URL
        bio: string;
        role: string;
        location: string;
    };
    onChange: (field: keyof BasicInfoStepProps['data'], value: string | null) => void;
    onPictureChange: (file: File | null) => void; // Handle file object directly
    isLoading: boolean;
}

export function BasicInfoStep({ data, onChange, onPictureChange, isLoading }: BasicInfoStepProps) {

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            // Validate file type/size if needed client-side
            const allowedTypes = ['image/png', 'image/jpeg', 'image/gif'];
            if (!allowedTypes.includes(file.type)) {
                toast.error("Invalid file type. Please upload PNG, JPG, or GIF.");
                event.target.value = ''; // Reset input
                return;
            }
            if (file.size > 5 * 1024 * 1024) { // 5MB limit
                toast.error("File is too large. Maximum size is 5MB.");
                event.target.value = ''; // Reset input
                return;
            }
            onPictureChange(file); // Pass File object up
        } else {
            onPictureChange(null);
        }
    };

    return (
        <>
            <CardHeader className="px-0 pt-0"> {/* Adjust padding if needed */}
                <CardTitle>Basic Profile Info</CardTitle>
                <CardDescription>Start by telling us who you are. Upload a picture and add your role.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 px-0 pb-0"> {/* Adjust padding if needed */}
                {/* Profile Picture Upload Area */}
                <div className="flex items-center space-x-4">
                    <Avatar className="h-20 w-20">
                        <AvatarImage src={data.profilePictureUrl || undefined} alt="Profile Picture Preview" />
                        <AvatarFallback>PIC</AvatarFallback>
                    </Avatar>
                    <div>
                        <Label htmlFor="picture-upload" className={isLoading ? 'cursor-not-allowed' : 'cursor-pointer'}>
                            <Button asChild variant="outline" disabled={isLoading}>
                                <span>{data.profilePictureUrl ? "Change Picture" : "Upload Picture"}</span>
                            </Button>
                            <Input
                                id="picture-upload"
                                type="file"
                                accept="image/png, image/jpeg, image/gif"
                                className="hidden"
                                onChange={handleFileSelect}
                                disabled={isLoading}
                            />
                        </Label>
                        <p className="text-xs text-muted-foreground mt-1">PNG, JPG, GIF up to 5MB.</p>
                    </div>
                </div>

                {/* Bio */}
                <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                        id="bio"
                        placeholder="Tell us a little bit about yourself..."
                        rows={3}
                        value={data.bio}
                        onChange={(e) => onChange('bio', e.target.value)}
                        disabled={isLoading}
                        maxLength={300}
                    />
                    <p className="text-xs text-muted-foreground">A brief introduction shown on your profile (max 300 chars).</p>
                </div>

                {/* Role */}
                <div className="space-y-2">
                    <Label htmlFor="role">Your Primary Role</Label>
                    <Select value={data.role} onValueChange={(value) => onChange('role', value)} disabled={isLoading}>
                        <SelectTrigger id="role">
                            <SelectValue placeholder="Select your primary role" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="developer">Developer</SelectItem>
                            <SelectItem value="designer">Designer</SelectItem>
                            <SelectItem value="manager">Product Manager</SelectItem>
                            <SelectItem value="qa">QA Engineer</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Location */}
                <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                        id="location"
                        placeholder="e.g., London, UK"
                        value={data.location}
                        onChange={(e) => onChange('location', e.target.value)}
                        disabled={isLoading}
                    />
                </div>
            </CardContent>
        </>
    );
}