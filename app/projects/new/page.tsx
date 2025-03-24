"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { ChevronLeft, ChevronRight, Github, Globe, Upload, Check, AlertCircle } from "lucide-react"
import axios from "axios"
import { supabase } from "@/lib/supabase"
import { useAuth } from "@/components/AuthProvider"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useLoading } from '@/components/LoadingProvider'

export default function NewProjectPage() {
    const { user } = useAuth()
    const router = useRouter()
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState("")
    const [uuid, setUuid] = useState<string | null>(null)
    const [currentStep, setCurrentStep] = useState(0)
    const [progress, setProgress] = useState(0)
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        logo_url: "",
        github_url: "",
        live_url: "",
        category: "",
        post_content: "",
        youtube_video_url: "",
        tech_stack: [] as string[],
        is_open_source: true,
    })
    const [imageFiles, setImageFiles] = useState<File[]>([])
    const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([])
    const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})
    const [showSuccessDialog, setShowSuccessDialog] = useState(false)

    // Add a new state for logo file and preview
    const [logoFile, setLogoFile] = useState<File | null>(null)
    const [logoPreviewUrl, setLogoPreviewUrl] = useState<string>("")

    const steps = [
        { id: "basics", label: "Basic Info" },
        { id: "media", label: "Media" },
        { id: "links", label: "Links" },
        { id: "review", label: "Review" },
    ]

    // Add a new state for managing tech stack input
    const [techInput, setTechInput] = useState("")

    const supabase = createClientComponentClient()
    const { setIsLoading } = useLoading()

    useEffect(() => {
        async function checkAccess() {
            if (!user) {
                console.log("No valid session found, redirecting to login")
                router.push("/login")
                return
            }
            setUuid(user?.id)
            const { data: profile, error: profileError } = await supabase
                .from("profiles")
                .select("*")
                .eq("id", user?.id)
                .single()

            // console.log("Profile data:", profile)
            console.log("Profile error:", profileError)

            if (!profile) {
                router.push("/")
                return
            }

            setLoading(false)
        }

        checkAccess()
    }, [router, user])

    useEffect(() => {
        // Update progress based on current step
        setProgress(((currentStep + 1) / steps.length) * 100)
    }, [currentStep, steps.length])

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))

        // Clear validation error when user types
        if (validationErrors[name]) {
            setValidationErrors((prev) => {
                const newErrors = { ...prev }
                delete newErrors[name]
                return newErrors
            })
        }
    }

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const filesArray = Array.from(e.target.files)

            // Limit to 5 images
            const selectedFiles = filesArray.slice(0, 5)

            setImageFiles(selectedFiles)

            // Create preview URLs
            const newImageUrls = selectedFiles.map((file) => URL.createObjectURL(file))
            setImagePreviewUrls(newImageUrls)
        }
    }

    const validateStep = () => {
        const errors: Record<string, string> = {}

        if (currentStep === 0) {
            if (!formData.title.trim()) errors.title = "Project title is required"
            if (!formData.description.trim()) errors.description = "Project description is required"
            if (formData.description.trim().length < 50) errors.description = "Description should be at least 50 characters"
            if (!formData.category.trim()) errors.category = "Project category is required"
        }

        if (currentStep === 1) {
            if (!formData.post_content.trim()) errors.post_content = "Project content is required"
            if (formData.post_content.trim().length < 100)
                errors.post_content = "Project content should be at least 100 characters"
        }

        if (currentStep === 2) {
            if (formData.youtube_video_url && !isValidUrl(formData.youtube_video_url))
                errors.youtube_video_url = "Please enter a valid YouTube URL"
            if (formData.tech_stack.length === 0) errors.tech_stack = "Please add at least one technology"
        }

        setValidationErrors(errors)
        return Object.keys(errors).length === 0
    }

    const isValidUrl = (url: string) => {
        try {
            new URL(url)
            return true
        } catch (e) {
            return false
        }
    }

    const nextStep = () => {
        if (validateStep()) {
            if (currentStep < steps.length - 1) {
                setCurrentStep(currentStep + 1)
            }
        }
    }

    const prevStep = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1)
        }
    }

    // Add a function to handle tech stack input
    const handleTechInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && techInput.trim()) {
            e.preventDefault()
            if (!formData.tech_stack.includes(techInput.trim())) {
                setFormData((prev) => ({
                    ...prev,
                    tech_stack: [...prev.tech_stack, techInput.trim()],
                }))
            }
            setTechInput("")
        }
    }

    const removeTechItem = (index: number) => {
        setFormData((prev) => ({
            ...prev,
            tech_stack: prev.tech_stack.filter((_, i) => i !== index),
        }))
    }

    // Add a function to handle checkbox changes
    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = e.target
        setFormData((prev) => ({ ...prev, [name]: checked }))
    }

    const handleImageUpload = async (files: File[], logo?: File) => {
        try {
            const uploadedUrls: string[] = []

            // Upload logo first if exists
            if (logo) {
                const logoUrl = await uploadSingleFile(logo)
                uploadedUrls.push(logoUrl)
            }

            // Upload other images
            for (const file of files) {
                const fileUrl = await uploadSingleFile(file)
                uploadedUrls.push(fileUrl)
            }

            return uploadedUrls
        } catch (error) {
            console.error('Error uploading images:', error)
            throw error
        }
    }

    // Helper function for single file upload
    const uploadSingleFile = async (file: File) => {
        const fileExt = file.name.split('.').pop()
        const fileName = `${Math.random()}.${fileExt}`
        const filePath = `${user?.id}/${fileName}`

        const { data, error } = await supabase.storage
            .from('project')
            .upload(filePath, file)

        if (error) throw error

        const { data: urlData } = supabase.storage
            .from('project')
            .getPublicUrl(data.path)

        return urlData.publicUrl
    }

    const handleSubmit = async () => {
        if (!validateStep()) return

        setSubmitting(true)
        setError("")

        try {
            setIsLoading(true)

            // If no logo is uploaded, use first image as logo
            const logoToUpload = logoFile || (imageFiles.length > 0 ? imageFiles[0] : null)

            const imageUrls = await handleImageUpload(imageFiles, logoToUpload)

            const data = {
                title: formData.title,
                description: formData.description,
                images: logoToUpload ? imageUrls.slice(1) : imageUrls,
                logo_url: logoToUpload ? imageUrls[0] : null,
                developer_id: uuid,
                github_url: formData.github_url || null,
                live_url: formData.live_url || null,
                category: formData.category,
                post_content: formData.post_content,
                youtube_video_url: formData.youtube_video_url || null,
                tech_stack: formData.tech_stack,
                is_open_source: formData.is_open_source,
            }

            const response = await axios.post("/api/projects", data, {
                headers: {
                    "Content-Type": "application/json",
                },
            })

            // Show success dialog instead of redirecting immediately
            toast({
                title: "Success!",
                description: "Your project has been submitted successfully.",
                variant: "default",
            })

            // Open success dialog
            setShowSuccessDialog(true)
        } catch (err) {
            console.error("Error:", err)
            setError("Failed to upload images. Please try again.")
            toast({
                // @ts-ignore
                title: "Error",
                description: "Failed to upload images. Please try again.",
                variant: "destructive",
            })
        } finally {
            setSubmitting(false)
            setIsLoading(false)
        }
    }

    // Add logo file handler
    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0]
            setLogoFile(file)
            setLogoPreviewUrl(URL.createObjectURL(file))
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Loading...</p>
                </div>
            </div>
        )
    }

    return (
        <main className="bg-gradient-to-br from-gray-900 to-gray-800 min-h-screen">
            <div className="max-w-3xl mx-auto">
                <div className="mb-8 pt-8">
                    <h1 className="text-4xl font-bold mb-4 text-white">Submit a New Project</h1>
                    <p className="text-gray-300">Share your project with the Ethiopian developer community.</p>
                </div>

                <div className="mb-8">
                    <Progress value={progress} className="h-2 bg-gray-700" />

                    <div className="flex justify-between mt-2">
                        {steps.map((step, index) => (
                            <div
                                key={step.id}
                                className={cn(
                                    "text-sm flex flex-col items-center",
                                    index <= currentStep ? "text-primary" : "text-muted-foreground",
                                )}
                            >
                                <div
                                    className={cn(
                                        "w-8 h-8 rounded-full flex items-center justify-center mb-1",
                                        index < currentStep
                                            ? "bg-primary text-primary-foreground"
                                            : index === currentStep
                                                ? "border-2 border-primary"
                                                : "border-2 border-muted",
                                    )}
                                >
                                    {index < currentStep ? <Check className="h-4 w-4" /> : <span>{index + 1}</span>}
                                </div>
                                <span className="hidden sm:block">{step.label}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <Card className="bg-gray-800 border-gray-700">
                    <CardHeader>
                        <CardTitle className="text-white">{steps[currentStep].label}</CardTitle>
                        <CardDescription className="text-gray-300">
                            {currentStep === 0 && "Enter the basic information about your project"}
                            {currentStep === 1 && "Upload images and logo for your project"}
                            {currentStep === 2 && "Add links to your project repository and live demo"}
                            {currentStep === 3 && "Review your project information before submission"}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="text-gray-100">
                        <div className="space-y-6">
                            {/* Step 1: Basic Information */}
                            {currentStep === 0 && (
                                <>
                                    <div className="space-y-2">
                                        <Label htmlFor="title" className={validationErrors.title ? "text-destructive" : ""}>
                                            Project Title <span className="text-destructive">*</span>
                                        </Label>
                                        <Input
                                            id="title"
                                            name="title"
                                            value={formData.title}
                                            onChange={handleInputChange}
                                            placeholder="Enter your project title"
                                            className={validationErrors.title ? "border-destructive" : ""}
                                        />
                                        {validationErrors.title && <p className="text-sm text-destructive">{validationErrors.title}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="category" className={validationErrors.category ? "text-destructive" : ""}>
                                            Project Category <span className="text-destructive">*</span>
                                        </Label>
                                        <select
                                            id="category"
                                            name="category"
                                            value={formData.category}
                                            // @ts-ignore

                                            onChange={handleInputChange}
                                            className={cn(
                                                "w-full px-3 py-2 border rounded-md",
                                                validationErrors.category ? "border-destructive" : "",
                                            )}
                                        >
                                            <option value="">Select a category</option>
                                            <option value="Web App">Web App</option>
                                            <option value="Mobile App">Mobile App</option>
                                            <option value="Desktop App">Desktop App</option>
                                            <option value="AI/ML">AI/ML</option>
                                            // @ts-ignore
                                            <option value="Game">Game</option>
                                            <option value="IoT">IoT</option>
                                            <option value="Blockchain">Blockchain</option>
                                            <option value="Other">Other</option>
                                        </select>
                                        {validationErrors.category && (
                                            <p className="text-sm text-destructive">{validationErrors.category}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="description" className={validationErrors.description ? "text-destructive" : ""}>
                                            Project Description <span className="text-destructive">*</span>
                                        </Label>
                                        <Textarea
                                            id="description"
                                            name="description"
                                            value={formData.description}
                                            onChange={handleInputChange}
                                            rows={6}
                                            placeholder="Describe your project, its features, and the problem it solves..."
                                            className={validationErrors.description ? "border-destructive" : ""}
                                        />
                                        {validationErrors.description && (
                                            <p className="text-sm text-destructive">{validationErrors.description}</p>
                                        )}
                                        <p className="text-xs text-muted-foreground">
                                            Minimum 50 characters. Be descriptive about what your project does and the technologies used.
                                        </p>
                                    </div>
                                </>
                            )}

                            {/* Step 2: Media */}
                            {currentStep === 1 && (
                                <>
                                    <div className="space-y-2">
                                        <Label htmlFor="logo">Project Logo</Label>
                                        <div className="border-2 border-dashed rounded-lg p-6 text-center hover:bg-muted/50 transition-colors cursor-pointer">
                                            <Input
                                                type="file"
                                                id="logo"
                                                accept="image/png, image/jpeg, image/svg+xml"
                                                onChange={handleLogoChange}
                                                className="hidden"
                                            />
                                            <Label htmlFor="logo" className="cursor-pointer flex flex-col items-center">
                                                <Upload className="h-10 w-10 text-muted-foreground mb-2" />
                                                <span className="font-medium">Click to upload logo</span>
                                                <span className="text-xs text-muted-foreground mt-1">PNG, JPG or SVG (max. 1MB)</span>
                                            </Label>
                                        </div>
                                        {logoPreviewUrl && (
                                            <div className="mt-4">
                                                <p className="text-sm font-medium mb-2">Logo Preview:</p>
                                                <div className="w-32 h-32 rounded-md overflow-hidden border">
                                                    <img
                                                        src={logoPreviewUrl}
                                                        alt="Logo Preview"
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                            </div>
                                        )}
                                        <p className="text-xs text-muted-foreground">
                                            Optional: Add a YouTube video showcasing your project
                                        </p>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="post_content" className={validationErrors.post_content ? "text-destructive" : ""}>
                                            Project Content <span className="text-destructive">*</span>
                                        </Label>
                                        <Textarea
                                            id="post_content"
                                            name="post_content"
                                            value={formData.post_content}
                                            onChange={handleInputChange}
                                            rows={8}
                                            placeholder="Provide detailed information about your project, including features, implementation details, challenges faced, and lessons learned..."
                                            className={validationErrors.post_content ? "border-destructive" : ""}
                                        />
                                        {validationErrors.post_content && (
                                            <p className="text-sm text-destructive">{validationErrors.post_content}</p>
                                        )}
                                        <p className="text-xs text-muted-foreground">
                                            Minimum 100 characters. This is the main content of your project post.
                                        </p>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="images">Project Screenshots</Label>
                                        <div className="border-2 border-dashed rounded-lg p-6 text-center hover:bg-muted/50 transition-colors cursor-pointer">
                                            <Input
                                                type="file"
                                                id="images"
                                                multiple
                                                accept="image/*"
                                                onChange={handleImageChange}
                                                className="hidden"
                                            />
                                            <Label htmlFor="images" className="cursor-pointer flex flex-col items-center">
                                                <Upload className="h-10 w-10 text-muted-foreground mb-2" />
                                                <span className="font-medium">Click to upload screenshots</span>
                                                <span className="text-xs text-muted-foreground mt-1">PNG, JPG or GIF (max. 5 images)</span>
                                            </Label>
                                        </div>

                                        {imagePreviewUrls.length > 0 && (
                                            <div className="mt-4">
                                                <p className="text-sm font-medium mb-2">Selected Images:</p>
                                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                                    {imagePreviewUrls.map((url, index) => (
                                                        <div key={index} className="relative aspect-video rounded-md overflow-hidden border">
                                                            <img
                                                                src={url || "/placeholder.svg"}
                                                                alt={`Preview ${index + 1}`}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </>
                            )}

                            {/* Step 3: Links */}
                            {currentStep === 2 && (
                                <>
                                    <div className="space-y-2">
                                        <Label htmlFor="github_url" className={validationErrors.github_url ? "text-destructive" : ""}>
                                            GitHub Repository URL
                                        </Label>
                                        <div className="flex">
                                            <div className="bg-muted flex items-center px-3 rounded-l-md border border-r-0">
                                                <Github className="h-4 w-4 text-muted-foreground" />
                                            </div>
                                            <Input
                                                id="github_url"
                                                name="github_url"
                                                value={formData.github_url}
                                                onChange={handleInputChange}
                                                placeholder="https://github.com/username/project"
                                                className={cn("rounded-l-none", validationErrors.github_url ? "border-destructive" : "")}
                                            />
                                        </div>
                                        {validationErrors.github_url && (
                                            <p className="text-sm text-destructive">{validationErrors.github_url}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="live_url" className={validationErrors.live_url ? "text-destructive" : ""}>
                                            Live Demo URL
                                        </Label>
                                        <div className="flex">
                                            <div className="bg-muted flex items-center px-3 rounded-l-md border border-r-0">
                                                <Globe className="h-4 w-4 text-muted-foreground" />
                                            </div>
                                            <Input
                                                id="live_url"
                                                name="live_url"
                                                value={formData.live_url}
                                                onChange={handleInputChange}
                                                placeholder="https://your-project.com"
                                                className={cn("rounded-l-none", validationErrors.live_url ? "border-destructive" : "")}
                                            />
                                        </div>
                                        {validationErrors.live_url && (
                                            <p className="text-sm text-destructive">{validationErrors.live_url}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label
                                            htmlFor="youtube_video_url"
                                            className={validationErrors.youtube_video_url ? "text-destructive" : ""}
                                        >
                                            YouTube Video URL
                                        </Label>
                                        <Input
                                            id="youtube_video_url"
                                            name="youtube_video_url"
                                            value={formData.youtube_video_url}
                                            onChange={handleInputChange}
                                            placeholder="https://www.youtube.com/watch?v=..."
                                            className={validationErrors.youtube_video_url ? "border-destructive" : ""}
                                        />
                                        {validationErrors.youtube_video_url && (
                                            <p className="text-sm text-destructive">{validationErrors.youtube_video_url}</p>
                                        )}
                                        <p className="text-xs text-muted-foreground">
                                            Optional: Add a YouTube video showcasing your project
                                        </p>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="tech_stack" className={validationErrors.tech_stack ? "text-destructive" : ""}>
                                            Technologies Used <span className="text-destructive">*</span>
                                        </Label>
                                        <div className="flex">
                                            <Input
                                                id="tech_input"
                                                value={techInput}
                                                onChange={(e) => setTechInput(e.target.value)}
                                                onKeyDown={handleTechInputKeyDown}
                                                placeholder="Type a technology and press Enter"
                                                className={validationErrors.tech_stack ? "border-destructive" : ""}
                                            />
                                        </div>
                                        {validationErrors.tech_stack && (
                                            <p className="text-sm text-destructive">{validationErrors.tech_stack}</p>
                                        )}
                                        <p className="text-xs text-muted-foreground">
                                            Add technologies one by one (e.g., React, Node.js, PostgreSQL)
                                        </p>

                                        {formData.tech_stack.length > 0 && (
                                            <div className="flex flex-wrap gap-2 mt-2">
                                                {formData.tech_stack.map((tech, index) => (
                                                    <div
                                                        key={index}
                                                        className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm flex items-center"
                                                    >
                                                        {tech}
                                                        <button
                                                            type="button"
                                                            onClick={() => removeTechItem(index)}
                                                            className="ml-2 text-primary hover:text-primary/80"
                                                        >
                                                            ×
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex items-center space-x-2 mt-4">
                                        <input
                                            type="checkbox"
                                            id="is_open_source"
                                            name="is_open_source"
                                            checked={formData.is_open_source}
                                            onChange={handleCheckboxChange}
                                            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                        />
                                        <Label htmlFor="is_open_source" className="text-sm font-medium">
                                            This is an open-source project
                                        </Label>
                                    </div>
                                </>
                            )}

                            {/* Step 4: Review */}
                            {currentStep === 3 && (
                                <div className="space-y-6">
                                    <div>
                                        <h3 className="text-lg font-medium mb-2">Project Information</h3>
                                        <div className="bg-muted p-4 rounded-md">
                                            <div className="mb-3">
                                                <span className="font-medium">Title:</span> {formData.title}
                                            </div>
                                            <div className="mb-3">
                                                <span className="font-medium">Category:</span> {formData.category}
                                            </div>
                                            <div>
                                                <span className="font-medium">Description:</span>
                                                <p className="mt-1 text-sm">{formData.description}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-lg font-medium mb-2">Project Content</h3>
                                        <div className="bg-muted p-4 rounded-md">
                                            <p className="text-sm">{formData.post_content.substring(0, 200)}...</p>
                                            {formData.post_content.length > 200 && (
                                                <p className="text-xs text-muted-foreground mt-1">(Content truncated for preview)</p>
                                            )}
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-lg font-medium mb-2">Media</h3>
                                        <div className="bg-muted p-4 rounded-md">
                                            {formData.logo_url && (
                                                <div className="mb-3">
                                                    <span className="font-medium">Logo URL:</span> {formData.logo_url}
                                                </div>
                                            )}
                                            <div>
                                                <span className="font-medium">Screenshots:</span> {imageFiles.length} image(s) selected
                                                {imagePreviewUrls.length > 0 && (
                                                    <div className="grid grid-cols-3 gap-2 mt-2">
                                                        {imagePreviewUrls.slice(0, 3).map((url, index) => (
                                                            <div key={index} className="aspect-video rounded-md overflow-hidden">
                                                                <img
                                                                    src={url || "/placeholder.svg"}
                                                                    alt={`Preview ${index + 1}`}
                                                                    className="w-full h-full object-cover"
                                                                />
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-lg font-medium mb-2">Technical Details</h3>
                                        <div className="bg-muted p-4 rounded-md">
                                            <div className="mb-3">
                                                <span className="font-medium">Technologies:</span>
                                                <div className="flex flex-wrap gap-2 mt-1">
                                                    {formData.tech_stack.map((tech, index) => (
                                                        <span key={index} className="bg-primary/10 text-primary px-2 py-1 rounded-full text-xs">
                                                            {tech}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                            <div>
                                                <span className="font-medium">Open Source:</span> {formData.is_open_source ? "Yes" : "No"}
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-lg font-medium mb-2">Links</h3>
                                        <div className="bg-muted p-4 rounded-md">
                                            {formData.github_url && (
                                                <div className="mb-3">
                                                    <span className="font-medium">GitHub:</span> {formData.github_url}
                                                </div>
                                            )}
                                            {formData.live_url && (
                                                <div className="mb-3">
                                                    <span className="font-medium">Live Demo:</span> {formData.live_url}
                                                </div>
                                            )}
                                            {formData.youtube_video_url && (
                                                <div>
                                                    <span className="font-medium">YouTube Video:</span> {formData.youtube_video_url}
                                                </div>
                                            )}
                                            {!formData.github_url && !formData.live_url && !formData.youtube_video_url && (
                                                <div className="text-muted-foreground">No links provided</div>
                                            )}
                                        </div>
                                    </div>

                                    {error && (
                                        <div className="bg-destructive/10 p-4 rounded-md flex items-start gap-3">
                                            <AlertCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                                            <p className="text-sm text-destructive">{error}</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </CardContent>

                    <div className="p-6 pt-0 flex justify-between border-t border-gray-700">
                        <Button
                            variant="outline"
                            onClick={currentStep === 0 ? () => router.push("/profile") : prevStep}
                            disabled={submitting}
                        >
                            {currentStep === 0 ? (
                                "Cancel"
                            ) : (
                                <>
                                    <ChevronLeft className="h-4 w-4 mr-2" />
                                    Back
                                </>
                            )}
                        </Button>

                        {currentStep < steps.length - 1 ? (
                            <Button onClick={nextStep}>
                                Next
                                <ChevronRight className="h-4 w-4 ml-2" />
                            </Button>
                        ) : (
                            <Button onClick={handleSubmit} disabled={submitting} className="min-w-[100px]">
                                {submitting ? (
                                    <div className="flex items-center gap-2">
                                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                                        <span>Submitting...</span>
                                    </div>
                                ) : (
                                    "Submit Project"
                                )}
                            </Button>
                        )}
                    </div>
                </Card>
            </div>

            {showSuccessDialog && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <Card className="w-full max-w-md bg-gray-800 border-gray-700">
                        <CardHeader>
                            <CardTitle className="text-center text-white">🎉 Submission Successful!</CardTitle>
                            <CardDescription className="text-center text-gray-300">
                                Your project has been successfully submitted! We will review it and notify you once it's ready to be featured.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-4">
                            <Button
                                onClick={() => router.push("/")}
                                variant="outline"
                            >
                                View My Submissions
                            </Button>
                            {/* <Button
                                onClick={() => {
                                    setShowSuccessDialog(false)
                                    setCurrentStep(0)
                                    setFormData({
                                        title: "",
                                        description: "",
                                        logo_url: "",
                                        github_url: "",
                                        live_url: "",
                                        category: "",
                                        post_content: "",
                                        youtube_video_url: "",
                                        tech_stack: [],
                                        is_open_source: true,
                                    })
                                    setImageFiles([])
                                    setImagePreviewUrls([])
                                }}
                            >
                                Submit Another Project
                            </Button> */}
                        </CardContent>
                    </Card>
                </div>
            )}
        </main>
    )
}

