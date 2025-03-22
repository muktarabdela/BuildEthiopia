import Image from "next/image"
import { Github, Linkedin, Twitter, MapPin, Globe, Edit, Check, Star, MessageCircle, UserPlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useState } from "react"
import SettingsModal from "./settings"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

export default function ProfileHeader({ user, isOwner }) {
    const [isSettingsOpen, setIsSettingsOpen] = useState(false)

    console.log("user data from profile_header", user.skill)

    // Status display configuration
    const statusOptions = [
        { value: 'open_to_work', label: 'Open to Work', color: 'bg-green-500' },
        { value: 'hiring', label: 'Hiring', color: 'bg-blue-500' },
        { value: 'none', label: 'None', color: 'bg-gray-500' }
    ]

    return (
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 relative p-8">
            {/* Edit Profile Button */}
            {isOwner && (
                <Button
                    onClick={() => setIsSettingsOpen(true)}
                    className="absolute top-4 right-4 bg-indigo-600 hover:bg-indigo-700 rounded-full px-6 py-3 shadow-lg flex items-center gap-2"
                    aria-label="Edit profile"
                >
                    <Edit className="h-4 w-4" />
                    <span>Edit Profile</span>
                </Button>
            )}

            <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-8">
                {/* Profile Picture Section */}
                <div className="relative w-28 h-28 mx-auto md:mx-0">
                    <Image
                        src={user.profilePicture}
                        alt={user.displayName}
                        fill
                        className="rounded-full object-cover border-4 border-white shadow-lg"
                    />
                    {/* Verified Badge */}
                    <div className="absolute bottom-2 right-2 bg-white rounded-full p-1.5 shadow-md">
                        <Check className="h-5 w-5 text-blue-500" />
                    </div>
                </div>

                {/* Profile Info Section */}
                <div className="space-y-4">
                    {/* Name and Username */}
                    <div className="space-y-1">
                        <h1 className="text-3xl font-bold text-white">
                            {user.displayName}
                        </h1>
                        <p className="text-gray-400 text-lg">
                            @{user.username}
                        </p>
                    </div>

                    {/* Bio - Only show if exists */}
                    {user.bio && (
                        <p className="text-gray-700 text-lg leading-relaxed max-w-2xl">
                            {user.bio}
                        </p>
                    )}

                    {/* Social Links */}
                    <div className="flex gap-4 pt-2">
                        {user.socialLinks.github && (
                            <Link
                                href={user.socialLinks.github}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                                aria-label="GitHub profile"
                            >
                                <Github className="h-6 w-6" />
                            </Link>
                        )}
                        {user.socialLinks.linkedin && (
                            <Link
                                href={user.socialLinks.linkedin}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                                aria-label="LinkedIn profile"
                            >
                                <Linkedin className="h-6 w-6" />
                            </Link>
                        )}
                        {user.socialLinks.twitter && (
                            <Link
                                href={user.socialLinks.twitter}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                                aria-label="Twitter profile"
                            >
                                <Twitter className="h-6 w-6" />
                            </Link>
                        )}
                    </div>
                </div>

                {/* Status Badge */}
                <div className="md:col-start-2 flex gap-3 justify-end">
                    {user.status && user.status !== 'none' && (
                        <div className={`px-6 py-2 rounded-full ${statusOptions.
                            find(opt => opt.value === user.status)?.color ||
                            'bg-gray-700 text-white'} text-white text-sm font-medium`}>
                            {statusOptions.find(opt => opt.value === user.status)?.
                                label}
                        </div>
                    )}
                </div>
            </div>

            <SettingsModal
                isOpen={isSettingsOpen}
                onClose={() => setIsSettingsOpen(false)}
                user={user}
            />
        </div>
    )
}



