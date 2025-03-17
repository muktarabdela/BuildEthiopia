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
        .refine(val => !val || val.startsWith('https://'), "Must be a valid URL starting with https://")
        .or(z.literal("")),
    profilePicture: z.string()
        .refine(val => !val || val.startsWith('https://'), "Must be a valid URL starting with https://")
        .optional(),
    techStack: z.array(z.string().min(1)).optional(),
    status: z.enum(["none", "open_to_work", "hiring"])
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
            status: user.status || "none"
        }
    })

    const [isLoading, setIsLoading] = useState(false)
    const [techStackInput, setTechStackInput] = useState("")
    const techStack = watch("techStack") || []

    const handleAddTech = () => {
        if (techStackInput.trim() && !techStack.includes(techStackInput)) {
            setValue("techStack", [...techStack, techStackInput], { shouldValidate: true })
            setTechStackInput("")
        }
    }

    const handleRemoveTech = (tech: string) => {
        setValue("techStack", techStack.filter(t => t !== tech), { shouldValidate: true })
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
                    tech_stack: data.techStack
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
                                className="bg-gray-700 border-gray-600 text-white"
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
                                className="bg-gray-700 border-gray-600 text-white"
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
                                className="bg-gray-700 border-gray-600 text-white min-h-[100px]"
                                placeholder="Tell us about yourself"
                                aria-invalid={!!errors.bio}
                            />
                            {errors.bio && (
                                <p className="text-sm text-red-400">{errors.bio.message}</p>
                            )}
                        </div>

                        {/* Tech Stack */}
                        <div className="space-y-2">
                            <Label htmlFor="techStack" className="text-white">Tech Stack</Label>
                            <div className="flex gap-2 flex-wrap">
                                {techStack.map(tech => (
                                    <Badge key={tech} variant="secondary" className="bg-gray-700 hover:bg-gray-600">
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
                                    value={techStackInput}
                                    onChange={(e) => setTechStackInput(e.target.value)}
                                    className="bg-gray-700 border-gray-600 text-white"
                                    placeholder="Add a technology"
                                    onKeyDown={(e) => e.key === 'Enter' && handleAddTech()}
                                />
                                <Button
                                    type="button"
                                    onClick={handleAddTech}
                                    variant="outline"
                                    className="bg-gray-700 hover:bg-gray-600"
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
                                    className="bg-gray-700 border-gray-600 text-white"
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
                                    className="bg-gray-700 border-gray-600 text-white"
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
                                    className="bg-gray-700 border-gray-600 text-white"
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
                                    className="bg-gray-700 border-gray-600 text-white"
                                    placeholder="https://t.me/username"
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
                                className="bg-gray-700 border-gray-600 text-white"
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
                                        <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                                            <SelectValue placeholder="Select status" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-gray-800 border-gray-700">
                                            <SelectItem value="none" className="hover:bg-gray-700">None</SelectItem>
                                            <SelectItem value="Open to work" className="hover:bg-gray-700">Open to Work</SelectItem>
                                            <SelectItem value="Hiring" className="hover:bg-gray-700">Hiring</SelectItem>
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                        </div>

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
