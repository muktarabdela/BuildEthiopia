import { Project } from '@/lib/types';

interface RecentActivityProps {
    projects: Project[];
}

export const RecentActivity = ({ projects }: RecentActivityProps) => {
    return (
        <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
            <ul className="space-y-4">
                {projects.map((project) => (
                    <li key={project.id} className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium">{project.title}</p>
                            <p className="text-sm text-gray-500">
                                by {project.developer?.name}
                            </p>
                        </div>
                        <span className="text-sm text-gray-500">
                            {new Date(project.created_at).toLocaleDateString()}
                        </span>
                    </li>
                ))}
            </ul>
        </div>
    );
}; 