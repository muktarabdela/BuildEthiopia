// components/WelcomeDialog.tsx
'use client';

import { User } from '@supabase/supabase-js';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// Remove onClose prop if you don't want users to dismiss it without completing
interface WelcomeDialogProps {
    user: User;
    onClose: () => void; // Function to close the dialog (optional)
    onCompleteRedirect: () => void; // Function to redirect to completion page
}

export default function WelcomeDialog({ user, onClose, onCompleteRedirect }: WelcomeDialogProps) {
    // Note: Directly using router.push here might be less ideal than passing the redirect function
    // from the provider, as the provider initiated the logic.

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
            <Card className="w-full max-w-md bg-gray-800 border-gray-700 shadow-xl">
                <CardHeader>
                    <CardTitle className="text-center text-white text-2xl font-semibold">🎉 Welcome to Build Ethiopia!</CardTitle>
                    <p className="text-center text-gray-300 mt-2">
                        We're excited to have you! Let's quickly set up your profile.
                    </p>
                </CardHeader>
                <CardContent className="space-y-5">
                    <div className="text-gray-300 text-sm bg-gray-700/50 p-3 rounded-md">
                        <p className="font-medium mb-2">Completing your profile helps you:</p>
                        <ul className="list-disc list-inside space-y-1 text-gray-300">
                            <li>Showcase your skills & experience</li>
                            <li>Connect with peers</li>
                            <li>Share projects & contributions</li>
                        </ul>
                    </div>
                    <div className="flex justify-center pt-2">
                        <Button
                            onClick={onCompleteRedirect} // Use the passed function
                            className="w-full md:w-auto px-8 bg-primary hover:bg-primary/90 text-white"
                            size="lg"
                        >
                            Complete Your Profile
                        </Button>
                        {/* Optional: Add a close button if needed
                        <Button variant="ghost" onClick={onClose} className="ml-2">
                            Later
                        </Button>
                         */}
                    </div>
                </CardContent>
            </Card>
            {/* Add CSS for animation if needed */}
            <style jsx global>{`
              @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
              }
              .animate-fade-in {
                animation: fadeIn 0.3s ease-out forwards;
              }
            `}</style>
        </div>
    );
}