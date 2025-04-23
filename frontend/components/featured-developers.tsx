import { Avatar } from '@radix-ui/react-avatar';
import React from 'react';
import { Badge } from './ui/badge';
import { Card } from './ui/card';
import { Icon } from 'lucide-react';
// import { Card, Avatar, Badge } from '@heroui/react';
// import { Icon } from '@iconify/react';

interface Developer {
    id: string;
    name: string;
    rank: number;
    projects: number;
    avatar?: string;
}

const developers: Developer[] = [
    {
        id: '1',
        name: 'Muktar Hassen',
        rank: 1,
        projects: 4,
    },
    {
        id: '2',
        name: 'Muktar Abdela',
        rank: 2,
        projects: 0,
    },
    {
        id: '3',
        name: 'Muhammed Nurhusien',
        rank: 3,
        projects: 0,
    },
    {
        id: '4',
        name: 'Muhammed Nurhusien',
        rank: 4,
        projects: 2,
    },
];

export const FeaturedDeveloper = () => {
    return (
        <Card
            className="w-[250px] bg-[#0A1E2C] p-4"
            shadow="none"
        >
            <div className="flex items-center gap-2 mb-6">
                <Icon
                    icon="lucide:users"
                    className="w-5 h-5 text-[#A1D6D9]"
                />
                <h2 className="text-[#A1D6D9] text-xl font-bold">
                    Featured Developers
                </h2>
            </div>

            <div className="space-y-4">
                {developers?.map((dev) => (
                    <div
                        key={dev.id}
                        className="flex items-center gap-3 p-2 rounded-lg transition-all duration-300 hover:bg-[#1A2C3D] hover:scale-[1.02] cursor-pointer"
                    >
                        <Avatar
                            name={dev.name}
                            className="w-10 h-10 shadow-[0px_2px_4px_rgba(0,0,0,0.2)]"
                            classNames={{
                                base: "bg-[#1A2C3D]",
                                name: "text-[#A1D6D9]"
                            }}
                        />

                        <div className="flex-1">
                            <h3 className="text-white text-base font-medium">
                                {dev.name}
                            </h3>
                            <div className="flex items-center gap-2">
                                <Badge
                                    color="success"
                                    variant="flat"
                                    className="text-[#A1D6D9] text-xs"
                                >
                                    Top {dev.rank}
                                </Badge>
                                <span className="text-[#4CAF50] text-sm">
                                    {dev.projects} projects
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </Card>
    );
};