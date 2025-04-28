// src/app/projects/page.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useLoading } from '@/components/LoadingProvider';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Code, Search, Github, ExternalLink, MessageSquare, ThumbsUp, CalendarDays } from 'lucide-react';
import { motion } from 'framer-motion';
import { Skeleton } from "@/components/ui/skeleton";
import ProjectCards from '@/components/ProjectCards';
import FeaturedProjectsSidebar from '@/components/FeaturedProjectsSidebar';
import { useDebounce } from '@/hooks/useDebounce';

// --- Types ---

// Updated Project type based on provided data
export type Project = {
    id: string;
    title: string;
    description: string;
    category: string; // e.g., "Web", "Mobile", "AI"
    post_content: string;
    images: string[];
    logo_url: string | null;
    youtube_video_url: string | null;
    tech_stack: string[];
    github_url: string | null;
    live_url: string | null;
    developer_id: string;
    upvotes_count: number;
    comments_count: number;
    is_open_source: boolean;
    created_at: string;
    updated_at: string;
};

// Type for filter state
export type Filters = {
    searchTerm: string;
    category: string; // 'all' or specific category
    techStack: string[];
    isOpenSource: boolean | null; // null means 'any'
    sortBy: 'created_at' | 'upvotes_count';
    sortOrder: 'asc' | 'desc';
};

// Type for featured project history
export type FeaturedProjectHistory = {
    id: string;
    project_id: string;
    featured_at: string;
    unfeatured_at: string | null;
    // Include project details if joining in the query, or fetch separately
    projects?: Pick<Project, 'id' | 'title' | 'logo_url' | 'description'>;
};


// --- Helper Functions ---

// Debounce hook (Example - place in hooks/useDebounce.ts)
// import { useState, useEffect } from 'react';
// export function useDebounce<T>(value: T, delay: number): T {
//   const [debouncedValue, setDebouncedValue] = useState<T>(value);
//   useEffect(() => {
//     const handler = setTimeout(() => {
//       setDebouncedValue(value);
//     }, delay);
//     return () => {
//       clearTimeout(handler);
//     };
//   }, [value, delay]);
//   return debouncedValue;
// }


// --- Main Component ---

