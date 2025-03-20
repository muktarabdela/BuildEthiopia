'use client'
import { RecentActivity } from '@/components/admin/RecentActivity';
import { StatsCard } from '@/components/admin/StatsCard';
import { useLoading } from '@/components/LoadingProvider';
import { getProjects, getDevelopers } from '@/lib/api/admin';
import { useEffect, useState } from 'react';

export default function AdminDashboardPage() {
    const { setIsLoading } = useLoading();
    const [projects, setProjects] = useState([]);
    const [developers, setDevelopers] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const [projectsData, developersData] = await Promise.all([
                    getProjects(),
                    getDevelopers()
                ]);
                setProjects(projectsData);
                setDevelopers(developersData);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [setIsLoading]);
    console.log('Projects from AdminDashboardPage:', projects);
    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatsCard title="Total Projects" value={projects.length} />
                <StatsCard title="Total Developers" value={developers.length} />
                <StatsCard
                    title="Featured Projects"
                    value={projects.filter(p => p.featured).length}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <RecentActivity projects={projects.slice(0, 5)} />
                {/* Add more sections as needed */}
            </div>
        </div>
    );
} 