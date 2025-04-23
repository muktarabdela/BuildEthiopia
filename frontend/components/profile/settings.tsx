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
import { supabase } from "@/lib/supabase"
import { toast } from "sonner"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Badge } from "@/components/ui/badge"

const profileSchema = z.object({
    displayName: z.string().min(2, "Name must be at least 2 characters").max(50),
    username: z.string().min(3, "Username must be at least 3 characters").max(20),
    bio: z.string().max(500, "Bio must be less than 500 characters").optional(),
    github: z.string()
        .refine(val => !val || val.startsWith('https://'), "Must be a valid URL starting with https://")
        .or(z.literal("")),
    linkedin: z.string()
        .refine(val => !val || val.startsWith('https://'), "Must be a valid URL starting with https://")
        .or(z.literal("")),
    twitter: z.string()
        .refine(val => !val || val.startsWith('https://'), "Must be a valid URL starting with https://")
        .or(z.literal("")),
    telegram: z.string()
        .refine(val => !val || val.startsWith('@'), "Must start with @")
        .or(z.literal("")),
    profilePicture: z.string()
        .refine(val => !val || val.startsWith('https://'), "Must be a valid URL starting with https://")
        .optional(),
    skill: z.array(z.string().min(1)).optional(),
    status: z.enum(["none", "open_to_work", "hiring"]),
    website_url: z.string()
        .refine(val => !val || val.startsWith('https://'), "Must be a valid URL starting with https://")
        .or(z.literal("")),
    location: z.string().max(100, "Location must be less than 100 characters").optional(),
    badges: z.array(z.string().min(1)).optional()
})

type FormData = z.infer<typeof profileSchema>

interface SettingsModalProps {
    isOpen: boolean
    onClose: () => void
    user: any
}

