import { StepProps } from "./types"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Upload } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

export function Media({
    formData,
    setFormData,
    validationErrors,
    imageFiles,
    setImageFiles,
    imagePreviewUrls,
    setImagePreviewUrls,
    logoFile,
    setLogoFile,
    logoPreviewUrl,
    setLogoPreviewUrl
}: StepProps) {
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const filesArray = Array.from(e.target.files)
            const selectedFiles = filesArray.slice(0, 5)
            setImageFiles(selectedFiles)
            setImagePreviewUrls(selectedFiles.map(file => URL.createObjectURL(file)))
        }
    }

    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0]
            setLogoFile(file)
            setLogoPreviewUrl(URL.createObjectURL(file))
        }
    }

    return (
        <>
            {/* ... Media component content ... */}
        </>
    )
}