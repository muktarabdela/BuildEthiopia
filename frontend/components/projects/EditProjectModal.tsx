// components/projects/EditProjectModal.tsx
"use client"

import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod'; // Import zod itself
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"; // Assuming you have categories
import { toast } from 'sonner';
import axios from 'axios';
import { Loader2 } from 'lucide-react'; // For loading indicator

// Define or import your project schema (ensure it matches all fields)
// Example Schema (adjust based on your actual validation needs)
const projectSchema = z.object({
    title: z.string().min(3, 'Title must be at least 3 characters'),
    description: z.string().min(10, 'Description must be at least 10 characters'),
    category: z.string().min(1, 'Category is required'), // Make sure category is handled
    post_content: z.string().min(20, 'Details must be at least 20 characters'),
    images: z.array(z.string().url('Must be a valid URL')).optional().nullable(), // Array of URLs
    logo_url: z.string().url('Must be a valid URL').optional().nullable(),
    youtube_video_url: z.string().url('Must be a valid YouTube URL').optional().nullable(),
    tech_stack: z.array(z.string()).optional().nullable(), // Array of strings
    github_url: z.string().url('Must be a valid GitHub URL').optional().nullable(),
    live_url: z.string().url('Must be a valid Live URL').optional().nullable(),
    is_open_source: z.boolean().optional().default(true),
});

type FormData = z.infer<typeof projectSchema>;

interface EditProjectModalProps {
    project: any; // Consider defining a strict Project type
    isOpen: boolean;
    onClose: () => void;
    onUpdate: (updatedProject: any) => void;
}

// --- Mock Data ---
// Replace with actual fetching if needed, or pass categories as props
const MOCK_CATEGORIES = ["Web App", "Mobile App", "Library", "Tool", "Game"];
// ---

