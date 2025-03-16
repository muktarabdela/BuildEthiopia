'use client';

import { useState } from 'react';
import { updateFeaturedStatus } from '@/lib/api/admin';

interface FeaturedToggleProps {
    projectId: string;
    isFeatured: boolean;
}

export const FeaturedToggle = ({ projectId, isFeatured }: FeaturedToggleProps) => {
    const [featured, setFeatured] = useState(isFeatured);
    const [isLoading, setIsLoading] = useState(false);

    const handleToggle = async () => {
        setIsLoading(true);
        try {
            await updateFeaturedStatus(projectId, !featured);
            setFeatured(!featured);
        } catch (error) {
            console.error('Failed to update featured status:', error);
            // Optionally show a toast notification here
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <button
            onClick={handleToggle}
            disabled={isLoading}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${featured ? 'bg-indigo-600' : 'bg-gray-200'
                } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            aria-label={featured ? 'Unfeature project' : 'Feature project'}
        >
            <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${featured ? 'translate-x-6' : 'translate-x-1'
                    }`}
            />
        </button>
    );
}; 