'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import Image from 'next/image';
import Link from 'next/link';
import { Github, Linkedin, Filter } from 'lucide-react';

interface Developer {
    id: string;
    name: string;
    username: string;
    bio: string;
    profile_picture: string;
    github_url: string;
    linkedin_url: string;
    projects: Array<{
        id: string;
        title: string;
        upvotes_count: number;
        comments_count: number;
    }>;
}

interface DevelopersListProps {
    developers: Developer[];
}

export function DevelopersList({ developers }: DevelopersListProps) {
    const [minProjects, setMinProjects] = useState(0);
    const [maxProjects, setMaxProjects] = useState(10);
    const [minUpvotes, setMinUpvotes] = useState(0);
    const [maxUpvotes, setMaxUpvotes] = useState(100);
    const [techStack, setTechStack] = useState<string[]>([]);

    const filteredDevelopers = developers.filter(developer => {
        const projectCount = developer.projects.length;
        const totalUpvotes = developer.projects.reduce((sum, project) => sum + (project.upvotes_count || 0), 0);

        return (
            projectCount >= minProjects &&
            projectCount <= maxProjects &&
            totalUpvotes >= minUpvotes &&
            totalUpvotes <= maxUpvotes
        );
    });

    return (
        <main className="container mx-auto px-4 py-8">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-8">
                {/* Sidebar Filters */}
                <aside className="bg-gray-800 rounded-lg p-6 h-fit  mt-20 text-white">
                    <div className="flex items-center gap-2 mb-6">
                        <Filter className="w-5 h-5 text-primary" />
                        <h2 className="text-xl font-semibold">Filters</h2>
                    </div>

                    <div className="space-y-6">
                        {/* Projects Filter */}
                        <div>
                            <Label>Number of Projects</Label>
                            <div className="flex gap-2 mt-2">
                                <Input
                                    type="number"
                                    value={minProjects}
                                    onChange={(e) => setMinProjects(Number(e.target.value))}
                                    className="w-full"
                                    min={0}
                                    placeholder="Min"
                                />
                                <Input
                                    type="number"
                                    value={maxProjects}
                                    onChange={(e) => setMaxProjects(Number(e.target.value))}
                                    className="w-full"
                                    min={0}
                                    placeholder="Max"
                                />
                            </div>
                        </div>

                        <Separator className="bg-gray-700" />

                        {/* Upvotes Filter */}
                        <div>
                            <Label>Total Upvotes</Label>
                            <div className="flex gap-2 mt-2">
                                <Input
                                    type="number"
                                    value={minUpvotes}
                                    onChange={(e) => setMinUpvotes(Number(e.target.value))}
                                    className="w-full"
                                    min={0}
                                    placeholder="Min"
                                />
                                <Input
                                    type="number"
                                    value={maxUpvotes}
                                    onChange={(e) => setMaxUpvotes(Number(e.target.value))}
                                    className="w-full"
                                    min={0}
                                    placeholder="Max"
                                />
                            </div>
                        </div>

                        <Separator className="bg-gray-700" />

                        {/* Tech Stack Filter */}
                        <div>
                            <Label className='mb-2'>Tech Stack</Label>
                            <Select onValueChange={(value) => setTechStack([...techStack, value])} className="mt-2">
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select technologies" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="react">React</SelectItem>
                                    <SelectItem value="nextjs">Next.js</SelectItem>
                                    <SelectItem value="nodejs">Node.js</SelectItem>
                                    <SelectItem value="typescript">TypeScript</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </aside>

                {/* Main Content */}
                <div>
                    {/* Header */}
                    <div className="mb-12 text-center">
                        <h1 className="text-4xl font-bold mb-4 text-white">Ethiopian Developers</h1>
                        <p className="text-lg text-white">
                            Connect with talented developers from Ethiopia
                        </p>
                    </div>

                    {/* Developers Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredDevelopers.map((developer) => {
                            const totalUpvotes = developer.projects.reduce(
                                (sum, project) => sum + (project.upvotes_count || 0),
                                0
                            );
                            const totalComments = developer.projects.reduce(
                                (sum, project) => sum + (project.comments_count || 0),
                                0
                            );

                            return (
                                <Card key={developer.id} className="hover:shadow-lg transition-shadow duration-200 bg-gray-200">
                                    <CardHeader>
                                        <div className="flex items-center gap-4">
                                            <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-primary/10">
                                                {developer.profile_picture ? (
                                                    <Image
                                                        src={developer.profile_picture}
                                                        alt={developer.name}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full bg-gray-100 flex items-center justify-center text-2xl font-bold">
                                                        {developer.name?.charAt(0).toUpperCase() || 'D'}
                                                    </div>
                                                )}
                                            </div>
                                            <div>
                                                <CardTitle className="text-xl">
                                                    <Link
                                                        href={`/${developer.username}` || '#'}
                                                        className="hover:text-primary transition-colors"
                                                    >
                                                        {developer.name}
                                                    </Link>
                                                </CardTitle>
                                                {developer.username && (
                                                    <p className="text-muted-foreground text-sm">
                                                        @{developer.username}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        {developer.bio && (
                                            <p className="text-muted-foreground text-sm line-clamp-3">
                                                {developer.bio}
                                            </p>
                                        )}

                                        <div className="grid grid-cols-3 gap-4 text-center">
                                            <div>
                                                <p className="font-semibold">{developer.projects.length}</p>
                                                <p className="text-muted-foreground text-sm">Projects</p>
                                            </div>
                                            <div>
                                                <p className="font-semibold">{totalUpvotes}</p>
                                                <p className="text-muted-foreground text-sm">Upvotes</p>
                                            </div>
                                            <div>
                                                <p className="font-semibold">{totalComments}</p>
                                                <p className="text-muted-foreground text-sm">Comments</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-center gap-2">
                                            {developer.github_url && (
                                                <Link
                                                    href={developer.github_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-muted-foreground hover:text-primary transition-colors"
                                                >
                                                    <Github className="h-5 w-5" />
                                                </Link>
                                            )}
                                            {developer.linkedin_url && (
                                                <Link
                                                    href={developer.linkedin_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-muted-foreground hover:text-primary transition-colors"
                                                >
                                                    <Linkedin className="h-5 w-5" />
                                                </Link>
                                            )}
                                        </div>

                                        <Link
                                            href={`/${developer.username}`}
                                            className="w-full "
                                        >
                                            <Button variant="outline" className="w-full bg-primary hover:bg-primary/80 text-white cursor-pointer">
                                                View Profile
                                            </Button>
                                        </Link>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                </div>
            </div>
        </main>
    );
} 