export interface ProjectFormData {
    title: string
    description: string
    logo_url: string
    github_url: string
    live_url: string
    category: string
    post_content: string
    youtube_video_url: string
    tech_stack: string[]
    is_open_source: boolean
}

export interface StepProps {
    formData: ProjectFormData
    setFormData: React.Dispatch<React.SetStateAction<ProjectFormData>>
    validationErrors: Record<string, string>
    setValidationErrors: React.Dispatch<React.SetStateAction<Record<string, string>>>
    imageFiles: File[]
    setImageFiles: React.Dispatch<React.SetStateAction<File[]>>
    imagePreviewUrls: string[]
    setImagePreviewUrls: React.Dispatch<React.SetStateAction<string[]>>
    logoFile: File | null
    setLogoFile: React.Dispatch<React.SetStateAction<File | null>>
    logoPreviewUrl: string
    setLogoPreviewUrl: React.Dispatch<React.SetStateAction<string>>
    techInput: string
    setTechInput: React.Dispatch<React.SetStateAction<string>>
} 