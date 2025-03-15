import { Code } from 'lucide-react';
import Link from 'next/link';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-creen bg-gradient-to-b from-primary/5 to-transparent">
            <div className="container mx-auto px-4 py-8">
               
                {children}
            </div>
        </div>
    );
}