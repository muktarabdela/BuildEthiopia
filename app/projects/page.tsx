'use client'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Code } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { useState, useEffect } from "react";
import { Slider } from "@/components/ui/slider";
import { useLoading } from '@/components/LoadingProvider';
// import { MultiSelect } from "@/components/ui/multi-select";

type Project = {
    id: string;
    title: string;
    description: string;
    created_at: string;
    // Add other project fields as needed
};

type Filters = {
    minProjects: number;
    maxProjects: number;
    minUpvotes: number;
    maxUpvotes: number;
    techStack: string[];
};

async function getProjects(filters?: Partial<Filters>): Promise<Project[]> {
    const { data: projects, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching projects:', error);
        return [];
    }

    return projects || [];
}

const techStackOptions = [
    { value: 'react', label: 'React' },
    { value: 'nextjs', label: 'Next.js' },
    { value: 'node', label: 'Node.js' },
    { value: 'typescript', label: 'TypeScript' },
];

export default function ProjectsPage() {
    const { setIsLoading } = useLoading();
    const [projects, setProjects] = useState<Project[]>([]);
    const [filters, setFilters] = useState<Filters>({
        minProjects: 0,
        maxProjects: 100,
        minUpvotes: 0,
        maxUpvotes: 1000,
        techStack: []
    });

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                setIsLoading(true); // Start loading
                const projects = await getProjects();
                setProjects(projects);
            } catch (error) {
                console.error('Error:', error);
            } finally {
                setIsLoading(false); // Stop loading
            }
        };
        fetchProjects();
    }, [setIsLoading]);

    const handleFilterChange = async (newFilters: Filters) => {
        const filteredProjects = await getProjects(newFilters);
        setProjects(filteredProjects);
    };

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

                {/* Filter Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div>
                        <label className="block text-sm font-medium mb-2">Number of Projects</label>
                        <Slider
                            min={0}
                            max={100}
                            value={[filters.minProjects, filters.maxProjects]}
                            onValueChange={([min, max]) => {
                                const newFilters = { ...filters, minProjects: min, maxProjects: max };
                                setFilters(newFilters);
                                handleFilterChange(newFilters);
                            }}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Total Upvotes</label>
                        <Slider
                            min={0}
                            max={1000}
                            value={[filters.minUpvotes, filters.maxUpvotes]}
                            onValueChange={([min, max]) => {
                                const newFilters = { ...filters, minUpvotes: min, maxUpvotes: max };
                                setFilters(newFilters);
                                handleFilterChange(newFilters);
                            }}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Tech Stack</label>
                        {/* <MultiSelect
                            options={techStackOptions}
                            selected={filters.techStack}
                            onChange={(selected) => {
                                const newFilters = { ...filters, techStack: selected };
                                setFilters(newFilters);
                                handleFilterChange(newFilters);
                            }}
                        /> */}
                    </div>
                </div>

                {/* Projects Grid */}
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