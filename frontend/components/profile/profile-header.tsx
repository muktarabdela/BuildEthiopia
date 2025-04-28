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
                        <span className="hidden md:inline">Edit Profile</span>
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
                                <svg width="24" height="24" viewBox="0 0 1024 1024" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path fill-rule="evenodd" clip-rule="evenodd" d="M8 0C3.58 0 0 3.58 0 8C0 11.54 2.29 14.53 5.47 15.59C5.87 15.66 6.02 15.42 6.02 15.21C6.02 15.02 6.01 14.39 6.01 13.72C4 14.09 3.48 13.23 3.32 12.78C3.23 12.55 2.84 11.84 2.5 11.65C2.22 11.5 1.82 11.13 2.49 11.12C3.12 11.11 3.57 11.7 3.72 11.94C4.44 13.15 5.59 12.81 6.05 12.6C6.12 12.08 6.33 11.73 6.56 11.53C4.78 11.33 2.92 10.64 2.92 7.58C2.92 6.71 3.23 5.99 3.74 5.43C3.66 5.23 3.38 4.41 3.82 3.31C3.82 3.31 4.49 3.1 6.02 4.13C6.66 3.95 7.34 3.86 8.02 3.86C8.7 3.86 9.38 3.95 10.02 4.13C11.55 3.09 12.22 3.31 12.22 3.31C12.66 4.41 12.38 5.23 12.3 5.43C12.81 5.99 13.12 6.7 13.12 7.58C13.12 10.65 11.25 11.33 9.47 11.53C9.76 11.78 10.01 12.26 10.01 13.01C10.01 14.08 10 14.94 10 15.21C10 15.42 10.15 15.67 10.55 15.59C13.71 14.53 16 11.53 16 8C16 3.58 12.42 0 8 0Z" transform="scale(64)" fill="#ffff" />
                                </svg>

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
                                <svg width="24" height="24" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid" viewBox="0 0 256 256"><path d="M218.123 218.127h-37.931v-59.403c0-14.165-.253-32.4-19.728-32.4-19.756 0-22.779 15.434-22.779 31.369v60.43h-37.93V95.967h36.413v16.694h.51a39.907 39.907 0 0 1 35.928-19.733c38.445 0 45.533 25.288 45.533 58.186l-.016 67.013ZM56.955 79.27c-12.157.002-22.014-9.852-22.016-22.009-.002-12.157 9.851-22.014 22.008-22.016 12.157-.003 22.014 9.851 22.016 22.008A22.013 22.013 0 0 1 56.955 79.27m18.966 138.858H37.95V95.967h37.97v122.16ZM237.033.018H18.89C8.58-.098.125 8.161-.001 18.471v219.053c.122 10.315 8.576 18.582 18.89 18.474h218.144c10.336.128 18.823-8.139 18.966-18.474V18.454c-.147-10.33-8.635-18.588-18.966-18.453" fill="#0A66C2" /></svg>
                            </Link>
                        )}
                        {user.socialLinks.telegram && (

                            <Link
                                href={user.socialLinks.telegram}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                                aria-label="LinkedIn profile"
                            >
                                <svg viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg" width="24" height="24" preserveAspectRatio="xMidYMid"><defs><linearGradient id="a" x1="50%" x2="50%" y1="0%" y2="100%"><stop offset="0%" stop-color="#2AABEE" /><stop offset="100%" stop-color="#229ED9" /></linearGradient></defs><path fill="url(#a)" d="M128 0C94.06 0 61.48 13.494 37.5 37.49A128.038 128.038 0 0 0 0 128c0 33.934 13.5 66.514 37.5 90.51C61.48 242.506 94.06 256 128 256s66.52-13.494 90.5-37.49c24-23.996 37.5-56.576 37.5-90.51 0-33.934-13.5-66.514-37.5-90.51C194.52 13.494 161.94 0 128 0Z" /><path fill="#FFF" d="M57.94 126.648c37.32-16.256 62.2-26.974 74.64-32.152 35.56-14.786 42.94-17.354 47.76-17.441 1.06-.017 3.42.245 4.96 1.49 1.28 1.05 1.64 2.47 1.82 3.467.16.996.38 3.266.2 5.038-1.92 20.24-10.26 69.356-14.5 92.026-1.78 9.592-5.32 12.808-8.74 13.122-7.44.684-13.08-4.912-20.28-9.63-11.26-7.386-17.62-11.982-28.56-19.188-12.64-8.328-4.44-12.906 2.76-20.386 1.88-1.958 34.64-31.748 35.26-34.45.08-.338.16-1.598-.6-2.262-.74-.666-1.84-.438-2.64-.258-1.14.256-19.12 12.152-54 35.686-5.1 3.508-9.72 5.218-13.88 5.128-4.56-.098-13.36-2.584-19.9-4.708-8-2.606-14.38-3.984-13.82-8.41.28-2.304 3.46-4.662 9.52-7.072Z" /></svg>
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
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 1200 1227"><path fill="#fff" d="M714.163 519.284 1160.89 0h-105.86L667.137 450.887 357.328 0H0l468.492 681.821L0 1226.37h105.866l409.625-476.152 327.181 476.152H1200L714.137 519.284h.026ZM569.165 687.828l-47.468-67.894-377.686-540.24h162.604l304.797 435.991 47.468 67.894 396.2 566.721H892.476L569.165 687.854v-.026Z" /></svg>                            </Link>
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