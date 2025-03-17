import { Trophy, Award, Heart } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

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

