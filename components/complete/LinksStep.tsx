import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Github, Globe, Linkedin, MessageSquare } from 'lucide-react';

interface LinksStepProps {
    data: {
        github_url: string;
        linkedin_url: string;
        website_url: string;
        telegram_url: string;
    };
    onChange: (field: 'github_url' | 'linkedin_url' | 'website_url' | 'telegram_url', value: string) => void;
    isLoading?: boolean;
}

export function LinksStep({ data, onChange, isLoading }: LinksStepProps) {
    return (
        <>
            <CardHeader>
                <CardTitle>Professional Links</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-2">
                    <Label htmlFor="github_url">GitHub Profile</Label>
                    <div className="flex">
                        <div className="bg-muted flex items-center px-3 rounded-l-md border border-r-0">
                            <Github className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <Input
                            id="github_url"
                            name="github_url"
                            value={data.github_url}
                            onChange={(e) => onChange('github_url', e.target.value)}
                            placeholder="https://github.com/yourusername"
                            className="rounded-l-none"
                            disabled={isLoading}
                        />
                    </div>
                    <p className="text-sm text-muted-foreground">
                        Share your GitHub profile to showcase your code and contributions.
                    </p>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="linkedin_url">LinkedIn Profile</Label>
                    <div className="flex">
                        <div className="bg-muted flex items-center px-3 rounded-l-md border border-r-0">
                            <Linkedin className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <Input
                            id="linkedin_url"
                            name="linkedin_url"
                            value={data.linkedin_url}
                            onChange={(e) => onChange('linkedin_url', e.target.value)}
                            placeholder="https://linkedin.com/in/yourusername"
                            className="rounded-l-none"
                            disabled={isLoading}
                        />
                    </div>
                    <p className="text-sm text-muted-foreground">
                        Connect with professionals and showcase your work experience.
                    </p>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="website_url">Personal Website</Label>
                    <div className="flex">
                        <div className="bg-muted flex items-center px-3 rounded-l-md border border-r-0">
                            <Globe className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <Input
                            id="website_url"
                            name="website_url"
                            value={data.website_url}
                            onChange={(e) => onChange('website_url', e.target.value)}
                            placeholder="https://yourwebsite.com"
                            className="rounded-l-none"
                            disabled={isLoading}
                        />
                    </div>
                    <p className="text-sm text-muted-foreground">
                        Share your portfolio website or blog.
                    </p>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="telegram_url">Telegram</Label>
                    <div className="flex">
                        <div className="bg-muted flex items-center px-3 rounded-l-md border border-r-0">
                            <MessageSquare className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <Input
                            id="telegram_url"
                            name="telegram_url"
                            value={data.telegram_url}
                            onChange={(e) => onChange('telegram_url', e.target.value)}
                            placeholder="https://t.me/yourusername"
                            className="rounded-l-none"
                            disabled={isLoading}
                        />
                    </div>
                    <p className="text-sm text-muted-foreground">
                        Add your Telegram contact for direct communication.
                    </p>
                </div>
            </CardContent>
        </>
    );
}