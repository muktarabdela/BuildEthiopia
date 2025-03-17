import Image from "next/image"
import { Github, Linkedin, Twitter, MapPin, Globe, Edit } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useState } from "react"
import SettingsModal from "./settings"
import { Badge } from "@/components/ui/badge"

export default function ProfileHeader({ user }) {
    const [isSettingsOpen, setIsSettingsOpen] = useState(false)

    console.log("user data from profile_header", user.skill)

    // Status display configuration
    const statusOptions = [
        { value: 'open_to_work', label: 'Open to Work', color: 'bg-green-500' },
        { value: 'hiring', label: 'Hiring', color: 'bg-blue-500' },
        { value: 'none', label: 'None', color: 'bg-gray-500' }
    ]

    return (
        <Card className="overflow-hidden bg-gradient-to-br from-gray-900 to-gray-800 relative">
            {/* Edit Profile Button */}
            <Button
                onClick={() => setIsSettingsOpen(true)}
                className="absolute top-4 right-4 bg-indigo-600 hover:bg-indigo-700 rounded-full px-6 py-3 shadow-lg flex items-center gap-2"
            >
                <Edit className="h-4 w-4" />
                <span>Edit Profile</span>
            </Button>

            <CardContent className="p-8">
                <div className="flex flex-col items-center space-y-6 text-center">
                    {/* Profile Picture */}
                    <div className="relative h-40 w-40">
                        <Image
                            src={user.profilePicture}
                            alt={user.displayName}
                            fill
                            className="rounded-full object-cover border-4 border-gray-800 shadow-xl"
                        />
                    </div>

                    {/* Name and Bio */}
                    <div className="space-y-3">
                        <h1 className="text-4xl font-bold text-white">{user.displayName}</h1>
                        <p className="text-gray-300 max-w-prose text-lg leading-relaxed">{user.bio}</p>
                    </div>

                    {/* Location and Website */}
                    <div className="flex flex-col space-y-2">
                        {user.location && (
                            <div className="flex items-center text-gray-300 text-lg">
                                <MapPin className="h-5 w-5 mr-2" />
                                <span>{user.location}</span>
                            </div>
                        )}
                        {user.website_url && (
                            <a
                                href={user.website_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-indigo-400 hover:text-indigo-300 flex items-center text-lg"
                            >
                                <Globe className="h-5 w-5 mr-2" />
                                <span>Website</span>
                            </a>
                        )}
                    </div>

                    {/* Badges and Tech Stack */}
                    <div className="flex flex-col space-y-4 w-full">
                        {/* {user.badges && user.badges.length > 0 && (
                            <div className="flex flex-wrap gap-2 justify-center">
                                {user.badges?.map((badge) => (
                                    <Badge
                                        key={badge.id}
                                        variant="secondary"
                                        className="bg-gray-700 text-white hover:bg-gray-600 px-4 py-2 rounded-full text-sm"
                                    >
                                        {badge.name}
                                    </Badge>
                                ))}
                            </div>
                        )} */}

                        {user.skill && user.skill.length > 0 && (
                            <div className="flex flex-wrap gap-2 justify-center">
                                {user.skill?.map((tech, index) => (
                                    <Badge
                                        key={index}
                                        variant="secondary"
                                        className="bg-gray-700 text-white  hover:bg-gray-600 px-4 py-2 rounded-full text-sm"
                                    >
                                        {tech}
                                    </Badge>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Status */}
                    {user.status && user.status !== 'none' && (
                        <div className={`px-6 py-2 rounded-full ${statusOptions.find(opt => opt.value === user.status)?.color || 'bg-gray-700 text-white'} text-white text-sm font-medium`}>
                            {statusOptions.find(opt => opt.value === user.status)?.label}
                        </div>
                    )}

                    {/* Social Links */}
                    <div className="flex gap-4 justify-center">
                        {user.socialLinks.github && (
                            <a
                                href={user.socialLinks.github}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-400 hover:text-white transition-all transform hover:scale-110"
                            >
                                <Github className="h-7 w-7" />
                            </a>
                        )}
                        {user.socialLinks.linkedin && (
                            <a
                                href={user.socialLinks.linkedin}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-400 hover:text-white transition-all transform hover:scale-110"
                            >
                                <Linkedin className="h-7 w-7" />
                            </a>
                        )}
                        {user.socialLinks.twitter && (
                            <a
                                href={user.socialLinks.twitter}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-400 hover:text-white transition-all transform hover:scale-110"
                            >
                                <Twitter className="h-7 w-7" />
                            </a>
                        )}
                    </div>
                </div>
            </CardContent>

            <SettingsModal
                isOpen={isSettingsOpen}
                onClose={() => setIsSettingsOpen(false)}
                user={user}
            />
        </Card>
    )
}

