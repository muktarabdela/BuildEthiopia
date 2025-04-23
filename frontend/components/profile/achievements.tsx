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
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {user.badges.map(badge => (
                        <div key={badge.id} className="flex flex-col items-center p-4 bg-gray-700 text-white rounded-lg">
                            <Trophy className="h-8 w-8 text-yellow-400" />
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
        // Use standard muted background and border for the skeleton card
        <Card className="bg-muted border border-gray-700">
            <CardHeader>
                <CardTitle>
                    {/* Skeleton for the "Achievements" title */}
                    <Skeleton className="bg-gray-700 h-6 w-36 rounded-md" />
                </CardTitle>
            </CardHeader>
            <CardContent>
                {/* Maintain the grid structure */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {/* Repeat skeleton items to fill the grid visually */}
                    {[...Array(6)].map((_, i) => ( // Generate 6 placeholders
                        <div
                            key={i}
                            // Use background for inner items, add subtle border
                            className="flex flex-col items-center p-4 bg-background border border-gray-700 rounded-lg space-y-2" // Added space-y-2 for spacing
                        >
                            {/* Skeleton for the Icon (Trophy/Award/Heart) */}
                            <Skeleton className="bg-gray-700 h-8 w-8 rounded-full" />

                            {/* Skeleton for the Badge Name */}
                            {/* Use w-full or a fixed width, text-center is handled by items-center */}
                            <Skeleton className="bg-gray-700 h-4 w-20 rounded-md" />
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}