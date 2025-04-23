import Link from 'next/link';
import Image from 'next/image';
import { User, Code, Award, Folder } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Skeleton } from "@/components/ui/skeleton";

interface Developer {
    id: string;
    name: string;
    username: string;
    avatar_url?: string;
    projects_count: number;
}

interface FeaturedDevelopersProps {
    developers: Developer[];
    isLoading: boolean;
}

export function SkeletonFeaturedDevelopers() {
    return (
        <Card className="bg-gray-800 rounded-xl border border-gray-700 shadow-sm overflow-hidden">
            {/* <CardHeader className="bg-gradient-to-r from-primary/20 to-primary/10 border-b border-gray-700">
                <div className="flex items-center">
                    <Award className="h-5 w-5 text-primary mr-2" />
                    <Skeleton className="bg-gray-700 h-6 w-32 bg-gray-700 text-white" />
                </div>
            </CardHeader> */}
            <CardContent className="p-0">
                {Array.from({ length: 3 }).map((_, index) => (
                    <div
                        key={index}
                        className={`flex items-center gap-4 p-4 ${index !== 2 ? 'border-b border-gray-700' : ''}`}
                    >
                        <Skeleton className="bg-gray-700 w-12 h-12 rounded-full bg-gray-700 text-white" />
                        <div className="flex-1 space-y-2">
                            <Skeleton className="bg-gray-700 h-4 w-3/4 bg-gray-700 text-white" />
                            <Skeleton className="bg-gray-700 h-3 w-1/2 bg-gray-700 text-white" />
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}

export default function FeaturedDevelopers({ developers, isLoading }: FeaturedDevelopersProps) {
    return (
        <>
            {isLoading ? (
                <SkeletonFeaturedDevelopers />
            ) : (
                <Card className="bg-gray-800 rounded-xl border border-gray-700 shadow-sm overflow-hidden">
                    <CardHeader className="bg-gradient-to-r from-primary/20 to-primary/10 border-b border-gray-700">
                        <div className="flex items-center">
                            <Award className="h-5 w-5 text-primary mr-2" />
                            <CardTitle className="text-lg md:text-xl font-bold text-gray-100">Featured Developers</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        {developers && developers.length > 0 ? (
                            <div>
                                {developers.map((developer, index) => (
                                    <Link
                                        key={developer.id}
                                        href={`/${developer.username}`}
                                        className={`flex items-center gap-4 p-4 hover:bg-gray-700 text-white transition-colors ${index !== developers.length - 1 ? 'border-b border-gray-700' : ''}`}
                                    >
                                        <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gray-700 text-white flex-shrink-0">
                                            {developer.avatar_url ? (
                                                <Image
                                                    src={developer.avatar_url}
                                                    alt={developer.name}
                                                    fill
                                                    className="object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center bg-primary/20 text-primary font-medium text-lg">
                                                    {developer.name?.charAt(0).toUpperCase() || 'D'}
                                                </div>
                                            )}
                                            {index === 0 && (
                                                <div className="absolute -top-1 -right-1 bg-yellow-400 text-white rounded-full w-5 h-5 flex items-center justify-center shadow-sm">
                                                    <Award className="h-3 w-3" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center">
                                                <h3 className="font-medium text-gray-100 truncate">{developer.name}</h3>
                                                {index < 3 && (
                                                    <span className="ml-2 px-2 py-0.5 bg-primary/20 text-primary text-xs rounded-full">
                                                        Top {index + 1}
                                                    </span>
                                                )}
                                            </div>
                                            <div className="flex items-center text-sm text-gray-300 mt-1">
                                                <Folder className="h-3.5 w-3.5 mr-1" />
                                                <span>{developer.projects_count} {developer.projects_count === 1 ? 'project' : 'projects'}</span>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>) : (
                            <div className="text-center py-8 text-gray-400">
                                <User className="h-10 w-10 mx-auto mb-2 text-gray-500" />
                                <p>No featured developers yet</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}
        </>
    );
} 