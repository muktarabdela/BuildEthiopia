"use client"

import { useState } from "react"
import { Settings, Edit, Folder, Bell } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function SettingsSection({ user }) {
    const [isEditProfileOpen, setIsEditProfileOpen] = useState(false)
    const [formData, setFormData] = useState({
        displayName: user.displayName,
        username: user.username,
        bio: user.bio,
        github: user.socialLinks.github,
        linkedin: user.socialLinks.linkedin,
        twitter: user.socialLinks.twitter,
    })
    const [status, setStatus] = useState(user.status || "none")

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        // In a real app, you would save the data to the backend here
        console.log("Form submitted:", formData)
        setIsEditProfileOpen(false)
    }

    const handleStatusChange = (value) => {
        setStatus(value)
    }

    return (
        <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
                <CardTitle className="text-white">Settings</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label className="text-white">Status</Label>
                        <Select value={status} onValueChange={handleStatusChange}>
                            <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                                <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent className="bg-gray-800 border-gray-700">
                                <SelectItem value="none" className="hover:bg-gray-700">None</SelectItem>
                                <SelectItem value="open_to_work" className="hover:bg-gray-700">Open to Work</SelectItem>
                                <SelectItem value="hiring" className="hover:bg-gray-700">Hiring</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <Button className="w-full bg-indigo-600 hover:bg-indigo-700">
                        Save Changes
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}

