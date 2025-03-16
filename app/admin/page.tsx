import { RecentActivity } from '@/components/admin/RecentActivity';
import { StatsCard } from '@/components/admin/StatsCard';
import { getProjects, getDevelopers } from '@/lib/api/admin';

export default async function AdminDashboardPage() {
    const [projects, developers] = await Promise.all([
        getProjects(),
        getDevelopers()
    ]);

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