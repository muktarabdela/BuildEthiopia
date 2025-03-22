"use client"

import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { projectSchema } from '@/lib/validations/project'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'

type FormData = z.infer<typeof projectSchema>

interface EditProjectModalProps {
    project: any
    isOpen: boolean
    onClose: () => void
    onUpdate: (updatedProject: any) => void
}

export function EditProjectModal({ project, isOpen, onClose, onUpdate }: EditProjectModalProps) {
    const {
        register,
        control,
        handleSubmit,
        formState: { errors, isDirty },
        watch,
        reset
    } = useForm<FormData>({
        resolver: zodResolver(projectSchema),
        defaultValues: {
            ...project,
            tech_stack: project.tech_stack || []
        }
    })

    const [isLoading, setIsLoading] = useState(false)
    const images = watch('images')
    const logoUrl = watch('logo_url')

    const handleUpdateProject = async (data: FormData) => {
        setIsLoading(true)
        try {
            const response = await fetch(`/api/projects/${project.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })

            if (!response.ok) {
                throw new Error('Failed to update project')
            }

            const updatedProject = await response.json()
            onUpdate(updatedProject)
            toast.success('Project updated successfully!')
            onClose()
        } catch (error) {
            toast.error(error.message || 'Failed to update project')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl bg-gray-800 border-gray-700">
                <DialogHeader>
                    <DialogTitle className="text-white">Edit Project</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit(handleUpdateProject)} className="space-y-6">
                    {/* Title */}
                    <div className="space-y-2">
                        <Label htmlFor="title" className="text-white">Title</Label>
                        <Input
                            id="title"
                            {...register('title')}
                            className="bg-gray-700 text-white border-gray-600"
                            placeholder="Project title"
                            aria-invalid={!!errors.title}
                        />
                        {errors.title && (
                            <p className="text-sm text-red-400">{errors.title.message}</p>
                        )}
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <Label htmlFor="description" className="text-white">Description</Label>
                        <Textarea
                            id="description"
                            {...register('description')}
                            className="bg-gray-700 text-white border-gray-600 min-h-[100px]"
                            placeholder="Project description"
                            aria-invalid={!!errors.description}
                        />
                        {errors.description && (
                            <p className="text-sm text-red-400">{errors.description.message}</p>
                        )}
                    </div>

                    {/* Images Preview */}
                    {images && images.length > 0 && (
                        <div className="grid grid-cols-3 gap-2">
                            {images.map((image, index) => (
                                <div key={index} className="relative h-24 w-full">
                                    <img
                                        src={image}
                                        alt={`Preview ${index}`}
                                        className="rounded-lg object-cover h-full w-full"
                                    />
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Submit Button */}
                    <Button
                        type="submit"
                        className="w-full bg-indigo-600 hover:bg-indigo-700"
                        disabled={isLoading || !isDirty}
                    >
                        {isLoading ? 'Updating...' : 'Save Changes'}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    )
} 