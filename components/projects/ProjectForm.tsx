"use client"

import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { projectSchema } from '@/lib/validations/project'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useState } from 'react'
import { Plus, X } from 'lucide-react'

interface ProjectFormProps {
    defaultValues?: any
    onSubmit: (data: any) => Promise<void>
    isSubmitting: boolean
}

export function ProjectForm({ defaultValues, onSubmit, isSubmitting }: ProjectFormProps) {
    const {
        register,
        control,
        handleSubmit,
        formState: { errors },
        watch,
        setValue
    } = useForm({
        resolver: zodResolver(projectSchema),
        defaultValues
    })

    const [techInput, setTechInput] = useState('')
    const techStack = watch('tech_stack') || []

    const handleAddTech = () => {
        if (techInput.trim() && !techStack.includes(techInput)) {
            setValue('tech_stack', [...techStack, techInput])
            setTechInput('')
        }
    }

    const handleRemoveTech = (tech: string) => {
        setValue('tech_stack', techStack.filter(t => t !== tech))
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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

            {/* Tech Stack */}
            <div className="space-y-2">
                <Label htmlFor="tech_stack" className="text-white">Tech Stack</Label>
                <div className="flex gap-2 flex-wrap">
                    {techStack.map(tech => (
                        <Badge key={tech} variant="secondary" className="bg-gray-700 text-white hover:bg-gray-600">
                            {tech}
                            <button
                                type="button"
                                onClick={() => handleRemoveTech(tech)}
                                className="ml-2 hover:text-red-400"
                                aria-label={`Remove ${tech}`}
                            >
                                <X className="h-3 w-3" />
                            </button>
                        </Badge>
                    ))}
                </div>
                <div className="flex gap-2">
                    <Input
                        value={techInput}
                        onChange={(e) => setTechInput(e.target.value)}
                        className="bg-gray-700 text-white border-gray-600"
                        placeholder="Add a technology"
                        onKeyDown={(e) => e.key === 'Enter' && handleAddTech()}
                    />
                    <Button
                        type="button"
                        onClick={handleAddTech}
                        variant="outline"
                        className="bg-gray-700 text-white hover:bg-gray-600"
                    >
                        <Plus className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {/* Submit Button */}
            <Button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700"
                disabled={isSubmitting}
            >
                {isSubmitting ? 'Saving...' : 'Save Project'}
            </Button>
        </form>
    )
} 