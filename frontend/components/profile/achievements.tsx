import { Trophy, Award, Heart } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
// No need to import Lucide icons for the skeleton itself

export default function AchievementsSection({ user }) {
    // Map badge icons to Lucide components
    const getIconComponent = (iconName) => {
        switch (iconName) {
            case "trophy":
                return <Trophy className="h-5 w-5" />
            case "award":
                return <Award className="h-5 w-5" />
            case "heart":
                return <Heart className="h-5 w-5" />
            default:
                return <Award className="h-5 w-5" />
        }
    }

    return (
        <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
                <CardTitle className="text-white">Achievements</CardTitle>
            </CardHeader>
            <CardContent>
                {/* Statistics Section */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                    <div className="flex flex-col items-center p-4 bg-gray-700 text-white rounded-lg">
                        <span className="text-lg font-semibold">{user.projects?.length || 0}</span>
                        <span className="text-sm text-gray-300">Projects</span>
                    </div>
                    <div className="flex flex-col items-center p-4 bg-gray-700 text-white rounded-lg">
                        <span className="text-lg font-semibold">{user.stats?.totalUpvotes || 0}</span>
                        <span className="text-sm text-gray-300">Upvotes</span>
                    </div>
                    <div className="flex flex-col items-center p-4 bg-gray-700 text-white rounded-lg">
                        <span className="text-lg font-semibold">{user.stats?.totalComments || 0}</span>
                        <span className="text-sm text-gray-300">Comments</span>
                    </div>
                </div>

                {/* Badges Section */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {user.badges.map(badge => (
                        <div key={badge.id} className="flex flex-col items-center p-4 bg-gray-700 text-white rounded-lg">
                            {getIconComponent(badge.icon)}
                            <span className="mt-2 text-sm text-center text-white">{badge.name}</span>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}

export function SkeletonAchievementsSection() {
    return (
        <Card className="bg-muted border border-gray-700">
            <CardHeader>
                <CardTitle>
                    <Skeleton className="bg-gray-700 h-6 w-36 rounded-md" />
                </CardTitle>
            </CardHeader>
            <CardContent>
                {/* Statistics Section Skeleton */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="flex flex-col items-center p-4 bg-background border border-gray-700 rounded-lg space-y-2">
                            <Skeleton className="bg-gray-700 h-6 w-12 rounded-md" />
                            <Skeleton className="bg-gray-700 h-4 w-20 rounded-md" />
                        </div>
                    ))}
                </div>

                {/* Badges Section Skeleton */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="flex flex-col items-center p-4 bg-background border border-gray-700 rounded-lg space-y-2">
                            <Skeleton className="bg-gray-700 h-8 w-8 rounded-full" />
                            <Skeleton className="bg-gray-700 h-4 w-20 rounded-md" />
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}