import Link from 'next/link';
import Image from 'next/image';
import { User, Code, Award } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

export default function FeaturedDevelopers({ developers }) {
    console.log('Featured Developers:', developers);
    return (
        <Card className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5 border-b border-gray-100">
                <div className="flex items-center">
                    <Award className="h-5 w-5 text-primary mr-2" />
                    <CardTitle className="text-lg md:text-xl font-bold">Featured Developers</CardTitle>
                </div>
            </CardHeader>
            <CardContent className="p-0">
                {developers && developers.length > 0 ? (
                    <div>
                        {developers.map((developer, index) => (
                            <Link
                                key={developer.id}
                                href={`/${developer.username}`}
                                className={`flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors ${index !== developers.length - 1 ? 'border-b border-gray-100' : ''
                                    }`}
                            >
                                <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
                                    {developer.avatar_url ? (
                                        <Image
                                            src={developer.avatar_url}
                                            alt={developer.name}
                                            fill
                                            className="object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary font-medium text-lg">
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
                                        <h3 className="font-medium text-gray-900 truncate">{developer.name}</h3>
                                        {index < 3 && (
                                            <span className="ml-2 px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full">
                                                Top {index + 1}
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex items-center text-sm text-gray-500 mt-1">
                                        <Code className="h-3.5 w-3.5 mr-1" />
                                        <span>{developer.projects_count} {developer.projects_count === 1 ? 'project' : 'projects'}</span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8 text-gray-500">
                        <User className="h-10 w-10 mx-auto mb-2 text-gray-400" />
                        <p>No featured developers yet</p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
} 