'use client';

import { useState, ChangeEvent, FormEvent } from 'react';
import { Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type Developer = {
    id: string;
    name: string;
    contact_visible: boolean;
};

type FormData = {
    name: string;
    email: string;
    message: string;
    company: string;
};

type Props = {
    developer: Developer;
};

export default function ContactDeveloperButton({ developer }: Props) {
    const [showForm, setShowForm] = useState<boolean>(false);
    const [formData, setFormData] = useState<FormData>({
        name: '',
        email: '',
        message: '',
        company: ''
    });
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<boolean>(false);

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            setIsSubmitting(true);
            setError(null);

            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    developer_id: developer.id,
                    ...formData
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to send message');
            }

            setSuccess(true);
            setFormData({
                name: '',
                email: '',
                message: '',
                company: ''
            });

            setTimeout(() => {
                setShowForm(false);
                setSuccess(false);
            }, 3000);

        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('Failed to send message. Please try again.');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!developer.contact_visible) {
        return null;
    }

    return (
        <div>
            {!showForm ? (
                <Button
                    onClick={() => setShowForm(true)}
                    className="flex items-center gap-2"
                >
                    <Mail className="h-4 w-4" />
                    Contact for Hiring
                </Button>
            ) : (
                <Card className="w-full md:w-80">
                    <CardHeader>
                        <CardTitle className="text-lg">Contact {developer.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {success ? (
                            <div className="text-green-600 py-2">
                                Message sent successfully!
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-muted-foreground mb-1">
                                        Your Name
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border rounded-md"
                                        required
                                    />
                                </div>

                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-muted-foreground mb-1">
                                        Your Email
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border rounded-md"
                                        required
                                    />
                                </div>

                                <div>
                                    <label htmlFor="company" className="block text-sm font-medium text-muted-foreground mb-1">
                                        Company (Optional)
                                    </label>
                                    <input
                                        type="text"
                                        id="company"
                                        name="company"
                                        value={formData.company}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border rounded-md"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="message" className="block text-sm font-medium text-muted-foreground mb-1">
                                        Message
                                    </label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        rows={3}
                                        value={formData.message}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border rounded-md"
                                        required
                                    />
                                </div>

                                {error && (
                                    <div className="text-red-500 text-sm">
                                        {error}
                                    </div>
                                )}

                                <div className="flex justify-between">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => setShowForm(false)}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? 'Sending...' : 'Send Message'}
                                    </Button>
                                </div>
                            </form>
                        )}
                    </CardContent>
                </Card>
            )}
        </div>
    );
} 