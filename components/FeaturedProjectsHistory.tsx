'use client';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useInView } from 'react-intersection-observer';
import axios from 'axios';
import { ProjectCard, SkeletonProjectCard } from './ProjectCard';

type FeaturedProject = {
    project: {
        id: string;
        title: string;
        description: string;
        developer: {
            name: string;
            profile_picture: string;
        };
    };
    featured_at: string;
    unfeatured_at: string;
};

// ... existing code ...

export default function FeaturedProjectsHistory() {
    const [projects, setProjects] = useState<FeaturedProject[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const { data } = await axios.get('/api/projects/featured/history');
                setProjects(data);
            } catch (error) {
                console.error('Error loading projects:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProjects();
    }, []);

    // Group projects by calendar week
    const groupedProjects = projects.reduce((acc, project) => {
        const weekStart = new Date(project.featured_at);
        weekStart.setHours(0, 0, 0, 0);
        weekStart.setDate(weekStart.getDate() - weekStart.getDay());

        // Get current week start for comparison
        const currentWeekStart = new Date();
        currentWeekStart.setHours(0, 0, 0, 0);
        currentWeekStart.setDate(currentWeekStart.getDate() - currentWeekStart.getDay());

        // Only include projects from past weeks
        if (weekStart < currentWeekStart) {
            const weekKey = weekStart.toISOString().split('T')[0];
            if (!acc[weekKey]) {
                acc[weekKey] = [];
            }
            acc[weekKey].push(project);
        }
        return acc;
    }, {} as Record<string, FeaturedProject[]>);
    return (
        <div className="w-full">
            {isLoading ? (
                // Show 3 skeleton cards while loading
                <div className="grid grid-cols-1 gap-6">
                    {Array.from({ length: 3 }).map((_, index) => (
                        <SkeletonProjectCard key={`skeleton-${index}`} />
                    ))}
                </div>
            ) : (
                Object.entries(groupedProjects).map(([weekStart, weekProjects]) => (
                    <div key={weekStart}>
                        <h3 className="text-xl font-bold mb-4 text-white mt-2">
                            Week of {new Date(weekStart).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric'
                            })}
                        </h3>
                        <div className="grid grid-cols-1 gap-6">
                            {weekProjects.map(({ project }, index) => (
                                <ProjectCard
                                    key={project.id}
                                    project={project}
                                    index={index}
                                />
                            ))}
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}