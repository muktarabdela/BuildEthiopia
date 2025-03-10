'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase';
import { ThumbsUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function UpvoteButton({ projectId, initialUpvotes }) {
    const [upvotes, setUpvotes] = useState(initialUpvotes);
    const [hasUpvoted, setHasUpvoted] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const supabase = createClient();

    useEffect(() => {
        async function checkUserUpvote() {
            try {
                const { data: { session } } = await supabase.auth.getSession();

                if (!session) {
                    setIsAuthenticated(false);
                    setIsLoading(false);
                    return;
                }

                setIsAuthenticated(true);

                const { data, error } = await supabase
                    .from('upvotes')
                    .select('*')
                    .eq('project_id', projectId)
                    .eq('user_id', session.user.id)
                    .single();

                if (error && error.code !== 'PGRST116') {
                    console.error('Error checking upvote:', error);
                }

                setHasUpvoted(!!data);
                setIsLoading(false);
            } catch (error) {
                console.error('Error:', error);
                setIsLoading(false);
            }
        }

        checkUserUpvote();
    }, [projectId]);

    const handleUpvote = async () => {
        if (!isAuthenticated) {
            // Redirect to login
            window.location.href = '/login?redirect=' + encodeURIComponent(window.location.pathname);
            return;
        }

        try {
            setIsLoading(true);

            if (hasUpvoted) {
                // Remove upvote
                const { error } = await supabase.rpc('handle_remove_upvote', {
                    project_id: projectId
                });

                if (error) throw error;

                setUpvotes(prev => prev - 1);
                setHasUpvoted(false);
            } else {
                // Add upvote
                const { error } = await supabase.rpc('handle_upvote', {
                    project_id: projectId
                });

                if (error) throw error;

                setUpvotes(prev => prev + 1);
                setHasUpvoted(true);
            }
        } catch (error) {
            console.error('Error toggling upvote:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Button
            onClick={handleUpvote}
            disabled={isLoading}
            variant={hasUpvoted ? "default" : "outline"}
            className={`flex items-center space-x-2 ${hasUpvoted ? 'bg-primary text-white' : ''}`}
        >
            <ThumbsUp className={`h-4 w-4 ${hasUpvoted ? 'fill-current' : ''}`} />
            <span>{upvotes} Upvotes</span>
        </Button>
    );
} 