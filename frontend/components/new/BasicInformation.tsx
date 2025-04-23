import { StepProps } from "./types"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

export function BasicInformation({ formData, setFormData, validationErrors }: StepProps) {
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    return (
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
                    onChange={handleInputChange}
                    className={cn(
                        "w-full px-3 py-2 border rounded-md",
                        validationErrors.category ? "border-destructive" : ""
                    )}
                >
                    <option value="">Select a category</option>
                    <option value="Web App">Web App</option>
                    <option value="Mobile App">Mobile App</option>
                    <option value="Desktop App">Desktop App</option>
                    <option value="AI/ML">AI/ML</option>
                    <option value="Game">Game</option>
                    <option value="IoT">IoT</option>
                    <option value="Blockchain">Blockchain</option>
                    <option value="Other">Other</option>
                </select>
                {validationErrors.category && <p className="text-sm text-destructive">{validationErrors.category}</p>}
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
                {validationErrors.description && <p className="text-sm text-destructive">{validationErrors.description}</p>}
                <p className="text-xs text-muted-foreground">
                    Minimum 50 characters. Be descriptive about what your project does and the technologies used.
                </p>
            </div>
        </>
    )
} 