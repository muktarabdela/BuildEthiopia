import Image from "next/image"
import Link from "next/link"
import { Github, Linkedin, Twitter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"


const statusOptions = [
    { value: 'Open to work', label: 'Open to Work' },
    { value: 'Hiring', label: 'Hiring' },
    { value: 'none', label: 'None' }
];


export default function ProfileHeader({ user }) {
    console.log("user data from profile_header", user)
    console.log("User status:", user?.status);
    console.log("Status options:", statusOptions);
    return (
        <Card className="overflow-hidden bg-gradient-to-br from-gray-900 to-gray-800">
            <CardContent className="p-6">
                <div className="flex flex-col items-center space-y-4 text-center">
                    <div className="relative h-32 w-32">
                        <Image
                            src={user.profilePicture}
                            alt={user.displayName}
                            fill
                            className="rounded-full object-cover border-4 border-gray-800"
                        />
                    </div>
                    <div className="space-y-2">
                        <h1 className="text-3xl font-bold text-white">{user.displayName}</h1>
                        <p className="text-gray-300 max-w-prose">{user.bio}</p>
                        <div className="flex gap-2 justify-center">
                            {user.socialLinks.github && (
                                <a href={user.socialLinks.github} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                                    <Github className="h-6 w-6" />
                                </a>
                            )}
                            {user.socialLinks.linkedin && (
                                <a href={user.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                                    <Linkedin className="h-6 w-6" />
                                </a>
                            )}
                            {user.socialLinks.twitter && (
                                <a href={user.socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                                    <Twitter className="h-6 w-6" />
                                </a>
                            )}
                        </div>
                    </div>
                    {user?.status && user.status !== 'none' && (
                        <div className={`px-4 py-2 rounded-full ${statusOptions.find(opt => opt.value === user.status)?.color || 'bg-gray-700'} text-white text-sm font-medium`}>
                            {statusOptions.find(opt => opt.value === user.status)?.label}
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}

