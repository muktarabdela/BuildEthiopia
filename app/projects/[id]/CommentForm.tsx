'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/components/AuthProvider';

export default function CommentForm({ projectId, onCommentAdded }) {
    const { user } = useAuth();
    const [content, setContent] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!content.trim()) return;

        try {
            setIsSubmitting(true);
            setError(null);

            if (!user) {
                // Redirect to login
                window.location.href = '/login?redirect=' + encodeURIComponent(window.location.pathname);
                return;
            }

            // First, insert the comment
            const { data, error } = await supabase
                .from('comments')
                .insert({
                    content: content.trim(),
                    project_id: projectId,
                    user_id: user.id
                })
                .select(`
                    id,
                    content,
                    created_at,
                    user:profiles(id, name,profile_picture)
                `)
                .single();

            if (error) throw error;

            // Then, increment the comments count
            const { error: countError } = await supabase
                .rpc('increment', {
                    table_name: 'projects',
                    column_name: 'comments_count',
                    id: projectId,
                    increment_value: 1
                });

            if (countError) throw countError;

            setContent('');

            if (onCommentAdded && data) {
                onCommentAdded(data);
            }
        } catch (err) {
            console.error('Error adding comment:', err);
            setError('Failed to add comment. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Card className="mt-6 bg-gray-800 border-gray-700">
            <CardContent className="pt-6">
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="comment" className="block text-sm font-medium text-gray-300 mb-1">
                            Add a Comment
                        </label>
                        <textarea
                            id="comment"
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-gray-100 placeholder-gray-400 focus:border-primary focus:ring-primary"
                            placeholder="Share your thoughts about this project..."
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            required
                        />
                    </div>

                    {error && (
                        <div className="mb-4 text-red-400 text-sm">
                            {error}
                        </div>
                    )}

                    <div className="flex justify-end">
                        <Button
                            type="submit"
                            disabled={isSubmitting || !content.trim()}
                            className="bg-primary hover:bg-primary-dark text-white"
                        >
                            {isSubmitting ? 'Submitting...' : 'Post Comment'}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
} 