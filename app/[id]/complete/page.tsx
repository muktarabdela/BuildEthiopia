'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { AlertCircle, ArrowLeft, Check, ChevronLeft, ChevronRight, Github, Globe, Loader2, Star, Upload } from 'lucide-react';
import { useAuth } from '@/components/AuthProvider';
import { useLoading } from '@/components/LoadingProvider';
import { z } from 'zod';

// Import Step Components
import { Progress } from "@/components/ui/progress"
import { supabase } from '@/lib/supabase';
import axios from 'axios';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { Label } from '@radix-ui/react-label';

const TOTAL_STEPS = 5;

// Define the structure for all profile data
interface ProfileFormData {
    // From profiles table
    bio: string;
    title: string;
    location: string;
    github_url: string;
    linkedin_url: string;
    website_url: string;
    telegram_url: string;
    skill: string[];

    // From user_about table
    about_me: string;
    experience_summary: string;
    Experience_level: string;
    education_summary: string;
    interests: string[];
}

// Define a schema for the links
const linksSchema = z.object({
    github_url: z.string()
        .url("Please enter a valid GitHub URL")
        .refine(url => url.includes('github.com'), { message: "Must be a GitHub URL" }),
    linkedin_url: z.string()
        .url("Please enter a valid LinkedIn URL")
        .refine(url => url.includes('linkedin.com'), { message: "Must be a LinkedIn URL" }),
    website_url: z.string()
        .url("Please enter a valid website URL")
        .refine(url => {
            try {
                const parsed = new URL(url);
                return parsed.protocol === 'http:' || parsed.protocol === 'https:';
            } catch {
                return false;
            }
        }, { message: "Must be a valid website URL" }),
    telegram_url: z.string()
        .regex(/^@[a-zA-Z0-9_]{5,32}$/, { message: "Must be a valid Telegram username (e.g., @username)" }),
});

