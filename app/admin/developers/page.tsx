'use client'
import { DeveloperTable } from '@/components/admin/DeveloperTable';
import { getDevelopers } from '@/lib/api/admin';
import { useEffect, useState } from 'react';
import { useLoading } from '@/components/LoadingProvider';

export default function AdminDevelopersPage() {
    const { setIsLoading } = useLoading();
    const [developers, setDevelopers] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const data = await getDevelopers();
                setDevelopers(data);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [setIsLoading]);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Developers Management</h1>
                <div className="flex space-x-4">
                    <input
                        type="text"
                        placeholder="Search developers..."
                        className="px-4 py-2 border rounded-lg"
                    />
                    <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                        Add Developer
                    </button>
                </div>
            </div>
            <DeveloperTable developers={developers} />
        </div>
    );
} 