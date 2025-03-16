import { Project } from '@/lib/types';
import { FeaturedToggle } from './FeaturedToggle';
import Link from 'next/link';

interface ProjectRowProps {
    project: Project;
}

export const ProjectRow = ({ project }: ProjectRowProps) => {
    return (
        <tr>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {project.title}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {project.developer?.name}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <FeaturedToggle projectId={project.id} isFeatured={project.featured} />
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <Link
                    href={`/projects/${project.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-600 hover:text-indigo-900"
                >
                    View
                </Link>
            </td>
        </tr>
    );
}; 