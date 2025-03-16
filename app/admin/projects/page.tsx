import { ProjectTable } from '@/components/admin/ProjectTable';
import { getProjects } from '@/lib/api/admin';

export default async function AdminProjectsPage() {
    const projects = await getProjects();

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Projects Management</h1>
                <div className="flex space-x-4">
                    <input
                        type="text"
                        placeholder="Search projects..."
                        className="px-4 py-2 border rounded-lg"
                    />
                    <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                        Add Project
                    </button>
                </div>
            </div>
            <ProjectTable projects={projects} />
        </div>
    );
} 