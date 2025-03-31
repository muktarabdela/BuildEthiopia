'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { AlertCircle, ArrowLeft, ChevronRight, Loader2, Star } from 'lucide-react';
import { useAuth } from '@/components/AuthProvider';
import { useLoading } from '@/components/LoadingProvider';

// Import Step Components
import { StepsIndicator } from '@/components/complete/StepsIndicator';
import { BasicInfoStep } from '@/components/complete/BasicProfile';
import { SkillsStep } from '@/components/complete/SkillsStep';
import { BackgroundStep } from '@/components/complete/BackgroundStep';
import { LinksStep } from '@/components/complete/LinksStep';
import { FinalDetailsStep } from '@/components/complete/FinalDetailsStep';

const TOTAL_STEPS = 5;

// Define the structure for all profile data
interface ProfileFormData {
    // From profiles table
    profilePictureFile: File | null;
    profilePictureUrl: string | null;
    bio: string;
    role: string;
    location: string;
    github_url: string;
    linkedin_url: string;
    website_url: string;
    telegram_url: string;
    contact_visible: boolean;
    skill: string[];

    // From user_about table
    about_me: string;
    experience_summary: string;
    expertise: string[];
    education_summary: string;
    interests: string[];
}

async function saveProfileData(username: string, step: number, data: Partial<ProfileFormData>, file?: File | null) {
    const formData = new FormData();
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const apiUrl = `${baseUrl}/api/profile/${username}`;

    Object.entries(data).forEach(([key, value]) => {
        if (key !== 'profilePictureFile' && key !== 'profilePictureUrl') {
            if (Array.isArray(value)) {
                value.forEach(item => formData.append(`${key}[]`, item));
            } else if (typeof value === 'boolean') {
                formData.append(key, String(value));
            }
            else if (value !== null && value !== undefined) {
                formData.append(key, value as string);
            }
        }
    });

    if (step === 1 && file) {
        formData.append('profile_picture', file, file.name);
    }

    formData.append('_step', String(step));

    const response = await fetch(apiUrl, {
        method: 'PATCH',
        body: formData,
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Failed to save data' }));
        throw new Error(errorData.message || 'Failed to save profile data');
    }

    return await response.json();
}

export default function CompleteProfilePage(username: string) {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const apiUrl = `${baseUrl}/api/profile/${username}`;
    const { user } = useAuth();
    const router = useRouter();

    const { setIsLoading } = useLoading();
    const [currentStep, setCurrentStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
    const [profileData, setProfileData] = useState<ProfileFormData>({
        profilePictureFile: null,
        profilePictureUrl: null,
        bio: '',
        role: 'developer',
        location: '',
        github_url: '',
        linkedin_url: '',
        website_url: '',
        telegram_url: '',
        contact_visible: false,
        skill: [],
        about_me: '',
        experience_summary: '',
        expertise: [],
        education_summary: '',
        interests: [],
    });

    useEffect(() => {
        if (!user) {
            // router.push('/login');
            return;
        }

        const fetchData = async () => {
            setIsLoading(true);
            try {
                const response = await fetch(apiUrl, {
                    // Optional: Add caching options if needed
                    // cache: 'no-store', // Use 'no-store' to always fetch fresh data
                    // next: { revalidate: 60 } // Or specify revalidation time
                });
                if (!response.ok) throw new Error('Failed to fetch profile');
                const existingData = await response.json();
                setProfileData(prev => ({ ...prev, ...existingData.profile, profilePictureFile: null }));
            } catch (error) {
                console.error("Failed to fetch profile data:", error);
                toast.error("Could not load your profile data");
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [user, router, setIsLoading]);

    const handleDataChange = (field: keyof ProfileFormData, value: any) => {
        setProfileData(prev => ({ ...prev, [field]: value }));
        // Clear validation error when user types
        if (validationErrors[field]) {
            setValidationErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[field];
                return newErrors;
            });
        }
    };

    const handlePictureChange = (file: File | null) => {
        setProfileData(prev => ({
            ...prev,
            profilePictureFile: file,
            profilePictureUrl: file ? URL.createObjectURL(file) : prev.profilePictureUrl
        }));
    };

    const getCurrentStepData = (): Partial<ProfileFormData> => {
        switch (currentStep) {
            case 1: return { bio: profileData.bio, role: profileData.role, location: profileData.location };
            case 2: return { skill: profileData.skill, expertise: profileData.expertise };
            case 3: return { experience_summary: profileData.experience_summary, education_summary: profileData.education_summary };
            case 4: return { github_url: profileData.github_url, linkedin_url: profileData.linkedin_url, website_url: profileData.website_url, telegram_url: profileData.telegram_url };
            case 5: return { about_me: profileData.about_me, interests: profileData.interests, contact_visible: profileData.contact_visible };
            default: return {};
        }
    };

    const validateStep = () => {
        const errors: Record<string, string> = {};
        const stepData = getCurrentStepData();

        switch (currentStep) {
            case 1:
                if (!stepData.bio?.trim()) errors.bio = "Bio is required";
                if (!stepData.location?.trim()) errors.location = "Location is required";
                break;
            case 2:
                if (!profileData.skill?.length) errors.skill = "At least one skill is required";
                break;
            case 3:
                if (!stepData.experience_summary?.trim()) errors.experience_summary = "Experience summary is required";
                if (!stepData.education_summary?.trim()) errors.education_summary = "Education summary is required";
                break;
            case 4:
                if (!stepData.github_url?.trim()) errors.github_url = "GitHub URL is required";
                if (!stepData.linkedin_url?.trim()) errors.linkedin_url = "LinkedIn URL is required";
                break;
            case 5:
                if (!stepData.about_me?.trim()) errors.about_me = "About me is required";
                break;
        }

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleNext = async () => {
        if (!validateStep()) {
            toast.error("Please fix the validation errors before proceeding");
            return;
        }

        setIsSubmitting(true);
        try {
            const stepData = getCurrentStepData();
            const fileToSend = currentStep === 1 ? profileData.profilePictureFile : null;
            const result = await saveProfileData(currentStep, stepData, fileToSend);

            if (currentStep === 1 && result?.profilePictureUrl) {
                setProfileData(prev => ({
                    ...prev,
                    profilePictureUrl: result.profilePictureUrl,
                    profilePictureFile: null
                }));
            }

            toast.success(`Step ${currentStep} saved successfully!`);
            if (currentStep < TOTAL_STEPS) {
                setCurrentStep(prev => prev + 1);
            }
        } catch (error: any) {
            toast.error(`Failed to save: ${error.message}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep(prev => prev - 1);
        } else {
            router.push('/dashboard');
        }
    };

    const handleFinish = async () => {
        if (!validateStep()) {
            toast.error("Please fix the validation errors before proceeding");
            return;
        }

        setIsSubmitting(true);
        try {
            const stepData = getCurrentStepData();
            await saveProfileData(currentStep, stepData);
            toast.success("Profile completed successfully!");
            router.push(`/${user?.id}`);
        } catch (error: any) {
            toast.error(`Failed to complete profile: ${error.message}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleSkip = () => {
        toast.info("Profile setup skipped. You can complete it later from settings.");
        router.push('/dashboard');
    };

    const StepComponent = useMemo(() => {
        switch (currentStep) {
            case 1: return <BasicInfoStep data={profileData} onChange={handleDataChange} onPictureChange={handlePictureChange} isLoading={isSubmitting} />;
            case 2: return <SkillsStep data={profileData} onChange={handleDataChange} isLoading={isSubmitting} />;
            case 3: return <BackgroundStep data={profileData} onChange={handleDataChange} isLoading={isSubmitting} />;
            case 4: return <LinksStep data={profileData} onChange={handleDataChange} isLoading={isSubmitting} />;
            case 5: return <FinalDetailsStep data={profileData} onChange={handleDataChange} isLoading={isSubmitting} />;
            default: return <div>Invalid Step</div>;
        }
    }, [currentStep, profileData, isSubmitting]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
            <div className="bg-yellow-500/20 border-l-4 border-yellow-500 text-white p-4 mb-8">
                <div className="flex items-center justify-between max-w-3xl mx-auto">
                    <div className="flex items-center space-x-4">
                        <Star className="h-6 w-6 text-yellow-500" />
                        <p className="text-sm md:text-base">
                            Complete your profile to unlock all features and get discovered by recruiters!
                        </p>
                    </div>
                </div>
            </div>

            <main className="max-w-3xl mx-auto py-8 px-4">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2">Complete Your Profile</h1>
                        <p className="text-gray-400">Step {currentStep} of {TOTAL_STEPS}</p>
                    </div>
                    <Button
                        variant="ghost"
                        onClick={handleSkip}
                        disabled={isSubmitting}
                        className="text-gray-400 hover:text-white"
                    >
                        Skip for Now
                    </Button>
                </div>

                <StepsIndicator current={currentStep} total={TOTAL_STEPS} className="mb-6" />

                <Card className="bg-gray-800 border-gray-700">
                    <div className="p-6">
                        {StepComponent}
                    </div>

                    {Object.keys(validationErrors).length > 0 && (
                        <div className="px-6 pb-4">
                            <div className="bg-destructive/10 text-destructive p-4 rounded-md flex items-start gap-3">
                                <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
                                <div className="space-y-1">
                                    <p className="font-medium">Please fix the following errors:</p>
                                    <ul className="list-disc list-inside space-y-1">
                                        {Object.entries(validationErrors).map(([field, error]) => (
                                            <li key={field} className="text-sm">
                                                {error}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    )}

                    <CardFooter className="flex justify-between border-t border-gray-700 pt-6">
                        <Button
                            variant="outline"
                            onClick={handleBack}
                            disabled={isSubmitting}
                            className="bg-transparent border-gray-600 text-gray-300 hover:bg-gray-700"
                        >
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            {currentStep === 1 ? 'Cancel' : 'Back'}
                        </Button>

                        {currentStep < TOTAL_STEPS ? (
                            <Button
                                onClick={handleNext}
                                disabled={isSubmitting}
                                className="bg-primary hover:bg-primary/90"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        Next
                                        <ChevronRight className="ml-2 h-4 w-4" />
                                    </>
                                )}
                            </Button>
                        ) : (
                            <Button
                                onClick={handleFinish}
                                disabled={isSubmitting}
                                className="bg-primary hover:bg-primary/90"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Completing...
                                    </>
                                ) : (
                                    'Complete Profile'
                                )}
                            </Button>
                        )}
                    </CardFooter>
                </Card>
            </main>
        </div>
    );
}