export function EditProjectModal({ project, isOpen, onClose, onUpdate }: EditProjectModalProps) {
    const {
        control,
        register,
        handleSubmit,
        formState: { errors, isDirty, isValid }, // Use isValid for potentially stricter checks
        reset,
        watch
    } = useForm<FormData>({
        resolver: zodResolver(projectSchema),
        mode: 'onChange', // Validate on change for immediate feedback
        defaultValues: { // Set default values from the project prop
            title: project?.title || '',
            description: project?.description || '',
            category: project?.category || '',
            post_content: project?.post_content || '',
            images: project?.images || [],
            logo_url: project?.logo_url || '',
            youtube_video_url: project?.youtube_video_url || '',
            tech_stack: project?.tech_stack || [],
            github_url: project?.github_url || '',
            live_url: project?.live_url || '',
            is_open_source: project?.is_open_source ?? true, // Handle null/undefined for boolean
        }
    });

    const [isLoading, setIsLoading] = useState(false);

    // Reset form when project changes or modal opens/closes
    useEffect(() => {
        if (isOpen && project) {
            reset({
                title: project.title || '',
                description: project.description || '',
                category: project.category || '',
                post_content: project.post_content || '',
                images: project.images || [],
                logo_url: project.logo_url || '',
                youtube_video_url: project.youtube_video_url || '',
                tech_stack: project.tech_stack || [],
                github_url: project.github_url || '',
                live_url: project.live_url || '',
                is_open_source: project.is_open_source ?? true,
            });
        }
    }, [project, isOpen, reset]);

    const handleUpdateProject = async (data: FormData) => {
        setIsLoading(true);
        console.log("Submitting data:", data); // Log data before sending
        try {
            const { data: updatedProject } = await axios.put(`/api/projects/${project.id}`, data, {
                headers: { 'Content-Type': 'application/json' }
            });
            onUpdate(updatedProject); // Update state in parent component
            toast.success('Project updated successfully!');
            onClose(); // Close modal on success
        } catch (error: unknown) {
            console.error('Error updating project:', error);
            const errorMessage = error instanceof axios.AxiosError
                ? error.response?.data?.message || error.message
                : (error instanceof Error ? error.message : 'Failed to update project');
            toast.error(errorMessage || 'An unexpected error occurred.');
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-w-3xl bg-gray-800 border-gray-700 text-white">
                <DialogHeader>
                    <DialogTitle className="text-white">Edit Project: {project?.title}</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit(handleUpdateProject)}>
                    <Tabs defaultValue="basic" className="w-full pt-4">
                        <TabsList className="grid w-full grid-cols-4 bg-gray-700">
                            <TabsTrigger className='text-gray-300 data-[state=active]:text-white data-[state=active]:bg-primary' value="basic">Basic Info</TabsTrigger>
                            <TabsTrigger className='text-gray-300 data-[state=active]:text-white data-[state=active]:bg-primary' value="details">Details</TabsTrigger>
                            <TabsTrigger className='text-gray-300 data-[state=active]:text-white data-[state=active]:bg-primary' value="media">Media</TabsTrigger>
                            <TabsTrigger className='text-gray-300 data-[state=active]:text-white data-[state=active]:bg-primary' value="technical">Technical</TabsTrigger>
                        </TabsList>

                        {/* Basic Info Tab */}
                        <TabsContent value="basic" className="space-y-4 pt-4">
                            <div className="space-y-2">
                                <Label htmlFor="title" className="text-gray-300">Title *</Label>
                                <Input id="title" {...register('title')} className="bg-gray-700 border-gray-600" placeholder="Awesome Project Name" />
                                {errors.title && <p className="text-sm text-red-400">{errors.title.message}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="description" className="text-gray-300">Short Description *</Label>
                                <Textarea id="description" {...register('description')} className="bg-gray-700 border-gray-600 min-h-[80px]" placeholder="A brief summary or tagline for your project." />
                                {errors.description && <p className="text-sm text-red-400">{errors.description.message}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="category" className="text-gray-300">Category *</Label>
                                <Controller
                                    name="category"
                                    control={control}
                                    render={({ field }) => (
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <SelectTrigger id="category" className="bg-gray-700 border-gray-600">
                                                <SelectValue placeholder="Select a category" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-gray-700 text-white border-gray-600">
                                                {MOCK_CATEGORIES.map(cat => (
                                                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                                {errors.category && <p className="text-sm text-red-400">{errors.category.message}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="logo_url" className="text-gray-300">Logo URL</Label>
                                <Input id="logo_url" {...register('logo_url')} className="bg-gray-700 border-gray-600" placeholder="https://example.com/logo.png" />
                                {errors.logo_url && <p className="text-sm text-red-400">{errors.logo_url.message}</p>}
                                {/* Recommendation: Replace with an actual image uploader */}
                            </div>
                        </TabsContent>

                        {/* Details Tab */}
                        <TabsContent value="details" className="space-y-4 pt-4">
                            <div className="space-y-2">
                                <Label htmlFor="post_content" className="text-gray-300">Project Details *</Label>
                                <Textarea
                                    id="post_content"
                                    {...register('post_content')}
                                    className="bg-gray-700 border-gray-600 min-h-[250px]"
                                    placeholder="Describe your project in detail. What problem does it solve? How does it work? What were the challenges?"
                                />
                                {errors.post_content && <p className="text-sm text-red-400">{errors.post_content.message}</p>}
                                {/* Recommendation: Replace this with a Markdown or Rich Text Editor */}
                            </div>
                        </TabsContent>

                        {/* Media Tab */}
                        <TabsContent value="media" className="space-y-4 pt-4">
                            <div className="space-y-2">
                                <Label htmlFor="images" className="text-gray-300">Image URLs</Label>
                                {/* Basic example: Input for comma-separated URLs */}
                                <Input
                                    id="images"
                                    {...register('images', {
                                        setValueAs: (value) => {
                                            if (Array.isArray(value)) return value;
                                            if (typeof value === 'string') {
                                                return value.split(',').map((s: string) => s.trim()).filter(Boolean);
                                            }
                                            return [];
                                        }
                                    })}
                                    defaultValue={project?.images?.join(', ')} // Join array for display in basic input
                                    className="bg-gray-700 border-gray-600"
                                    placeholder="https://example.com/img1.png, https://example.com/img2.png"
                                />
                                {errors.images && <p className="text-sm text-red-400">One or more image URLs are invalid.</p>}
                                {/* Recommendation: Replace with a proper multi-image uploader/manager component */}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="youtube_video_url" className="text-gray-300">YouTube Video URL</Label>
                                <Input id="youtube_video_url" {...register('youtube_video_url')} type="url" className="bg-gray-700 border-gray-600" placeholder="https://www.youtube.com/watch?v=..." />
                                {errors.youtube_video_url && <p className="text-sm text-red-400">{errors.youtube_video_url.message}</p>}
                            </div>
                        </TabsContent>

                        {/* Technical Tab */}
                        <TabsContent value="technical" className="space-y-4 pt-4">
                            <div className="space-y-2">
                                <Label htmlFor="tech_stack" className="text-gray-300">Tech Stack (comma-separated)</Label>
                                {/* Basic example: Input for comma-separated tags */}
                                <Input
                                    id="tech_stack"
                                    {...register('tech_stack', {
                                        setValueAs: (value) => {
                                            if (Array.isArray(value)) return value;
                                            if (typeof value === 'string') {
                                                return value.split(',').map((s: string) => s.trim()).filter(Boolean);
                                            }
                                            return [];
                                        }
                                    })}
                                    defaultValue={project?.tech_stack?.join(', ')} // Join array for display
                                    className="bg-gray-700 border-gray-600"
                                    placeholder="React, Next.js, Tailwind CSS, PostgreSQL"
                                />
                                {errors.tech_stack && <p className="text-sm text-red-400">Error in tech stack format.</p>}
                                {/* Recommendation: Replace with a Tag Input component */}
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="github_url" className="text-gray-300">GitHub URL</Label>
                                    <Input id="github_url" {...register('github_url')} type="url" className="bg-gray-700 border-gray-600" placeholder="https://github.com/user/repo" />
                                    {errors.github_url && <p className="text-sm text-red-400">{errors.github_url.message}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="live_url" className="text-gray-300">Live Demo URL</Label>
                                    <Input id="live_url" {...register('live_url')} type="url" className="bg-gray-700 border-gray-600" placeholder="https://myproject.com" />
                                    {errors.live_url && <p className="text-sm text-red-400">{errors.live_url.message}</p>}
                                </div>
                            </div>
                            <div className="flex items-center space-x-2 pt-2">
                                <Controller
                                    name="is_open_source"
                                    control={control}
                                    render={({ field }) => (
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                id="is_open_source"
                                                checked={field.value}
                                                onChange={field.onChange}
                                                className="sr-only peer"
                                            />
                                            <div className="w-11 h-6 bg-gray-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                                        </label>
                                    )}
                                />
                                <Label htmlFor="is_open_source" id="open-source-label" className="text-gray-300 cursor-pointer">
                                    Project is Open Source
                                </Label>
                                {errors.is_open_source && <p className="text-sm text-red-400">{errors.is_open_source.message}</p>}
                            </div>
                        </TabsContent>
                    </Tabs>

                    <DialogFooter className="pt-6">
                        <DialogClose asChild>
                            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
                        </DialogClose>
                        <Button
                            type="submit"
                            className="bg-indigo-600 hover:bg-indigo-700"
                            disabled={isLoading || !isDirty} // Disable if loading or no changes made
                        >
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {isLoading ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}