import { Code } from 'lucide-react';
import Link from 'next/link';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-creen bg-gradient-to-b from-primary/5 to-transparent">
            <div className="container mx-auto px-4 py-8">
                <div className="text-center mb-8">
                    {/* Logo */}
                    <Link href="/" className="flex items-center space-x-2" >
                        <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center">
                            <Code className="h-5 w-5 text-white" />
                        </div>
                        <span className="text-xl font-bold text-gray-900">BuildEthiopia</span>
                    </Link>
                </div>
                {children}
            </div>
        </div>
    );
}