export default function ProjectsPage() {
    const { setIsLoading, isLoading } = useLoading();
    const [projects, setProjects] = useState<Project[]>([]);
    const [filters, setFilters] = useState<Filters>({
        searchTerm: '',
        category: 'all',
        techStack: [],
        isOpenSource: null,
        sortBy: 'created_at',
        sortOrder: 'desc',
    });
    const [availableCategories, setAvailableCategories] = useState<string[]>([]);
    const [availableTechStacks, setAvailableTechStacks] = useState<string[]>([]); // Or use predefined

    const debouncedSearchTerm = useDebounce(filters.searchTerm, 500); // Debounce search

    // Fetch distinct categories and tech stacks (optional, could be hardcoded)
    useEffect(() => {
        const fetchFilterOptions = async () => {
            try {
                // Fetch distinct categories
                const { data: categoriesData, error: categoriesError } = await supabase
                    .from('projects')
                    .select('category')

                if (categoriesError) throw categoriesError;
                const distinctCategories = [...new Set(categoriesData.map(p => p.category).filter(Boolean))];
                setAvailableCategories(['all', ...distinctCategories]);

                // Fetch distinct tech stacks (can be slow if many projects/stacks)
                // Consider hardcoding or a separate table for tech stacks
                const { data: techData, error: techError } = await supabase
                    .from('projects')
                    .select('tech_stack')

                if (techError) throw techError;
                const allStacks = techData.flatMap(p => p.tech_stack || []);
                const distinctTech = [...new Set(allStacks)].sort();
                setAvailableTechStacks(distinctTech);

            } catch (error) {
                console.error('Error fetching filter options:', error);
                // Set defaults if fetch fails
                setAvailableCategories(['all', 'Web', 'Mobile', 'AI', 'Game', 'Tool']);
                setAvailableTechStacks(['react', 'nextjs', 'vue', 'angular', 'nodejs', 'python', 'go', 'rust', 'swift', 'kotlin', 'flutter']);
            }
        };
        fetchFilterOptions();
    }, []);


    // Fetch Projects based on filters
    const fetchProjects = useCallback(async (currentFilters: Filters, searchTerm: string) => {
        setIsLoading(true);
        try {
            let query = supabase
                .from('projects')
                .select('*');

            // Apply Search Filter (on title and description)
            if (searchTerm) {
                query = query.or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`);
            }

            // Apply Category Filter
            if (currentFilters.category !== 'all') {
                query = query.eq('category', currentFilters.category);
            }

            // Apply Open Source Filter
            if (currentFilters.isOpenSource !== null) {
                query = query.eq('is_open_source', currentFilters.isOpenSource);
            }

            // Apply Tech Stack Filter (contains all selected techs)
            if (currentFilters.techStack.length > 0) {
                // Use 'cs' (contains) operator - requires PostgREST v10+ and specific index recommended
                query = query.overlaps('tech_stack', currentFilters.techStack); // Alternative: contains 'cs'
                // If using 'cs': query = query.cs('tech_stack', currentFilters.techStack);
            }

            // Apply Sorting
            query = query.order(currentFilters.sortBy, { ascending: currentFilters.sortOrder === 'asc' });

            // Limit results for pagination (implement later if needed)
            query = query.limit(50); // Example limit

            const { data, error } = await query;
            console.log('Fetched projects:', data); // Debug log
            if (error) {
                console.error('Error fetching projects:', error);
                throw error;
            }

            setProjects(data || []);

        } catch (error) {
            console.error('Failed to fetch projects:', error);
            setProjects([]); // Clear projects on error
        } finally {
            setIsLoading(false);
        }
    }, [setIsLoading]); // Add dependencies that trigger re-fetch

    // Effect to fetch projects when debounced search term or filters change
    useEffect(() => {
        fetchProjects(filters, debouncedSearchTerm);
    }, [filters, debouncedSearchTerm, fetchProjects]);


    // --- Filter Handlers ---

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFilters(prev => ({ ...prev, searchTerm: e.target.value }));
    };

    const handleCategoryChange = (value: string) => {
        setFilters(prev => ({ ...prev, category: value }));
    };

    const handleTechStackToggle = (tech: string) => {
        setFilters(prev => {
            const currentStack = prev.techStack;
            const newStack = currentStack.includes(tech)
                ? currentStack.filter(t => t !== tech)
                : [...currentStack, tech];
            return { ...prev, techStack: newStack };
        });
    };

    const handleOpenSourceChange = (checked: boolean | 'indeterminate') => {
        // Cycle through true -> false -> null -> true
        setFilters(prev => {
            let newValue: boolean | null;
            if (prev.isOpenSource === true) newValue = false;
            else if (prev.isOpenSource === false) newValue = null;
            else newValue = true; // from null
            return { ...prev, isOpenSource: newValue };
        });
    };

    const handleSortChange = (value: string) => {
        const [sortBy, sortOrder] = value.split('-') as [Filters['sortBy'], Filters['sortOrder']];
        setFilters(prev => ({ ...prev, sortBy, sortOrder }));
    };

    // --- Animation Variants ---
    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.05 }
        }
    };

    // --- Render ---
    return (
        <div className="container mx-auto px-4 py-8 min-h-screen">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-2">
                        Projects Showcase
                    </h1>
                    <p className="text-muted-foreground">Discover, filter, and explore developer projects.</p>
                </div>
                {/* <Link href="/projects/new">
                    <Button size="lg" className="group bg-primary hover:bg-primary/90 text-primary-foreground">
                        <Code className="mr-2 h-5 w-5 transition-transform group-hover:scale-110" />
                        Add Your Project
                    </Button>
                </Link> */}
            </div>

            {/* Main Content Layout (3 Columns) */}
            <div className="flex flex-col lg:flex-row gap-8">

                {/* Left Sidebar: Filters */}
                <aside className="w-full lg:w-1/4 xl:w-1/5">
                    <div className="sticky top-20 space-y-6 rounded-lg bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 border border-gray-800 p-6">
                        <div className="flex items-center gap-2 pb-2 border-b border-gray-800">
                            <Search className="w-5 h-5 text-primary" />
                            <h2 className="text-xl font-semibold text-gray-100">Filters</h2>
                        </div>

                        {/* Search */}
                        <div className="space-y-2">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                <Input
                                    placeholder="Search title, description..."
                                    className="pl-10 bg-gray-900/50 border-gray-700 hover:border-gray-600 focus:border-primary transition-colors placeholder:text-gray-500"
                                    value={filters.searchTerm}
                                    onChange={handleSearchChange}
                                />
                            </div>
                        </div>

                        {/* Sort By */}
                        <div className="space-y-2">
                            <Label htmlFor="sort-by" className="text-sm font-medium text-gray-300">Sort By</Label>
                            <Select value={`${filters.sortBy}-${filters.sortOrder}`} onValueChange={handleSortChange}>
                                <SelectTrigger id="sort-by" className="w-full bg-gray-900/50 border-gray-700 hover:border-gray-600 focus:border-primary transition-colors">
                                    <SelectValue placeholder="Sort by..." />
                                </SelectTrigger>
                                <SelectContent className="bg-gray-900 border-gray-700">
                                    <SelectItem value="created_at-desc" className="text-gray-200 focus:bg-gray-800 focus:text-gray-100">Newest</SelectItem>
                                    <SelectItem value="created_at-asc" className="text-gray-200 focus:bg-gray-800 focus:text-gray-100">Oldest</SelectItem>
                                    <SelectItem value="upvotes_count-desc" className="text-gray-200 focus:bg-gray-800 focus:text-gray-100">Most Upvoted</SelectItem>
                                    <SelectItem value="upvotes_count-asc" className="text-gray-200 focus:bg-gray-800 focus:text-gray-100">Least Upvoted</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Category */}
                        <div className="space-y-2">
                            <Label htmlFor="category" className="text-sm font-medium text-gray-300">Category</Label>
                            <Select value={filters.category} onValueChange={handleCategoryChange}>
                                <SelectTrigger id="category" className="w-full bg-gray-900/50 border-gray-700 hover:border-gray-600 focus:border-primary transition-colors">
                                    <SelectValue placeholder="Select category..." />
                                </SelectTrigger>
                                <SelectContent className="bg-gray-900 border-gray-700">
                                    {availableCategories.map(cat => (
                                        <SelectItem
                                            key={cat}
                                            value={cat}
                                            className="text-gray-200 focus:bg-gray-800 focus:text-gray-100"
                                        >
                                            {cat === 'all' ? 'All Categories' : cat}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Open Source */}
                        <div className="space-y-2">
                            <Label className="text-sm font-medium text-gray-300">Project Type</Label>
                            <div className="flex items-center p-3 rounded-md bg-gray-900/50 border border-gray-700 hover:border-gray-600 transition-colors">
                                <Checkbox
                                    id="open-source"
                                    checked={filters.isOpenSource ?? 'indeterminate'}
                                    onCheckedChange={handleOpenSourceChange}
                                    className="border-gray-600 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                                />
                                <Label
                                    htmlFor="open-source"
                                    className="flex-1 cursor-pointer select-none pl-3 text-gray-200"
                                    onClick={() => handleOpenSourceChange(filters.isOpenSource ?? false)}
                                >
                                    Open Source
                                    <span className="ml-2 text-sm text-gray-400">
                                        {filters.isOpenSource === true ? '(Yes)' : filters.isOpenSource === false ? '(No)' : '(Any)'}
                                    </span>
                                </Label>
                            </div>
                        </div>

                        {/* Tech Stack */}
                        <div className="space-y-2">
                            <Label className="text-sm font-medium text-gray-300">Tech Stack</Label>
                            <div className="flex flex-wrap gap-2 max-h-60 overflow-y-auto p-3 rounded-md bg-gray-900/50 border border-gray-700 hover:border-gray-600 transition-colors">
                                {availableTechStacks.length === 0 ? (
                                    <div className="flex items-center justify-center w-full py-3">
                                        <span className="text-sm text-gray-400">Loading technologies...</span>
                                    </div>
                                ) : (
                                    availableTechStacks.map((tech) => (
                                        <Badge
                                            key={tech}
                                            variant={filters.techStack.includes(tech) ? "default" : "outline"}
                                            className={`
                                                cursor-pointer text-xs capitalize transition-all duration-200
                                                ${filters.techStack.includes(tech)
                                                    ? 'bg-primary/15 text-primary hover:bg-primary/20 border-primary/20'
                                                    : 'hover:bg-gray-800 text-gray-400 border-gray-700'
                                                }
                                            `}
                                            onClick={() => handleTechStackToggle(tech)}
                                        >
                                            {tech}
                                        </Badge>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Center Content: Project Grid */}
                <main className="w-full lg:w-1/2 xl:flex-grow">
                    <h2 className="text-xl font-semibold border-b pb-2 mb-6 text-gray-400">
                        {debouncedSearchTerm ? `Results for "${debouncedSearchTerm}"` : "All Projects"}
                        <span className="text-sm font-normal text-muted-foreground ml-2">({projects.length} found)</span>
                    </h2>
                    <motion.div
                        className="grid grid-cols-1 md:grid-cols-2 gap-6"
                        variants={containerVariants}
                        initial="hidden"
                        animate="show"
                    >
                        {isLoading ? (
                            Array.from({ length: 4 }).map((_, i) => <ProjectCardSkeleton key={i} />)
                        ) : projects.length > 0 ? (
                            projects.map((project) => (
                                <ProjectCards key={project.id} project={project} />
                            ))
                        ) : (
                            <div className="col-span-1 md:col-span-2 text-center py-12 bg-card rounded-lg border">
                                <h3 className="text-xl font-semibold mb-2">No projects found</h3>
                                <p className="text-muted-foreground">Try adjusting your filters or add your own project!</p>
                            </div>
                        )}
                    </motion.div>
                </main>

                {/* Right Sidebar: Featured Projects */}
                <aside className="w-full lg:w-1/4 xl:w-1/4">
                    <FeaturedProjectsSidebar />
                </aside>

            </div>
        </div>
    );
}


// --- Skeleton Component for Project Card ---
function ProjectCardSkeleton() {
    return (
        <div className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden p-4 space-y-3">
            <div className="flex items-center gap-3">
                <Skeleton className="bg-gray-800 h-10 w-10 rounded-full" />
                <Skeleton className="bg-gray-800 h-5 w-3/5" />
            </div>
            <Skeleton className="bg-gray-800 h-4 w-full" />
            <Skeleton className="bg-gray-800 h-4 w-4/5" />
            <Skeleton className="bg-gray-800 h-16 w-full rounded" /> {/* Image Placeholder */}
            <div className="flex gap-2">
                <Skeleton className="bg-gray-800 h-5 w-12 rounded-full" />
                <Skeleton className="bg-gray-800 h-5 w-16 rounded-full" />
                <Skeleton className="bg-gray-800 h-5 w-14 rounded-full" />
            </div>
            <div className="flex justify-between items-center pt-2">
                <Skeleton className="bg-gray-800 h-5 w-20" />
                <Skeleton className="bg-gray-800 h-8 w-24 rounded" />
            </div>
        </div>
    )
}