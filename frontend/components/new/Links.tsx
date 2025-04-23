import { StepProps } from "./types"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Github, Globe } from "lucide-react"
import { cn } from "@/lib/utils"

export function Links({
    formData,
    setFormData,
    validationErrors,
    techInput,
    setTechInput
}: StepProps) {
    const handleTechInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && techInput.trim()) {
            e.preventDefault()
            if (!formData.tech_stack.includes(techInput.trim())) {
                setFormData(prev => ({
                    ...prev,
                    tech_stack: [...prev.tech_stack, techInput.trim()]
                }))
            }
            setTechInput("")
        }
    }

    const removeTechItem = (index: number) => {
        setFormData(prev => ({
            ...prev,
            tech_stack: prev.tech_stack.filter((_, i) => i !== index)
        }))
    }

    return (
        <>
            {/* ... Links component content ... */}
        </>
    )
} 