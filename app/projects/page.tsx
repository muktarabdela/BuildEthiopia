import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Code, Search } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

async function getProjects() {
    const { data: projects } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

    return projects || [];
}

export default async function ProjectsPage() {
    const projects = await getProjects();

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-6xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-3xl font-bold text-white">Projects</h1>
                    <Link href="/projects/new">
                        <Button>
                            <Code className="mr-2 h-4 w-4" />
                            Add Project
                        </Button>
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects.map((project) => (
                        <Card key={project.id} className="hover:shadow-lg transition-shadow">
                            <CardHeader>
                                <CardTitle>{project.title}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground line-clamp-3 mb-4">
                                    {project.description}
                                </p>
                                <Link href={`/projects/${project.id}`}>
                                    <Button variant="outline" className="w-full">
                                        View Project
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
} 