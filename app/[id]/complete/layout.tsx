import React from 'react';
import { Toaster } from "@/components/ui/sonner"; // Keep toaster accessible

export default function ProfileCompletionLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 pt-10 md:pt-16">
            <div className="w-full max-w-2xl">
                {children}
            </div>
            <Toaster richColors position="top-right" /> {/* Position toast */}
        </div>
    );
}