export default function SettingsModal({ isOpen, onClose, user }: SettingsModalProps) {
    const {
        control,
        register,
        handleSubmit,
        formState: { errors, isDirty },
        watch,
        setValue,
        reset
    } = useForm<FormData>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            displayName: user.displayName,
            username: user.username,
            bio: user.bio,
            github: user.socialLinks.github || "",
            linkedin: user.socialLinks.linkedin || "",
            twitter: user.socialLinks.twitter || "",
            telegram: user.socialLinks.telegram || "",
            profilePicture: user.profilePicture || "",
            status: user.status || "none",
            website_url: user.website_url || "",
            location: user.location || "",
            skill: user.skill || [], // Assuming user.skill is an array of strings
            badges: user.badges?.map(badge => badge.name) || []
        }
    })
    const [isLoading, setIsLoading] = useState(false)
    const [skillInput, setSkillInput] = useState("")
    const [badgeInput, setBadgeInput] = useState("")
    const skill = watch("skill") || []
    const badges = watch("badges") || []

    const handleAddTech = () => {
        if (skillInput.trim() && !skill.includes(skillInput)) {
            setValue("skill", [...skill, skillInput], { shouldValidate: true })
            setSkillInput("")
        }
    }

    const handleRemoveTech = (tech: string) => {
        setValue("skill", skill.filter(t => t !== tech), { shouldValidate: true })
    }

    const handleAddBadge = () => {
        if (badgeInput.trim() && !badges.includes(badgeInput)) {
            setValue("badges", [...badges, badgeInput], { shouldValidate: true })
            setBadgeInput("")
        }
    }

    const handleRemoveBadge = (badge: string) => {
        setValue("badges", badges.filter(b => b !== badge), { shouldValidate: true })
    }

    const onSubmit = async (data: FormData) => {
        console.log("Form data:", data)
        setIsLoading(true)

        try {
            // Create update object with only changed fields
            const updateData = {
                ...(isDirty && {
                    name: data.displayName,
                    username: data.username,
                    bio: data.bio,
                    github_url: data.github,
                    linkedin_url: data.linkedin,
                    telegram_url: data.twitter,
                    profile_picture: data.profilePicture,
                    status: data.status,
                    skill: data.skill,
                    website_url: data.website_url,
                    location: data.location,
                    badges: data.badges
                }),
                updated_at: new Date().toISOString()
            }

            // Filter out undefined values
            const filteredUpdateData = Object.fromEntries(
                Object.entries(updateData).filter(([_, value]) => value !== undefined)
            )

            console.log("Update data:", filteredUpdateData)

            const { data: response, error } = await supabase
                .from('profiles')
                .update(filteredUpdateData)
                .eq('id', user.id)
                .select()

            console.log("Supabase response:", response)

            if (error) {
                console.error("Supabase error:", error)
                throw error
            }

            toast.success("Profile updated successfully!")
            reset(data, { keepValues: true })
            onClose()
        } catch (error) {
            console.error("Update error:", error)
            toast.error(error.message || "Failed to update profile")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl bg-gray-800 border-gray-700">
                <DialogHeader>
                    <DialogTitle className="text-white">Edit Profile</DialogTitle>
                </DialogHeader>
                <div className="max-h-[80vh] overflow-y-auto">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        {/* Display Name */}
                        <div className="space-y-2">
                            <Label htmlFor="displayName" className="text-white">Display Name</Label>
                            <Input
                                id="displayName"
                                {...register("displayName")}
                                className="bg-gray-700 text-white border-gray-600 text-white"
                                placeholder="Your name"
                                aria-invalid={!!errors.displayName}
                            />
                            {errors.displayName && (
                                <p className="text-sm text-red-400">{errors.displayName.message}</p>
                            )}
                        </div>

                        {/* Username */}
                        <div className="space-y-2">
                            <Label htmlFor="username" className="text-white">Username</Label>
                            <Input
                                id="username"
                                {...register("username")}
                                className="bg-gray-700 text-white border-gray-600 text-white"
                                placeholder="Your username"
                                aria-invalid={!!errors.username}
                            />
                            {errors.username && (
                                <p className="text-sm text-red-400">{errors.username.message}</p>
                            )}
                        </div>

                        {/* Bio */}
                        <div className="space-y-2">
                            <Label htmlFor="bio" className="text-white">Bio</Label>
                            <Textarea
                                id="bio"
                                {...register("bio")}
                                className="bg-gray-700 text-white border-gray-600 text-white min-h-[100px]"
                                placeholder="Tell us about yourself"
                                aria-invalid={!!errors.bio}
                            />
                            {errors.bio && (
                                <p className="text-sm text-red-400">{errors.bio.message}</p>
                            )}
                        </div>

                        {/* Tech Stack */}
                        <div className="space-y-2">
                            <Label htmlFor="skill" className="text-white">Skill</Label>
                            <div className="flex gap-2 flex-wrap">
                                {skill.map(tech => (
                                    <Badge key={tech} variant="secondary" className="bg-gray-700 text-white hover:bg-gray-600 text-white">
                                        {tech}
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveTech(tech)}
                                            className="ml-2 hover:text-red-400"
                                            aria-label={`Remove ${tech}`}
                                        >
                                            ×
                                        </button>
                                    </Badge>
                                ))}
                            </div>
                            <div className="flex gap-2">
                                <Input
                                    value={skillInput}
                                    onChange={(e) => setskillInput(e.target.value)}
                                    className="bg-gray-700 text-white border-gray-600 text-white"
                                    placeholder="Add a technology"
                                    onKeyDown={(e) => e.key === 'Enter' && handleAddTech()}
                                />
                                <Button
                                    type="button"
                                    onClick={handleAddTech}
                                    variant="outline"
                                    className="bg-gray-700 text-white hover:bg-gray-600"
                                >
                                    Add
                                </Button>
                            </div>
                        </div>

                        {/* Social Links */}
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="github" className="text-white">GitHub</Label>
                                <Input
                                    id="github"
                                    {...register("github")}
                                    className="bg-gray-700 text-white border-gray-600 text-white"
                                    placeholder="https://github.com/username"
                                    aria-invalid={!!errors.github}
                                />
                                {errors.github && (
                                    <p className="text-sm text-red-400">{errors.github.message}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="linkedin" className="text-white">LinkedIn</Label>
                                <Input
                                    id="linkedin"
                                    {...register("linkedin")}
                                    className="bg-gray-700 text-white border-gray-600 text-white"
                                    placeholder="https://linkedin.com/in/username"
                                    aria-invalid={!!errors.linkedin}
                                />
                                {errors.linkedin && (
                                    <p className="text-sm text-red-400">{errors.linkedin.message}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="twitter" className="text-white">Twitter</Label>
                                <Input
                                    id="twitter"
                                    {...register("twitter")}
                                    className="bg-gray-700 text-white border-gray-600 text-white"
                                    placeholder="https://twitter.com/username"
                                    aria-invalid={!!errors.twitter}
                                />
                                {errors.twitter && (
                                    <p className="text-sm text-red-400">{errors.twitter.message}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="telegram" className="text-white">Telegram</Label>
                                <Input
                                    id="telegram"
                                    {...register("telegram")}
                                    className="bg-gray-700 text-white border-gray-600 text-white"
                                    placeholder="@username"
                                    aria-invalid={!!errors.telegram}
                                />
                                {errors.telegram && (
                                    <p className="text-sm text-red-400">{errors.telegram.message}</p>
                                )}
                            </div>
                        </div>

                        {/* Profile Picture */}
                        <div className="space-y-2">
                            <Label htmlFor="profilePicture" className="text-white">Profile Picture</Label>
                            <Input
                                id="profilePicture"
                                {...register("profilePicture")}
                                className="bg-gray-700 text-white border-gray-600 text-white"
                                placeholder="https://example.com/avatar.png"
                                aria-invalid={!!errors.profilePicture}
                            />
                            {errors.profilePicture && (
                                <p className="text-sm text-red-400">{errors.profilePicture.message}</p>
                            )}
                        </div>

                        {/* Status */}
                        <div className="space-y-2">
                            <Label className="text-white">Status</Label>
                            <Controller
                                name="status"
                                control={control}
                                render={({ field }) => (
                                    <Select value={field.value} onValueChange={field.onChange}>
                                        <SelectTrigger className="bg-gray-700 text-white border-gray-600 text-white">
                                            <SelectValue placeholder="Select status" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-gray-800 border-gray-700">
                                            <SelectItem value="none" className="hover:bg-gray-700 text-white">None</SelectItem>
                                            <SelectItem value="Open to work" className="hover:bg-gray-700 text-white">Open to Work</SelectItem>
                                            <SelectItem value="Hiring" className="hover:bg-gray-700 text-white">Hiring</SelectItem>
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                        </div>

                        {/* Website */}
                        <div className="space-y-2">
                            <Label htmlFor="website_url" className="text-white">Website</Label>
                            <Input
                                id="website_url"
                                {...register("website_url")}
                                className="bg-gray-700 text-white border-gray-600 text-white"
                                placeholder="https://example.com"
                                aria-invalid={!!errors.website_url}
                            />
                            {errors.website_url && (
                                <p className="text-sm text-red-400">{errors.website_url.message}</p>
                            )}
                        </div>

                        {/* Location */}
                        <div className="space-y-2">
                            <Label htmlFor="location" className="text-white">Location</Label>
                            <Input
                                id="location"
                                {...register("location")}
                                className="bg-gray-700 text-white border-gray-600 text-white"
                                placeholder="City, Country"
                                aria-invalid={!!errors.location}
                            />
                            {errors.location && (
                                <p className="text-sm text-red-400">{errors.location.message}</p>
                            )}
                        </div>

                        {/* Badges */}
                        {/* <div className="space-y-2">
                            <Label htmlFor="badges" className="text-white">Badges</Label>
                            <div className="flex gap-2 flex-wrap">
                                {badges.map((badge, index) => (
                                    <Badge key={index} variant="secondary" className="bg-gray-700 text-white hover:bg-gray-600">
                                        {badge}
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveBadge(badge)}
                                            className="ml-2 hover:text-red-400"
                                            aria-label={`Remove ${badge}`}
                                        >
                                            ×
                                        </button>
                                    </Badge>
                                ))}
                            </div>
                            <div className="flex gap-2">
                                <Input
                                    value={badgeInput}
                                    onChange={(e) => setBadgeInput(e.target.value)}
                                    className="bg-gray-700 text-white border-gray-600 text-white"
                                    placeholder="Add a badge"
                                    onKeyDown={(e) => e.key === 'Enter' && handleAddBadge()}
                                />
                                <Button
                                    type="button"
                                    onClick={handleAddBadge}
                                    variant="outline"
                                    className="bg-gray-700 text-white hover:bg-gray-600"
                                >
                                    Add
                                </Button>
                            </div>
                        </div> */}

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            className="w-full bg-indigo-600 hover:bg-indigo-700"
                            disabled={isLoading || !isDirty}
                            aria-disabled={isLoading || !isDirty}
                        >
                            {isLoading ? (
                                <span className="flex items-center gap-2">
                                    <span className="animate-spin">↻</span>
                                    Updating...
                                </span>
                            ) : (
                                "Save Changes"
                            )}
                        </Button>
                    </form>
                </div>
            </DialogContent>
        </Dialog>
    )
}
