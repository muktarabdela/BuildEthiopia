// src/components/FeaturedProjectsSidebar.tsx
'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Calendar } from "@/components/ui/calendar"; // Use shadcn Calendar
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import Link from 'next/link';
import Image from 'next/image';
import { CalendarDays, Star } from 'lucide-react';
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';
import { FeaturedProjectHistory, Project } from '@/app/projects/page'; // Import types

type FeaturedProjectWithDetails = FeaturedProjectHistory & {
    projects: Pick<Project, 'id' | 'title' | 'logo_url' | 'description'> | null;
}

export default function FeaturedProjectsSidebar() {
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
    const [featuredProjects, setFeaturedProjects] = useState<FeaturedProjectWithDetails[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [viewMode, setViewMode] = useState<'week' | 'month'>('week'); // Add view mode if needed

    useEffect(() => {
        const fetchFeatured = async () => {
            if (!selectedDate) return;
            setIsLoading(true);

            // Define the date range based on viewMode (e.g., current week)
            const rangeStart = startOfWeek(selectedDate, { weekStartsOn: 1 }); // Monday start
            const rangeEnd = endOfWeek(selectedDate, { weekStartsOn: 1 });
            // const rangeStart = startOfMonth(selectedDate);
            // const rangeEnd = endOfMonth(selectedDate);


            try {
                // Fetch project IDs featured within the selected range
                // A project is featured if its feature period overlaps with the selected range
                const { data, error } = await supabase
                    .from('featured_projects_history')
                    .select(`
                        *,
                        projects ( id, title, logo_url, description )
                    `)
                    // Fetch projects whose feature start date is within the range
                    // OR whose feature start date is before the range AND (end date is null OR end date is within/after range)
                    // This logic ensures we catch ongoing features and features starting within the week.
                    .gte('featured_at', rangeStart.toISOString())
                    .lte('featured_at', rangeEnd.toISOString())
                    // Add more complex OR logic if needed for features spanning across the week start/end
                    .order('featured_at', { ascending: false })
                    .limit(10); // Limit displayed featured projects

                if (error) {
                    console.error("Error fetching featured projects:", error);
                    throw error;
                }

                // Optional client-side filter if Supabase query is simpler:
                // const filtered = (data || []).filter(item => {
                //     const featuredStart = new Date(item.featured_at);
                //     const featuredEnd = item.unfeatured_at ? new Date(item.unfeatured_at) : rangeEnd; // Assume ongoing if null for check
                //     return isWithinInterval(featuredStart, { start: rangeStart, end: rangeEnd }) ||
                //            (featuredStart < rangeStart && featuredEnd >= rangeStart);
                // });
                setFeaturedProjects(data as FeaturedProjectWithDetails[] || []);

            } catch (err) {
                setFeaturedProjects([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchFeatured();
    }, [selectedDate]);

    const selectedWeekFormatted = selectedDate
        ? `${format(startOfWeek(selectedDate, { weekStartsOn: 1 }), 'MMM d')} - ${format(endOfWeek(selectedDate, { weekStartsOn: 1 }), 'd, yyyy')}`
        : 'Select a date';

    const fallbackImage = "/placeholder-image.png";

    return (
        <Card className="sticky top-20"> {/* Make it sticky */}
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                    <Star className="w-5 h-5 text-yellow-400" /> Featured Projects
                </CardTitle>
                <p className="text-sm text-muted-foreground">{selectedWeekFormatted}</p>
            </CardHeader>
            <CardContent className="space-y-4">
                <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    className="rounded-md border p-0" // Compact style
                    // ISO Week for Product Hunt style
                    showOutsideDays={false}
                // weekStartsOn={1} // Monday
                />

                <div className="space-y-3 pt-4 border-t">
                    <h3 className="text-sm font-medium text-muted-foreground">
                        Featured This Week ({featuredProjects.length})
                    </h3>
                    {isLoading ? (
                        Array.from({ length: 3 }).map((_, i) => (
                            <div key={i} className="flex items-center gap-3 p-2">
                                <Skeleton className="bg-gray-700 h-8 w-8 rounded" />
                                <div className="space-y-1.5">
                                    <Skeleton className="bg-gray-700 h-3 w-24" />
                                    <Skeleton className="bg-gray-700 h-3 w-32" />
                                </div>
                            </div>
                        ))
                    ) : featuredProjects.length > 0 ? (
                        featuredProjects.map(({ project_id, projects }) => projects && (
                            <Link key={project_id} href={`/projects/${projects.id}`} className="block hover:bg-muted/50 p-2 rounded-md transition-colors">
                                <div className="flex items-center gap-3">
                                    <Image
                                        src={projects.logo_url || fallbackImage}
                                        alt={`${projects.title} logo`}
                                        width={32}
                                        height={32}
                                        className="rounded-sm object-cover border"
                                        onError={(e) => (e.currentTarget.src = fallbackImage)}
                                    />
                                    <div>
                                        <p className="text-sm font-medium leading-tight line-clamp-1">{projects.title}</p>
                                        <p className="text-xs text-muted-foreground line-clamp-1">{projects.description}</p>
                                    </div>
                                </div>
                            </Link>
                        ))
                    ) : (
                        <p className="text-sm text-muted-foreground text-center py-4">No projects featured for this week.</p>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}