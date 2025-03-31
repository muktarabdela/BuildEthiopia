import React from 'react';
import { cn } from "@/lib/utils"; // Assuming Shadcn setup

interface StepsIndicatorProps {
    current: number;
    total: number;
    className?: string;
}

export function StepsIndicator({ current, total, className }: StepsIndicatorProps) {
    return (
        <div className={cn("flex items-center justify-center space-x-2", className)}>
            <p className="text-sm font-medium text-muted-foreground">
                Step {current} of {total}
            </p>
            <div className="flex space-x-1">
                {Array.from({ length: total }).map((_, index) => (
                    <div
                        key={index}
                        className={cn(
                            "h-2 w-6 rounded-full",
                            index < current ? "bg-primary" : "bg-muted"
                        )}
                    />
                ))}
            </div>
        </div>
    );
}