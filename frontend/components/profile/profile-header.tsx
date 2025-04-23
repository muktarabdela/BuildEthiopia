import Image from "next/image"

import { Skeleton } from "@/components/ui/skeleton"
import { Github, Linkedin, Twitter, MapPin, Globe, Edit, Check, Star, MessageCircle, UserPlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useState } from "react"
import SettingsModal from "./settings"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

export default function ProfileHeader({ user, isOwner, about }) {

    console.log("user data from profile_header", user)

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
                <Link href={`/${user.username}/setting`}>
                    <Button
                        className="absolute top-4 right-4 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-full px-6 py-3 shadow-lg flex items-center gap-2 transition duration-200"
                        aria-label="Edit profile"
                    >
                        <Edit className="h-4 w-4" />
                        <span>Edit Profile</span>
                    </Button>
                </Link>
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
                    {about?.title && (
                        <p className="text-gray-400 text-lg leading-relaxed max-w-2xl">
                            {about?.title}
                        </p>
                    )}

                    {/* Social Links */}
                    <div className="flex gap-4 pt-2">
                        {user.socialLinks.github && (
                            <Link
                                href={user.socialLinks.github}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
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
                                className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
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
                                className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                                aria-label="Twitter profile"
                            >
                                <Twitter className="h-6 w-6" />
                            </Link>
                        )}
                    </div>

                    {/* Portfolio Website Call to Action */}
                    {user.socialLinks.website && (
                        <div className="flex gap-2 items-center pt-2">
                            <Globe className="h-5 w-5 text-gray-400" />
                            <Link
                                href={user.socialLinks.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-400 hover:text-gray-600 transition-colors duration-200 font-medium"
                                aria-label="Personal portfolio website"
                            >
                                Visit Portfolio Website →
                            </Link>
                        </div>
                    )}
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


        </div>
    )
}



export function SkeletonProfileHeader() {
    return (
        // Use a muted background instead of the gradient for skeleton state
        <div className="bg-muted relative p-8 border-b border-gray-700">

            {/* Placeholder for Edit Button (Optional, maintains space) */}
            {/* Position it simply in the flow for skeleton simplicity */}
            <div className="absolute top-4 right-4 hidden sm:block"> {/* Hide on very small screens */}
                <Skeleton className="bg-gray-700 h-10 w-32 rounded-full" />
            </div>


            {/* Main grid structure */}
            <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-8">

                {/* Profile Picture Skeleton Section */}
                <div className="relative w-28 h-28 mx-auto md:mx-0">
                    {/* Avatar Placeholder */}
                    <Skeleton className="bg-gray-700 h-full w-full rounded-full border-4 border-background" />
                    {/* Verified Badge Placeholder */}
                    <Skeleton className="bg-gray-700 absolute bottom-2 right-2 h-7 w-7 rounded-full border-2 border-background" />
                </div>

                {/* Profile Info Skeleton Section */}
                <div className="space-y-4 text-center md:text-left"> {/* Adjust text alignment */}
                    {/* Name and Username Placeholder */}
                    <div className="space-y-1.5">
                        <Skeleton className="bg-gray-700 h-8 w-48 mx-auto md:mx-0 rounded" /> {/* Name */}
                        <Skeleton className="bg-gray-700 h-6 w-32 mx-auto md:mx-0 rounded" /> {/* Username */}
                    </div>

                    {/* Bio Placeholder (Assume 2 lines) */}
                    <div className="space-y-1.5 max-w-2xl mx-auto md:mx-0">
                        <Skeleton className="bg-gray-700 h-4 w-full rounded" />
                        <Skeleton className="bg-gray-700 h-4 w-5/6 rounded" />
                        <Skeleton className="bg-gray-700 h-4 w-11/12 rounded" />
                    </div>

                    {/* Social Links Placeholder */}
                    <div className="flex gap-4 pt-2 justify-center md:justify-start">
                        <Skeleton className="bg-gray-700 h-6 w-6 rounded" /> {/* GitHub */}
                        <Skeleton className="bg-gray-700 h-6 w-6 rounded" /> {/* LinkedIn */}
                        <Skeleton className="bg-gray-700 h-6 w-6 rounded" /> {/* Twitter */}
                    </div>

                    {/* Portfolio Website Link Placeholder */}
                    <div className="flex gap-2 items-center pt-2 justify-center md:justify-start">
                        <Skeleton className="bg-gray-700 h-5 w-5 rounded" /> {/* Globe Icon */}
                        <Skeleton className="bg-gray-700 h-5 w-48 rounded" /> {/* Website URL */}
                    </div>
                </div>

                {/* Status Badge Placeholder */}
                {/* Placed logically within the second column's flow, aligned right */}
                <div className="md:col-start-2 flex justify-center md:justify-end mt-4 md:mt-0">
                    <Skeleton className="bg-gray-700 h-8 w-28 rounded-full" />
                </div>
            </div>
        </div>
    )
}