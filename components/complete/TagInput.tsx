'use client'; // Needs to be a client component

import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { X as XIcon } from 'lucide-react'; // Renamed to avoid conflict
import { cn } from '@/lib/utils';

interface TagInputProps {
    value: string[];
    onChange: (tags: string[]) => void;
    placeholder?: string;
    className?: string;
    maxTags?: number;
}

export function TagInput({
    value = [],
    onChange,
    placeholder,
    className,
    maxTags,
}: TagInputProps) {
    const [inputValue, setInputValue] = useState('');

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(event.target.value);
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter' || event.key === ',') {
            event.preventDefault();
            addTag();
        } else if (event.key === 'Backspace' && inputValue === '' && value.length > 0) {
            // Optional: Remove last tag on backspace if input is empty
            removeTag(value[value.length - 1]);
        }
    };

    const addTag = () => {
        const newTag = inputValue.trim();
        if (newTag && !value.includes(newTag)) {
            if (maxTags && value.length >= maxTags) {
                // Optional: Handle max tags limit (e.g., show a message)
                console.warn(`Maximum tag limit (${maxTags}) reached.`);
                return;
            }
            onChange([...value, newTag]);
        }
        setInputValue('');
    };

    const removeTag = (tagToRemove: string) => {
        onChange(value.filter((tag) => tag !== tagToRemove));
    };

    return (
        <div className={cn('w-full', className)}>
            <div className="flex flex-wrap gap-2 mb-2 min-h-[2.5rem] items-center">
                {value.map((tag) => (
                    <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                        {tag}
                        <button
                            type="button" // Important for forms
                            aria-label={`Remove ${tag}`}
                            onClick={() => removeTag(tag)}
                            className="appearance-none border-none bg-transparent p-0 m-0 cursor-pointer focus:outline-none focus:ring-1 focus:ring-ring rounded-sm"
                        >
                            <XIcon className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                        </button>
                    </Badge>
                ))}
                <Input
                    type="text"
                    value={inputValue}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    onBlur={addTag} // Optional: Add tag on blur
                    placeholder={value.length === 0 ? placeholder : ''}
                    className={cn(
                        "flex-grow h-auto py-1 px-2 border-none shadow-none focus-visible:ring-0",
                        value.length > 0 ? "min-w-[60px]" : "w-full" // Adjust width based on content
                    )}
                    disabled={maxTags !== undefined && value.length >= maxTags}
                />
            </div>
            {/* Add border around the whole thing if desired */}
            <div className="border border-input rounded-md px-3 py-2"> {/* Wrapper for border */}
                {/* Empty div to ensure the layout space is calculated correctly - or put input inside this */}
            </div>
        </div>
    );
}

// Note: The styling might need refinement. The Input inside the flex container
// needs careful handling to grow correctly and look integrated. You might place
// the Input *within* the bordered div instead of trying to make the flex container look like the input.
// Let's adjust the structure slightly:

// Revised TagInput Structure (place input inside the border)
export function TagInputRevised({ /* ...props */ }: TagInputProps) {
    const [inputValue, setInputValue] = useState('');
    const { value = [], onChange, placeholder, className, maxTags } = arguments[0]; // Access props

    // ... (handleInputChange, handleKeyDown, addTag, removeTag functions remain the same)

    return (
        <div
            className={cn(
                "flex flex-wrap gap-2 items-center w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
                className
            )}
        // onClick={() => document.getElementById('tag-input-field')?.focus()} // Focus input on click
        >
            {value.map((tag) => (
                <Badge key={tag} variant="secondary" className="flex items-center gap-1 whitespace-nowrap">
                    {tag}
                    <button
                        type="button"
                        aria-label={`Remove ${tag}`}
                        onClick={() => removeTag(tag)}
                        className="appearance-none border-none bg-transparent p-0 m-0 cursor-pointer focus:outline-none focus:ring-1 focus:ring-ring rounded-sm ml-1"
                    >
                        <XIcon className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                    </button>
                </Badge>
            ))}
            <Input
                id="tag-input-field" // Add an ID for potential focus trigger
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                //   onBlur={addTag} // Be careful with onBlur if clicking the badge remove button blurs the input
                placeholder={value.length === 0 ? placeholder : ''}
                className={cn(
                    "flex-1 bg-transparent border-none shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 p-0 h-auto min-w-[80px]", // Adjusted styles
                    "disabled:cursor-not-allowed disabled:opacity-50"
                )}
                disabled={maxTags !== undefined && value.length >= maxTags}
                aria-label="Add new tag"
            />
        </div>
    );
}

// Use TagInputRevised in your components