export default function CompleteProfilePage() {
    const { user, session } = useAuth()
    const [submitting, setSubmitting] = useState(false)

    // console.log("user from complete page", user)
    const router = useRouter();

    const [progress, setProgress] = useState(0)
    const { setIsLoading } = useLoading();
    const [currentStep, setCurrentStep] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
    const [profileData, setProfileData] = useState<ProfileFormData>({
        bio: '',
        title: '',
        location: '',
        github_url: '',
        linkedin_url: '',
        website_url: '',
        telegram_url: '',
        skill: [],
        about_me: '',
        experience_summary: '',
        Experience_level: '',
        education_summary: '',
        interests: [],
    });
    const [logoFile, setLogoFile] = useState<File | null>(null)
    const [skillInput, setSkillInput] = useState("")
    const [expertiseInput, setExpertiseInput] = useState("")
    const [interestsInput, setInterestsInput] = useState("")
    const [error, setError] = useState("")
    const [showSuccessDialog, setShowSuccessDialog] = useState(false)
    const steps = [
        { id: "basic-info", label: "Basic Information" },
        { id: "skills-expertise", label: "Skills & Expertise" },
        { id: "social-links", label: "Social & Contact Links" },
        { id: "professional-summary", label: "Professional Summary" },
        { id: "review", label: "Review" },
    ]

    const username = user?.user_metadata?.username
    useEffect(() => {
        async function fetchUserData() {
            if (!user) return
            if (!username) return
            try {
                const response = await axios.get(`/api/profile/${username}`);
                const profileData = response.data.profile;
                const aboutData = response.data.about;
                const data = { ...profileData, ...aboutData };
                if (data) {
                    setProfileData(prev => ({
                        ...prev,
                        bio: data.bio || '',
                        title: data.title || '',
                        location: data.location || '',
                        github_url: data.github_url || '',
                        linkedin_url: data.linkedin_url || '',
                        website_url: data.website_url || '',
                        telegram_url: data.telegram_url || '',
                        skill: data.skill || [],
                        about_me: data.about_me || '',
                        experience_summary: data.experience_summary || '',
                        Experience_level: data.Experience_level || '',
                        education_summary: data.education_summary || '',
                        interests: data.interests || [],
                        profilePictureUrl: data.avatar_url || null
                    }))
                }
            }
            catch (error) {
                console.error('Error fetching profile data:', error);
                return;
            }
        }

        fetchUserData()
    }, [username, supabase])

    useEffect(() => {
        // Update progress based on current step
        setProgress(((currentStep + 1) / steps.length) * 100)
    }, [currentStep, steps.length])


    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setProfileData((prev) => ({ ...prev, [name]: value }))

        // Clear validation error when user types
        if (validationErrors[name]) {
            setValidationErrors((prev) => {
                const newErrors = { ...prev }
                delete newErrors[name]
                return newErrors
            })
        }
    }

    const validateStep = () => {
        const errors: Record<string, string> = {};

        if (currentStep === 0) {
            // Step 0: Basic Information
            if (!profileData.bio.trim()) errors.bio = "Bio is required";
            if (!profileData.title.trim()) errors.title = "title is required";
            if (!profileData.location.trim()) errors.location = "Location is required";
        }

        if (currentStep === 1) {
            // Step 1: Skills & Expertise
            if (!profileData.skill.length) errors.skill = "At least one skill is required";
            if (!profileData.Experience_level.trim()) errors.Experience_level = "Experience Level is required";
        }

        if (currentStep === 2) {
            // Step 2: Social & Contact Links
            try {
                linksSchema.parse({
                    github_url: profileData.github_url,
                    linkedin_url: profileData.linkedin_url,
                    website_url: profileData.website_url,
                    telegram_url: profileData.telegram_url,
                });
            } catch (error) {
                if (error instanceof z.ZodError) {
                    error.errors.forEach((err) => {
                        errors[err.path[0]] = err.message;
                    });
                }
            }
        }

        if (currentStep === 3) {
            // Step 3: Professional Summary
            if (!profileData.about_me.trim()) errors.about_me = "About me is required";
            if (!profileData.experience_summary.trim()) errors.experience_summary = "Experience summary is required";
            if (!profileData.education_summary.trim()) errors.education_summary = "Education summary is required";
            if (!profileData.interests.length) errors.interests = "At least one interest is required";
        }

        if (currentStep === 4) {
            // Step 4: Review (No validation needed, just a review step)
            // No validation for this step since it's just a review
        }

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };
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
    // Add a function to handle skill input
    const handleTechInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && skillInput.trim()) {
            console.log("skillInput", skillInput.trim())
            e.preventDefault()
            if (!profileData.skill.includes(skillInput.trim())) {
                setProfileData((prev) => ({
                    ...prev,
                    skill: [...prev.skill, skillInput.trim()],
                }))
            }
            setSkillInput("")
        }
    }
    const removeSkillItem = (index: number) => {
        setProfileData((prev) => ({
            ...prev,
            skill: prev.skill.filter((_, i) => i !== index),
        }))
    }
    // Add a function to handle expertise input
    const handleExpertiseInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && expertiseInput.trim()) {
            e.preventDefault()
            if (!profileData.expertise.includes(expertiseInput.trim())) {
                setProfileData((prev) => ({
                    ...prev,
                    expertise: [...prev.expertise, expertiseInput.trim()],
                }))
            }
            setExpertiseInput("")
        }
    }
    const removeExpertiseItem = (index: number) => {
        setProfileData((prev) => ({
            ...prev,
            expertise: prev.expertise.filter((_, i) => i !== index),
        }))
    }
    // function for interests input
    const handleInterestsInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && interestsInput.trim()) {
            e.preventDefault()
            if (!profileData.interests.includes(interestsInput.trim())) {
                setProfileData((prev) => ({
                    ...prev,
                    interests: [...prev.interests, interestsInput.trim()],
                }))
            }
            setInterestsInput("")
        }
    }
    const removeInterestsItem = (index: number) => {
        setProfileData((prev) => ({
            ...prev,
            interests: prev.interests.filter((_, i) => i !== index),
        }))
    }
    // Add a function to handle checkbox changes

    const handleSubmit = async () => {
        if (!validateStep()) return

        setError("")

        try {
            setSubmitting(true)
            // setIsLoading(true)
            const data = {
                bio: profileData.bio,
                location: profileData.location,
                title: profileData.title,
                github_url: profileData.github_url || null,
                linkedin_url: profileData.linkedin_url || null,
                website_url: profileData.website_url || null,
                telegram_url: profileData.telegram_url || null,
                skill: profileData.skill,
                about_me: profileData.about_me,
                experience_summary: profileData.experience_summary,
                Experience_level: profileData.Experience_level,
                education_summary: profileData.education_summary,
                interests: profileData.interests,
            }

            const response = await axios.post(`/api/profile/${username}`, data, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${session?.access_token}` // Use the session token for authentication
                },
            })
            console.log("response from complete page", response)
            // Show success dialog instead of redirecting immediately
            toast("Your profile has been updated successfully!")

            // Open success dialog
            setShowSuccessDialog(true)
        } catch (err) {
            console.error("Error:", err)
            setError("failed to save profile data. Please try again.")
            toast("Failed to save profile data. Please try again.")
        } finally {
            setSubmitting(false)
            // setIsLoading(false)
        }
    }
    console.log(profileData)
    return (
        <main className="bg-gradient-to-br from-gray-900 to-gray-800 min-h-screen">
            <div className="max-w-3xl mx-auto">
                <div className="mb-8 pt-8">
                    <h1 className="text-4xl font-bold mb-4 text-white">Complete Your Profile</h1>
                    <p className="text-gray-50">Finish setting up your profile to get the most out of the platform.</p>
                </div>

                <div className="mb-8">
                    <Progress value={progress} className="h-2 bg-gray-700" />

                    <div className="flex justify-between mt-2">
                        {steps?.map((step, index) => (
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
                                    {index < currentStep ? <Check className="h-4 w-4 " /> : <span className="text-gray-100">{index + 1}</span>}
                                </div>
                                <span className="hidden sm:block text-gray-100">{step.label}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <Card className="bg-gray-800 border-gray-700">
                    <CardHeader>
                        <CardTitle className="text-white">{steps[currentStep].label}</CardTitle>
                        <CardDescription className="text-gray-200">
                            {currentStep === 0 && "Enter your basic personal information"}
                            {currentStep === 1 && "Add your skills and areas of expertise"}
                            {currentStep === 2 && "Add your social media and contact links"}
                            {currentStep === 3 && "Provide your professional background and experience"}
                            {currentStep === 4 && "Review your profile information before submission"}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="text-gray-100">
                        <div className="space-y-6">
                            {/* Step 1: Basic Information */}
                            {currentStep === 0 && (
                                <>
                                    <div className="space-y-2">
                                        <Label htmlFor="title" className={validationErrors.title ? "text-destructive" : ""}>
                                            Title/Role <span className="text-destructive">*</span>
                                        </Label>
                                        <Input
                                            id="title"
                                            name="title"
                                            value={profileData.title}
                                            onChange={handleInputChange}
                                            placeholder="Enter your title or role"
                                            className={validationErrors.title ? "border-destructive" : "placeholder:text-gray-300"}
                                        />
                                        {validationErrors.title && (
                                            <p className="text-sm text-destructive">{validationErrors.title}</p>
                                        )}
                                        <p className="text-xs text-muted-foreground">
                                            Your current title or role (e.g., Frontend Web | Android App Developer)
                                        </p>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="bio" className={validationErrors.bio ? "text-destructive" : ""}>
                                            Bio <span className="text-destructive">*</span>
                                        </Label>
                                        <Textarea
                                            id="bio"
                                            name="bio"
                                            value={profileData.bio}
                                            onChange={handleInputChange}
                                            placeholder="Tell us about yourself"
                                            className={validationErrors.bio ? "border-destructive" : "placeholder:text-gray-300"}
                                            rows={4}
                                        />
                                        {validationErrors.bio && <p className="text-sm text-destructive">{validationErrors.bio}</p>}
                                        <p className="text-xs text-muted-foreground">
                                            Write a short bio that describes who you are and what you do
                                        </p>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="location" className={validationErrors.location ? "text-destructive" : ""}>
                                            Location <span className="text-destructive">*</span>
                                        </Label>
                                        <Input
                                            id="location"
                                            name="location"
                                            value={profileData.location}
                                            onChange={handleInputChange}
                                            placeholder="Enter your location"
                                            className={validationErrors.location ? "border-destructive" : "placeholder:text-gray-300"}
                                        />
                                        {validationErrors.location && (
                                            <p className="text-sm text-destructive">{validationErrors.location}</p>
                                        )}
                                        <p className="text-xs text-muted-foreground">
                                            City and country (e.g., "Addis Ababa, Ethiopia")
                                        </p>
                                    </div>
                                </>
                            )}

                            {/* Step 2: skill n */}
                            {currentStep === 1 && (
                                <>
                                    <div className="space-y-2">
                                        <Label htmlFor="skill" className={validationErrors.skill ? "text-destructive" : ""}>
                                            Skills <span className="text-destructive">*</span>
                                        </Label>

                                        <Input
                                            id="skill"
                                            value={skillInput}
                                            onChange={(e) => setSkillInput(e.target.value)}
                                            onKeyDown={handleTechInputKeyDown}
                                            placeholder="Add a skill and press Enter"
                                            className={validationErrors.skill ? "border-destructive" : ""}
                                        />
                                        {validationErrors.skill && (
                                            <p className="text-sm text-destructive">{validationErrors.skill}</p>
                                        )}
                                        <p className="text-xs text-muted-foreground">
                                            List your technical skills (e.g., React, Node.js, Python)
                                        </p>

                                        {profileData.skill.length > 0 && (
                                            <div className="flex flex-wrap gap-2 mt-2">
                                                {profileData.skill?.map((tech, index) => (
                                                    <div
                                                        key={index}
                                                        className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm flex items-center"
                                                    >
                                                        {tech}
                                                        <button
                                                            type="button"
                                                            onClick={() => removeSkillItem(index)}
                                                            className="ml-2 text-primary hover:text-primary/80"
                                                        >
                                                            ×
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                    {/* Experience_level */}

                                    <div className="space-y-2">
                                        <Label htmlFor="Experience_level" className={validationErrors.Experience_level ? "text-destructive" : ""}>
                                            Experience Level <span className="text-destructive">*</span>
                                        </Label>
                                        <Input
                                            id="Experience_level"
                                            name="Experience_level"
                                            value={profileData.Experience_level}
                                            onChange={handleInputChange}
                                            placeholder="Enter your experience level"
                                            className={validationErrors.Experience_level ? "border-destructive" : "placeholder:text-gray-300"}
                                        />
                                        {validationErrors.Experience_level && (
                                            <p className="text-sm text-destructive">{validationErrors.Experience_level}</p>
                                        )}
                                        <p className="text-xs text-muted-foreground">
                                            Your current Experience level (e.g. Junior | Mid-Level | Senior)
                                        </p>
                                    </div>

                                </>
                            )}

                            {/* Step 3: Links */}
                            {currentStep === 2 && (
                                <>
                                    <div className="space-y-2">
                                        <Label htmlFor="github_url" className={validationErrors.github_url ? "text-destructive" : ""}>
                                            GitHub URL
                                        </Label>
                                        <div className="flex">
                                            <div className="bg-muted flex items-center px-3 rounded-l-md border border-r-0">
                                                <Github className="h-4 w-4 text-muted-foreground" />
                                            </div>
                                            <Input
                                                id="github_url"
                                                name="github_url"
                                                value={profileData.github_url}
                                                onChange={handleInputChange}

                                                placeholder="https://github.com/username"
                                                className={cn("rounded-l-none", validationErrors.github_url ? "border-destructive" : "")}
                                            />
                                        </div>
                                        {validationErrors.github_url && (
                                            <p className="text-sm text-destructive">{validationErrors.github_url}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="linkedin_url" className={validationErrors.linkedin_url ? "text-destructive" : ""}>
                                            LinkedIn URL
                                        </Label>
                                        <div className="flex">
                                            <div className="bg-muted flex items-center px-3 rounded-l-md border border-r-0">
                                                <Globe className="h-4 w-4 text-muted-foreground" />
                                            </div>
                                            <Input
                                                id="linkedin_url"
                                                name="linkedin_url"
                                                value={profileData.linkedin_url}
                                                onChange={handleInputChange}

                                                placeholder="https://linkedin.com/in/username"
                                                className={cn("rounded-l-none", validationErrors.linkedin_url ? "border-destructive" : "")}
                                            />
                                        </div>
                                        {validationErrors.linkedin_url && (
                                            <p className="text-sm text-destructive">{validationErrors.linkedin_url}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="website_url" className={validationErrors.website_url ? "text-destructive" : ""}>
                                            Personal Website URL
                                        </Label>
                                        <div className="flex">
                                            <div className="bg-muted flex items-center px-3 rounded-l-md border border-r-0">
                                                <Globe className="h-4 w-4 text-muted-foreground" />
                                            </div>
                                            <Input
                                                id="website_url"
                                                name="website_url"
                                                value={profileData.website_url}
                                                onChange={handleInputChange}

                                                placeholder="https://yourwebsite.com"
                                                className={cn("rounded-l-none", validationErrors.website_url ? "border-destructive" : "")}
                                            />
                                        </div>
                                        {validationErrors.website_url && (
                                            <p className="text-sm text-destructive">{validationErrors.website_url}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="telegram_url" className={validationErrors.telegram_url ? "text-destructive" : ""}>
                                            Telegram URL
                                        </Label>
                                        <div className="flex">
                                            <div className="bg-muted flex items-center px-3 rounded-l-md border border-r-0">
                                                <Globe className="h-4 w-4 text-muted-foreground" />
                                            </div>
                                            <Input
                                                id="telegram_url"
                                                name="telegram_url"
                                                value={profileData.telegram_url}
                                                onChange={handleInputChange}

                                                placeholder="@username"
                                                className={cn("rounded-l-none", validationErrors.telegram_url ? "border-destructive" : "")}
                                            />
                                        </div>
                                        {validationErrors.telegram_url && (
                                            <p className="text-sm text-destructive">{validationErrors.telegram_url}</p>
                                        )}
                                    </div>
                                </>
                            )}
                            {/* Professional Summary */}
                            {currentStep === 3 && (
                                <>
                                    <div className="space-y-2">
                                        <Label htmlFor="about_me" className={validationErrors.about_me ? "text-destructive" : ""}>
                                            About Me <span className="text-destructive">*</span>
                                        </Label>
                                        <Textarea
                                            id="about_me"
                                            name="about_me"
                                            value={profileData.about_me}
                                            onChange={handleInputChange}

                                            placeholder="Write a detailed self-introduction"
                                            className={validationErrors.about_me ? "border-destructive" : ""}
                                            rows={5}
                                        />
                                        {validationErrors.about_me && (
                                            <p className="text-sm text-destructive">{validationErrors.about_me}</p>
                                        )}
                                        <p className="text-xs text-muted-foreground">
                                            Share your background, passions, and what drives you professionally.
                                        </p>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="experience_summary" className={validationErrors.experience_summary ? "text-destructive" : ""}>
                                            Experience Summary <span className="text-destructive">*</span>
                                        </Label>
                                        <Textarea
                                            id="experience_summary"
                                            name="experience_summary"
                                            value={profileData.experience_summary}
                                            onChange={handleInputChange}

                                            placeholder="Summarize your work experience"
                                            className={validationErrors.experience_summary ? "border-destructive" : ""}
                                            rows={5}
                                        />
                                        {validationErrors.experience_summary && (
                                            <p className="text-sm text-destructive">{validationErrors.experience_summary}</p>
                                        )}
                                        <p className="text-xs text-muted-foreground">
                                            Highlight key roles, achievements, and career progression.
                                        </p>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="education_summary" className={validationErrors.education_summary ? "text-destructive" : ""}>
                                            Education Summary <span className="text-destructive">*</span>
                                        </Label>
                                        <Textarea
                                            id="education_summary"
                                            name="education_summary"
                                            value={profileData.education_summary}
                                            onChange={handleInputChange}

                                            placeholder="Describe your educational background"
                                            className={validationErrors.education_summary ? "border-destructive" : ""}
                                            rows={3}
                                        />
                                        {validationErrors.education_summary && (
                                            <p className="text-sm text-destructive">{validationErrors.education_summary}</p>
                                        )}
                                        <p className="text-xs text-muted-foreground">
                                            Include degrees, certifications, and relevant coursework.
                                        </p>
                                    </div>


                                    <div className="space-y-2">
                                        <Label htmlFor="interests" className={validationErrors.interests ? "text-destructive" : ""}>
                                            Professional Interests <span className="text-destructive">*</span>
                                        </Label>

                                        <Input
                                            id="interests"
                                            value={interestsInput}
                                            onChange={(e) => setInterestsInput(e.target.value)}
                                            onKeyDown={handleInterestsInputKeyDown}
                                            placeholder="Add a interests and press Enter"
                                            className={validationErrors.interests ? "border-destructive" : ""}
                                        />
                                        {validationErrors.interests && (
                                            <p className="text-sm text-destructive">{validationErrors.interests}</p>
                                        )}
                                        <p className="text-xs text-muted-foreground">
                                            List areas you're passionate about or want to explore (e.g., AI, Web3, UX Design)
                                        </p>

                                        {profileData.interests.length > 0 && (
                                            <div className="flex flex-wrap gap-2 mt-2">
                                                {profileData.interests?.map((tech, index) => (
                                                    <div
                                                        key={index}
                                                        className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm flex items-center"
                                                    >
                                                        {tech}
                                                        <button
                                                            type="button"
                                                            onClick={() => removeInterestsItem(index)}
                                                            className="ml-2 text-primary hover:text-primary/80"
                                                        >
                                                            ×
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </>
                            )}
                            {/* Step 4: Review */}
                            {currentStep === 4 && (
                                <div className="space-y-6">
                                    <div>
                                        <h3 className="text-lg font-medium mb-4">Profile Information</h3>
                                        <div className="bg-muted p-6 rounded-md space-y-4">
                                            <div className="grid grid-cols-[150px_1fr] gap-4">
                                                <span className="font-medium text-gray-500">Bio</span>
                                                <span className="text-gray-100">{profileData.bio}</span>
                                            </div>
                                            <div className="grid grid-cols-[150px_1fr] gap-4">
                                                <span className="font-medium text-gray-500">Location</span>
                                                <span className="text-gray-100">{profileData.location}</span>
                                            </div>
                                            <div className="grid grid-cols-[150px_1fr] gap-4">
                                                <span className="font-medium text-gray-500">About Me</span>
                                                <span className="text-gray-100">{profileData.about_me}</span>
                                            </div>
                                            <div className="grid grid-cols-[150px_1fr] gap-4">
                                                <span className="font-medium text-gray-500">Experience Summary</span>
                                                <span className="text-gray-100">{profileData.experience_summary}</span>
                                            </div>
                                            <div className="grid grid-cols-[150px_1fr] gap-4">
                                                <span className="font-medium text-gray-500">Education Summary</span>
                                                <span className="text-gray-100">{profileData.education_summary}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-lg font-medium mb-4">Skills & Expertise</h3>
                                        <div className="bg-muted p-6 rounded-md space-y-4">
                                            <div className="grid grid-cols-[150px_1fr] gap-4">
                                                <span className="font-medium text-gray-500">Skills</span>
                                                <div className="flex flex-wrap gap-2">
                                                    {profileData.skill.map((skill, index) => (
                                                        <span key={index} className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
                                                            {skill}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-[150px_1fr] gap-4">
                                                <span className="font-medium text-gray-500">Expertise</span>
                                                <div className="flex flex-wrap gap-2">
                                                    {profileData.Experience_level}
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-[150px_1fr] gap-4">
                                                <span className="font-medium text-gray-500">Interests</span>
                                                <div className="flex flex-wrap gap-2">
                                                    {profileData.interests.map((interest, index) => (
                                                        <span key={index} className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
                                                            {interest}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-lg font-medium mb-4">Links</h3>
                                        <div className="bg-muted p-6 rounded-md space-y-4">
                                            {profileData.github_url && (
                                                <div className="grid grid-cols-[150px_1fr] gap-4">
                                                    <span className="font-medium text-gray-500">GitHub</span>
                                                    <span className="text-gray-100">{profileData.github_url}</span>
                                                </div>
                                            )}
                                            {profileData.linkedin_url && (
                                                <div className="grid grid-cols-[150px_1fr] gap-4">
                                                    <span className="font-medium text-gray-500">LinkedIn</span>
                                                    <span className="text-gray-100">{profileData.linkedin_url}</span>
                                                </div>
                                            )}
                                            {profileData.website_url && (
                                                <div className="grid grid-cols-[150px_1fr] gap-4">
                                                    <span className="font-medium text-gray-500">Website</span>
                                                    <span className="text-gray-100">{profileData.website_url}</span>
                                                </div>
                                            )}
                                            {profileData.telegram_url && (
                                                <div className="grid grid-cols-[150px_1fr] gap-4">
                                                    <span className="font-medium text-gray-500">Telegram</span>
                                                    <span className="text-gray-100">{profileData.telegram_url}</span>
                                                </div>
                                            )}
                                            {!profileData.github_url && !profileData.linkedin_url && !profileData.website_url && !profileData.telegram_url && (
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
                            className="text-white mt-4"
                            variant="outline"
                            onClick={currentStep === 0 ? () => router.push("/") : prevStep}
                        // disabled={submitting}
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
                            <Button className="mt-4" onClick={nextStep}>
                                Next
                                <ChevronRight className="h-4 w-4 ml-2" />
                            </Button>
                        ) : (
                            <Button onClick={handleSubmit}
                                disabled={submitting}
                                className="min-w-[100px] mt-4">
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
                            <CardTitle className="text-center text-white">🎉 Profile Complete!</CardTitle>
                            <CardDescription className="text-center text-gray-300">
                                Your profile has been successfully updated! You can now enjoy all the features of the platform with your complete profile.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-4">
                            <Button className="text-white"
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
    );
}