// src/components/FeaturedProjectsSidebar.tsx
'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import Link from 'next/link';
import Image from 'next/image';
import { CalendarDays, Star, ChevronRight, ChevronDown } from 'lucide-react';
import { format, startOfWeek, endOfWeek, eachWeekOfInterval, startOfYear, endOfYear, eachMonthOfInterval, isSameMonth, isSameWeek } from 'date-fns';
import { FeaturedProjectHistory, Project } from '@/app/projects/page';
import { Button } from '@/components/ui/button';

import { ScrollArea } from '@radix-ui/react-scroll-area';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@radix-ui/react-collapsible';
// import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

type FeaturedProjectWithDetails = FeaturedProjectHistory & {
    projects: Pick<Project, 'id' | 'title' | 'logo_url' | 'description'> | null;
}

type GroupedProjects = {
    [key: string]: {
        [key: string]: {
            [key: string]: FeaturedProjectWithDetails[];
        };
    };
};

export default function FeaturedProjectsSidebar() {
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [featuredProjects, setFeaturedProjects] = useState<FeaturedProjectWithDetails[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [groupedProjects, setGroupedProjects] = useState<GroupedProjects>({});
    const [expandedYear, setExpandedYear] = useState<string>(format(new Date(), 'yyyy'));
    const [expandedMonth, setExpandedMonth] = useState<string>(format(new Date(), 'yyyy-MM'));
    const [expandedWeek, setExpandedWeek] = useState<string>('');

    useEffect(() => {
        const fetchFeatured = async () => {
            setIsLoading(true);
            try {
                const startDate = startOfYear(selectedDate);
                const endDate = endOfYear(selectedDate);

                const { data, error } = await supabase
                    .from('featured_projects_history')
                    .select(`
                        *,
                        projects ( id, title, logo_url, description )
                    `)
                    .gte('featured_at', startDate.toISOString())
                    .lte('featured_at', endDate.toISOString())
                    .order('featured_at', { ascending: false });

                if (error) throw error;

                // Group projects by year, month, and week
                const grouped: GroupedProjects = {};
                (data || []).forEach((project) => {
                    const date = new Date(project.featured_at);
                    const year = format(date, 'yyyy');
                    const month = format(date, 'MMMM');
                    const weekStart = format(startOfWeek(date, { weekStartsOn: 1 }), 'MM-dd');
                    const weekEnd = format(endOfWeek(date, { weekStartsOn: 1 }), 'MM-dd');
                    const weekKey = `${weekStart}~${weekEnd}`;

                    if (!grouped[year]) grouped[year] = {};
                    if (!grouped[year][month]) grouped[year][month] = {};
                    if (!grouped[year][month][weekKey]) grouped[year][month][weekKey] = [];

                    grouped[year][month][weekKey].push(project);
                });

                setGroupedProjects(grouped);
                setFeaturedProjects(data || []);

            } catch (err) {
                console.error('Error fetching featured projects:', err);
                setFeaturedProjects([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchFeatured();
    }, [selectedDate]);

    const fallbackImage = "/placeholder-image.png";

    return (
        <Card className="sticky top-20 bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 border-gray-800">
            <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-xl text-gray-100">
                    <Star className="w-5 h-5 text-yellow-400 animate-pulse" /> Featured Projects
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <ScrollArea className="h-[600px] pr-4">
                    {Object.entries(groupedProjects)
                        .sort(([yearA], [yearB]) => Number(yearB) - Number(yearA))
                        .map(([year, months]) => (
                            <Collapsible
                                key={year}
                                open={expandedYear === year}
                                onOpenChange={() => setExpandedYear(expandedYear === year ? '' : year)}
                                className="space-y-2"
                            >
                                <CollapsibleTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        className={`w-full flex items-center justify-between p-2 text-left font-semibold ${expandedYear === year ? 'bg-gray-800/50 text-primary' : 'text-gray-200'
                                            }`}
                                    >
                                        <span>{year}</span>
                                        <ChevronRight className={`w-4 h-4 transition-transform ${expandedYear === year ? 'rotate-90' : ''
                                            }`} />
                                    </Button>
                                </CollapsibleTrigger>
                                <CollapsibleContent className="space-y-2 pl-4">
                                    {Object.entries(months).map(([month, weeks]) => (
                                        <Collapsible
                                            key={`${year}-${month}`}
                                            open={expandedMonth === `${year}-${month}`}
                                            onOpenChange={() => setExpandedMonth(expandedMonth === `${year}-${month}` ? '' : `${year}-${month}`)}
                                        >
                                            <CollapsibleTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    className={`w-full flex items-center justify-between p-2 text-left ${expandedMonth === `${year}-${month}` ? 'text-primary/80' : 'text-gray-300'
                                                        }`}
                                                >
                                                    <span>{month}</span>
                                                    <ChevronRight className={`w-4 h-4 transition-transform ${expandedMonth === `${year}-${month}` ? 'rotate-90' : ''
                                                        }`} />
                                                </Button>
                                            </CollapsibleTrigger>
                                            <CollapsibleContent className="space-y-2 pl-4">
                                                {Object.entries(weeks).map(([weekKey, projects]) => {
                                                    const [start, end] = weekKey.split('~');
                                                    return (
                                                        <Collapsible
                                                            key={`${year}-${month}-${weekKey}`}
                                                            open={expandedWeek === `${year}-${month}-${weekKey}`}
                                                            onOpenChange={() => setExpandedWeek(expandedWeek === `${year}-${month}-${weekKey}` ? '' : `${year}-${month}-${weekKey}`)}
                                                        >
                                                            <CollapsibleTrigger asChild>
                                                                <Button
                                                                    variant="ghost"
                                                                    className={`w-full flex items-center justify-between p-2 text-sm ${expandedWeek === `${year}-${month}-${weekKey}` ? 'text-primary/70 bg-gray-800/30' : 'text-gray-400'
                                                                        }`}
                                                                >
                                                                    <div className="flex items-center gap-2">
                                                                        <CalendarDays className="w-4 h-4" />
                                                                        <span>{start} - {end}</span>
                                                                    </div>
                                                                    <div className="flex items-center gap-2">
                                                                        <span className="text-xs bg-gray-800 px-2 py-0.5 rounded-full">
                                                                            {projects.length}
                                                                        </span>
                                                                        <ChevronDown className={`w-3 h-3 transition-transform ${expandedWeek === `${year}-${month}-${weekKey}` ? 'rotate-180' : ''
                                                                            }`} />
                                                                    </div>
                                                                </Button>
                                                            </CollapsibleTrigger>
                                                            <CollapsibleContent className="pl-4 pt-2 space-y-2">
                                                                {projects.map((project) => (
                                                                    project.projects && (
                                                                        <Link
                                                                            key={project.id}
                                                                            href={`/projects/${project.projects.id}`}
                                                                            className="group flex items-center gap-3 p-2 rounded-lg hover:bg-gray-800/50 transition-all duration-200 border border-transparent hover:border-gray-700"
                                                                        >
                                                                            <div className="relative w-10 h-10 rounded-lg overflow-hidden border border-gray-700 bg-gray-800">
                                                                                <Image
                                                                                    src={project.projects.logo_url || fallbackImage}
                                                                                    alt={`${project.projects.title} logo`}
                                                                                    fill
                                                                                    className="object-cover transition-transform group-hover:scale-110"
                                                                                    onError={(e) => (e.currentTarget.src = fallbackImage)}
                                                                                />
                                                                            </div>
                                                                            <div>
                                                                                <p className="text-sm font-medium leading-tight text-gray-200 group-hover:text-primary transition-colors">
                                                                                    {project.projects.title}
                                                                                </p>
                                                                                <p className="text-xs text-gray-400 line-clamp-1 group-hover:text-gray-300 transition-colors">
                                                                                    {project.projects.description}
                                                                                </p>
                                                                            </div>
                                                                        </Link>
                                                                    )
                                                                ))}
                                                            </CollapsibleContent>
                                                        </Collapsible>
                                                    );
                                                })}
                                            </CollapsibleContent>
                                        </Collapsible>
                                    ))}
                                </CollapsibleContent>
                            </Collapsible>
                        ))}

                    {isLoading && (
                        <div className="space-y-4 pt-4">
                            {Array.from({ length: 3 }).map((_, i) => (
                                <div key={i} className="flex items-center gap-3 p-2 bg-gray-900/30 rounded-lg animate-pulse">
                                    <Skeleton className="h-10 w-10 rounded-lg bg-gray-800" />
                                    <div className="space-y-2 flex-1">
                                        <Skeleton className="h-3 w-24 bg-gray-800" />
                                        <Skeleton className="h-3 w-32 bg-gray-800" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {!isLoading && Object.keys(groupedProjects).length === 0 && (
                        <div className="text-center py-6 bg-gray-900/30 rounded-lg border border-gray-800">
                            <p className="text-sm text-gray-400">No featured projects found.</p>
                        </div>
                    )}
                </ScrollArea>
            </CardContent>
        </Card>
    );
}