import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

// Badge level definitions
const BADGE_LEVELS = [
    {
        id: "level_0",
        name: "Silent Coder",
        icon: "🤐",
        minProjects: 0,
        maxProjects: 0,
        description: "Haven't shipped yet. We're waiting to see your magic!"
    },
    {
        id: "level_1",
        name: "First Launch",
        icon: "🚀",
        minProjects: 1,
        maxProjects: 1,
        description: "You just launched your first project — keep building!"
    },
    {
        id: "level_2",
        name: "Builder Mode",
        icon: "🧱",
        minProjects: 2,
        maxProjects: 3,
        description: "You're in builder mode now — stacking up projects!"
    },
    {
        id: "level_3",
        name: "Code Streaker",
        icon: "🔥",
        minProjects: 4,
        maxProjects: 6,
        description: "🔥 You're on fire! Keep that momentum going."
    },
    {
        id: "level_4",
        name: "Dev Machine",
        icon: "🤖",
        minProjects: 7,
        maxProjects: 10,
        description: "You're becoming a building machine. Impressive!"
    },
    {
        id: "level_5",
        name: "Project Legend",
        icon: "🏆",
        minProjects: 11,
        maxProjects: Infinity,
        description: "You've earned your place as a community legend."
    }
] as const;

interface BadgeLevel {
    id: string;
    name: string;
    icon: string;
    minProjects: number;
    maxProjects: number;
    description: string;
}

interface AchievementsSectionProps {
    user: {
        projects?: {
            length: number;
        };
        stats?: {
            totalUpvotes: number;
            totalComments: number;
        };
    };
}

// Helper function to get current badge based on project count
const getCurrentBadge = (projectCount: number): BadgeLevel => {
    return BADGE_LEVELS.find(
        badge => projectCount >= badge.minProjects &&
            (badge.maxProjects === Infinity || projectCount <= badge.maxProjects)
    ) || BADGE_LEVELS[0];
};

// Helper function to check if a badge is unlocked
const isBadgeUnlocked = (badge: BadgeLevel, projectCount: number): boolean => {
    return projectCount >= badge.minProjects;
};

export default function AchievementsSection({ user }: AchievementsSectionProps) {
    type UserData = {
        projectCount: number;
        stats: {
            totalUpvotes: number;
            totalComments: number;
        };
    };

    // Mock data for development - remove when integrating with backend
    const defaultMockUser: UserData = {
        projectCount: 0,
        stats: {
            totalUpvotes: 15,
            totalComments: 7
        }
    };

    // Use real user data when available, fallback to mock data
    const userData: UserData = {
        projectCount: user?.projects?.length ?? defaultMockUser.projectCount,
        stats: user?.stats ?? defaultMockUser.stats
    };

    const currentBadge = getCurrentBadge(userData.projectCount);

    return (
        <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border-b border-indigo-500/20 px-6 py-4 -mt-6">
                <CardTitle className="text-white text-xl font-bold tracking-tight">
                    Achievements
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Current Badge Display */}
                <div className="bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-lg p-6 border border-indigo-500/20">
                    <h3 className="text-lg font-semibold text-white mb-2">Current Level</h3>
                    <div className="flex items-center space-x-4">
                        <div className="text-4xl">{currentBadge.icon}</div>
                        <div>
                            <h4 className="text-xl font-bold text-white">{currentBadge.name}</h4>
                            <p className="text-gray-300">{currentBadge.description}</p>
                            <p className="text-sm text-indigo-300 mt-2">
                                Projects: {userData.projectCount}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Statistics Section */}
                <div className="grid grid-cols-3 gap-4">
                    <div className="flex flex-col items-center p-4 bg-gray-700/50 rounded-lg">
                        <span className="text-2xl mb-1 text-gray-100">{userData.projectCount}</span>
                        <span className="text-sm text-gray-300">Projects</span>
                    </div>
                    <div className="flex flex-col items-center p-4 bg-gray-700/50 rounded-lg">
                        <span className="text-2xl mb-1 text-gray-100">{userData.stats.totalUpvotes}</span>
                        <span className="text-sm text-gray-300">Upvotes</span>
                    </div>
                    <div className="flex flex-col items-center p-4 bg-gray-700/50 rounded-lg">
                        <span className="text-2xl mb-1 text-gray-100">{userData.stats.totalComments}</span>
                        <span className="text-sm text-gray-300">Comments</span>
                    </div>
                </div>

                {/* All Badges Grid */}
                <div>
                    <h3 className="text-lg font-semibold text-white mb-4">Badge Progress</h3>
                    <div className="grid grid-cols-2 gap-4">
                        {BADGE_LEVELS.map((badge) => {
                            const isUnlocked = isBadgeUnlocked(badge, userData.projectCount);
                            return (
                                <div
                                    key={badge.id}
                                    className={cn(
                                        "p-4 rounded-lg border transition-all duration-200",
                                        isUnlocked
                                            ? "bg-gray-700/50 border-indigo-500/50"
                                            : "bg-gray-800/50 border-gray-700/50 opacity-50"
                                    )}
                                >
                                    <div className="flex items-center space-x-3">
                                        <div className="text-2xl">{badge.icon}</div>
                                        <div>
                                            <h4 className="font-medium text-white">{badge.name}</h4>
                                            <p className="text-sm text-gray-400">
                                                {badge.minProjects} project{badge.minProjects !== 1 ? 's' : ''}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

export function SkeletonAchievementsSection() {
    return (
        <Card className="bg-muted border border-gray-700">
            <CardHeader>
                <CardTitle>
                    <Skeleton className="bg-gray-700 h-6 w-36 rounded-md" />
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Current Badge Skeleton */}
                <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
                    <Skeleton className="bg-gray-700 h-6 w-24 mb-4" />
                    <div className="flex items-center space-x-4">
                        <Skeleton className="bg-gray-700 h-12 w-12 rounded-md" />
                        <div className="space-y-2">
                            <Skeleton className="bg-gray-700 h-6 w-32" />
                            <Skeleton className="bg-gray-700 h-4 w-48" />
                        </div>
                    </div>
                </div>

                {/* Stats Skeleton */}
                <div className="grid grid-cols-3 gap-4">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="flex flex-col items-center p-4 bg-gray-800/50 rounded-lg space-y-2">
                            <Skeleton className="bg-gray-700 h-6 w-12" />
                            <Skeleton className="bg-gray-700 h-4 w-16" />
                        </div>
                    ))}
                </div>

                {/* Badges Grid Skeleton */}
                <div>
                    <Skeleton className="bg-gray-700 h-6 w-32 mb-4" />
                    <div className="grid grid-cols-2 gap-4">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                                <div className="flex items-center space-x-3">
                                    <Skeleton className="bg-gray-700 h-8 w-8 rounded-md" />
                                    <div className="space-y-2">
                                        <Skeleton className="bg-gray-700 h-4 w-24" />
                                        <Skeleton className="bg-gray-700 h-3 w-16" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}