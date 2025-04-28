'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import Image from 'next/image';
import Link from 'next/link';
import { Github, Linkedin, Filter } from 'lucide-react';
import { useLoading } from '@/components/LoadingProvider';

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
    const { setIsLoading } = useLoading();
    const [minProjects, setMinProjects] = useState(0);
    const [maxProjects, setMaxProjects] = useState(10);
    const [minUpvotes, setMinUpvotes] = useState(0);
    const [maxUpvotes, setMaxUpvotes] = useState(100);
    const [techStack, setTechStack] = useState<string[]>([]);

    // Simulate loading during filtering
    useEffect(() => {
        setIsLoading(true); // Start loading when filters change
        const timeout = setTimeout(() => {
            setIsLoading(false); // Stop loading after a short delay (simulate filtering)
        }, 200); // Adjust the delay as needed

        return () => clearTimeout(timeout);
    }, [minProjects, maxProjects, minUpvotes, maxUpvotes, techStack, setIsLoading]);

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
            {/* Header */}
            <div className="mb-12 text-center">
                <h1 className="text-4xl font-bold mb-4 text-white">Ethiopian Developers</h1>
                <p className="text-lg text-white">
                    Connect with talented developers from Ethiopia
                </p>
            </div>
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-8">
                {/* Sidebar Filters */}
                <aside className="bg-gray-800 rounded-lg p-6 h-fit text-white">
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

                        <Separator className="bg-gray-700 text-white" />

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

                        <Separator className="bg-gray-700 text-white" />

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
                                <Card key={developer.id} className="hover:shadow-lg transition-shadow duration-200 bg-gray-800 border-gray-700">
                                    <CardHeader>
                                        <div className="flex items-center gap-4">
                                            <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-primary/20">
                                                {developer.profile_picture ? (
                                                    <Image
                                                        src={developer.profile_picture}
                                                        alt={developer.name}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full bg-gray-700 flex items-center justify-center text-2xl font-bold text-primary">
                                                        {developer.name?.charAt(0).toUpperCase() || 'D'}
                                                    </div>
                                                )}
                                            </div>
                                            <div>
                                                <CardTitle className="text-xl text-white">
                                                    <Link
                                                        href={`/${developer.username}` || '#'}
                                                        className="hover:text-primary transition-colors"
                                                    >
                                                        {developer.name}
                                                    </Link>
                                                </CardTitle>
                                                {developer.username && (
                                                    <p className="text-gray-400 text-sm">
                                                        @{developer.username}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        {developer.bio && (
                                            <p className="text-gray-300 text-sm line-clamp-3">
                                                {developer.bio}
                                            </p>
                                        )}

                                        <div className="grid grid-cols-3 gap-4 text-center">
                                            <div>
                                                <p className="font-semibold text-white">{developer.projects.length}</p>
                                                <p className="text-gray-400 text-sm">Projects</p>
                                            </div>
                                            <div>
                                                <p className="font-semibold text-white">{totalUpvotes}</p>
                                                <p className="text-gray-400 text-sm">Upvotes</p>
                                            </div>
                                            <div>
                                                <p className="font-semibold text-white">{totalComments}</p>
                                                <p className="text-gray-400 text-sm">Comments</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-center gap-4">
                                            {developer.github_url && (
                                                <Link
                                                    href={developer.github_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-gray-400 hover:text-white transition-colors"
                                                >
                                                    <svg width="24" height="24" viewBox="0 0 1024 1024" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path fill-rule="evenodd" clip-rule="evenodd" d="M8 0C3.58 0 0 3.58 0 8C0 11.54 2.29 14.53 5.47 15.59C5.87 15.66 6.02 15.42 6.02 15.21C6.02 15.02 6.01 14.39 6.01 13.72C4 14.09 3.48 13.23 3.32 12.78C3.23 12.55 2.84 11.84 2.5 11.65C2.22 11.5 1.82 11.13 2.49 11.12C3.12 11.11 3.57 11.7 3.72 11.94C4.44 13.15 5.59 12.81 6.05 12.6C6.12 12.08 6.33 11.73 6.56 11.53C4.78 11.33 2.92 10.64 2.92 7.58C2.92 6.71 3.23 5.99 3.74 5.43C3.66 5.23 3.38 4.41 3.82 3.31C3.82 3.31 4.49 3.1 6.02 4.13C6.66 3.95 7.34 3.86 8.02 3.86C8.7 3.86 9.38 3.95 10.02 4.13C11.55 3.09 12.22 3.31 12.22 3.31C12.66 4.41 12.38 5.23 12.3 5.43C12.81 5.99 13.12 6.7 13.12 7.58C13.12 10.65 11.25 11.33 9.47 11.53C9.76 11.78 10.01 12.26 10.01 13.01C10.01 14.08 10 14.94 10 15.21C10 15.42 10.15 15.67 10.55 15.59C13.71 14.53 16 11.53 16 8C16 3.58 12.42 0 8 0Z" transform="scale(64)" fill="#000000" />
                                                    </svg>
                                                </Link>
                                            )}
                                            {developer.linkedin_url && (
                                                <Link
                                                    href={developer.linkedin_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-gray-400 hover:text-white transition-colors"
                                                >
                                                    <svg width="24" height="24" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid" viewBox="0 0 256 256"><path d="M218.123 218.127h-37.931v-59.403c0-14.165-.253-32.4-19.728-32.4-19.756 0-22.779 15.434-22.779 31.369v60.43h-37.93V95.967h36.413v16.694h.51a39.907 39.907 0 0 1 35.928-19.733c38.445 0 45.533 25.288 45.533 58.186l-.016 67.013ZM56.955 79.27c-12.157.002-22.014-9.852-22.016-22.009-.002-12.157 9.851-22.014 22.008-22.016 12.157-.003 22.014 9.851 22.016 22.008A22.013 22.013 0 0 1 56.955 79.27m18.966 138.858H37.95V95.967h37.97v122.16ZM237.033.018H18.89C8.58-.098.125 8.161-.001 18.471v219.053c.122 10.315 8.576 18.582 18.89 18.474h218.144c10.336.128 18.823-8.139 18.966-18.474V18.454c-.147-10.33-8.635-18.588-18.966-18.453" fill="#0A66C2" /></svg>
                                                </Link>
                                            )}
                                        </div>

                                        <Link
                                            href={`/${developer.username}`}
                                            className="w-full cursor-pointer"
                                        >
                                            <Button variant="outline" className="w-full bg-primary/90 hover:bg-primary text-white border-primary/50 cursor-pointer">
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