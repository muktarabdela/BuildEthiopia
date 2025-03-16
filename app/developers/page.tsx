import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { Github, Linkedin, Code, Users, Star, MessageSquare } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

async function getDevelopers() {
    const { data: developers } = await supabase
        .from('profiles')
        .select(`
      id,
      name,
      username,
      bio,
      profile_picture,
      github_url,
      linkedin_url,
      contact_visible,
      projects:projects(
        id,
        title,
        upvotes_count,
        comments_count
      )
    `)
        .eq('role', 'developer')
        .order('name');

    return developers || [];
}

export default async function DevelopersPage() {
    const developers = await getDevelopers();
    console.log(developers);
    return (
        <main className="container mx-auto px-4 py-8">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-12 text-center">
                    <h1 className="text-4xl font-bold mb-4 text-white">Ethiopian Developers</h1>
                    <p className=" text-lg text-white">
                        Connect with talented developers from Ethiopia
                    </p>
                </div>

                {/* Developers Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {developers.map((developer) => {
                        const totalUpvotes = developer.projects.reduce(
                            (sum, project) => sum + (project.upvotes_count || 0),
                            0
                        );
                        const totalComments = developer.projects.reduce(
                            (sum, project) => sum + (project.comments_count || 0),
                            0
                        );

                        return (
                            <Card key={developer.id} className="hover:shadow-lg transition-shadow duration-200 bg-gray-200 ">
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
                                        className="w-full"
                                    >
                                        <Button variant="outline" className="w-full">
                                            View Profile
                                        </Button>
                                    </Link>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            </div>
        </main>
    );
}
