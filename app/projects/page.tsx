'use client'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Code } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { useState, useEffect } from "react";
import { Slider } from "@/components/ui/slider";
import { useLoading } from '@/components/LoadingProvider';
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
// import { MultiSelect } from "@/components/ui/multi-select";

type Project = {
    id: string;
    title: string;
    description: string;
    created_at: string;
    tech_stack?: string[];
    upvotes?: number;
    status?: 'active' | 'completed' | 'archived';
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
    const { setIsLoading, isLoading } = useLoading();
    const [projects, setProjects] = useState<Project[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
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

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <div className="container mx-auto px-4 py-8 min-h-screen">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-4xl font-bold text-white mb-2">Projects</h1>
                        <p className="text-muted-foreground">Discover and collaborate on amazing projects</p>
                    </div>
                    <Link href="/projects/new">
                        <Button size="lg" className="group">
                            <Code className="mr-2 h-5 w-5 transition-transform group-hover:scale-110" />
                            Add Project
                        </Button>
                    </Link>
                </div>

                {/* Search and Filter Section */}
                <div className="bg-card rounded-lg p-6 border shadow-sm">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                        <div className="col-span-1 lg:col-span-2">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                                <Input
                                    placeholder="Search projects..."
                                    className="pl-10"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Project Count</label>
                            <Slider
                                min={0}
                                max={100}
                                value={[filters.minProjects, filters.maxProjects]}
                                onValueChange={([min, max]) => {
                                    const newFilters = { ...filters, minProjects: min, maxProjects: max };
                                    setFilters(newFilters);
                                    handleFilterChange(newFilters);
                                }}
                                className="mt-2"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Upvotes</label>
                            <Slider
                                min={0}
                                max={1000}
                                value={[filters.minUpvotes, filters.maxUpvotes]}
                                onValueChange={([min, max]) => {
                                    const newFilters = { ...filters, minUpvotes: min, maxUpvotes: max };
                                    setFilters(newFilters);
                                    handleFilterChange(newFilters);
                                }}
                                className="mt-2"
                            />
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {techStackOptions.map((tech) => (
                            <Badge
                                key={tech.value}
                                variant={filters.techStack.includes(tech.value) ? "default" : "outline"}
                                className="cursor-pointer hover:opacity-80"
                                onClick={() => {
                                    const newTechStack = filters.techStack.includes(tech.value)
                                        ? filters.techStack.filter(t => t !== tech.value)
                                        : [...filters.techStack, tech.value];
                                    const newFilters = { ...filters, techStack: newTechStack };
                                    setFilters(newFilters);
                                    handleFilterChange(newFilters);
                                }}
                            >
                                {tech.label}
                            </Badge>
                        ))}
                    </div>
                </div>

                {/* Projects Grid */}
                <motion.div
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    variants={container}
                    initial="hidden"
                    animate="show"
                >
                    {isLoading ? (
                        // Loading skeletons
                        Array.from({ length: 6 }).map((_, i) => (
                            <Card key={i} className="hover:shadow-lg transition-shadow">
                                <CardHeader>
                                    <Skeleton className="h-6 w-2/3" />
                                </CardHeader>
                                <CardContent>
                                    <Skeleton className="h-20 w-full mb-4" />
                                    <Skeleton className="h-10 w-full" />
                                </CardContent>
                            </Card>
                        ))
                    ) : (
                        projects.map((project) => (
                            <motion.div key={project.id} variants={item}>
                                <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                                    <CardHeader>
                                        <CardTitle className="flex items-center justify-between">
                                            <span>{project.title}</span>
                                            {project.status && (
                                                <Badge variant={
                                                    project.status === 'active' ? 'default' :
                                                        project.status === 'completed' ? 'secondary' : 'outline'
                                                }>
                                                    {project.status}
                                                </Badge>
                                            )}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-muted-foreground line-clamp-3 mb-4">
                                            {project.description}
                                        </p>
                                        {project.tech_stack && (
                                            <div className="flex flex-wrap gap-2 mb-4">
                                                {project.tech_stack.map((tech) => (
                                                    <Badge key={tech} variant="outline" className="text-xs">
                                                        {tech}
                                                    </Badge>
                                                ))}
                                            </div>
                                        )}
                                        <Link href={`/projects/${project.id}`}>
                                            <Button
                                                variant="outline"
                                                className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                                            >
                                                View Project
                                            </Button>
                                        </Link>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))
                    )}
                </motion.div>

                {!isLoading && projects.length === 0 && (
                    <div className="text-center py-12">
                        <h3 className="text-xl font-semibold mb-2">No projects found</h3>
                        <p className="text-muted-foreground">Try adjusting your filters or create a new project</p>
                    </div>
                )}
            </div>
        </div>
    );
} 