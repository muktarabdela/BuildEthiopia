import React from 'react';
import { Card, CardContent } from './ui/card';
import { Avatar } from '@radix-ui/react-avatar';
import { Folder } from 'lucide-react';
import Image from 'next/image';
import { Badge } from './ui/badge';
// import { Card, CardBody, Avatar, Badge } from '@heroui/react';
// import { Icon } from '@iconify/react';

interface DeveloperProps {
    rank: number;
    name: string;
    avatar: string;
    role: string;
    projects: number;
}

const getRankColor = (rank: number) => {
    switch (rank) {
        case 1:
            return "warning"; // Gold
        case 2:
            return "default"; // Silver
        case 3:
            return "danger"; // Bronze
        default:
            return "primary";
    }
};

export const DeveloperCard = ({ developer }: DeveloperProps) => {
    console.log("developer from developer card", developer)
    return (
        <Card
            className="w-full backdrop-blur-md backdrop-saturate-150 border border-default-200 bg-gradient-to-b"
        // isHoverable
        >
            <CardContent className="flex flex-col items-center gap-1 p-1">
                <div className="relative">
                    <Image
                        src="https://picsum.photos/200/300"
                        alt="hgfcvx"
                        height={96}
                        width={96}
                        className="w-24 h-24 rounded-full object-cover"
                        color={getRankColor("3")}
                    // size="lg"
                    />
                    <Badge
                        content={`#${"4"}`}
                        color={getRankColor("2")}
                        // placement="bottom-right"
                        // size="lg"
                        className="absolute -bottom-2 -right-2"
                    />
                </div>

                <div className="text-center">
                    <h3 className="text-lg font-semibold">Muktar</h3>
                    <p className="text-default-500 text-sm">developer</p>
                </div>

                <div className="flex items-center gap-2">
                    <Folder className="text-default-500" />
                    <span className="text-sm">4 Projects</span>
                </div>
            </CardContent>
        </Card>
    );
};
