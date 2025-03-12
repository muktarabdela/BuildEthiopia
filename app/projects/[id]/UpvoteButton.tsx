'use client';

import { useState, useEffect } from 'react';
import { ThumbsUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import axios from 'axios';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/components/AuthProvider';

export default function UpvoteButton({ projectId, initialUpvotes }) {
    const { user } = useAuth();
    const [upvotes, setUpvotes] = useState(initialUpvotes);
    const [hasUpvoted, setHasUpvoted] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    useEffect(() => {


        const fetchUpvotes = async () => {
            try {
                const { count } = await axios.get(`/api/projects/${projectId}/upvote`);
                console.log("Fetched upvotes:", count);
                // setUpvotes(count);
            } catch (error) {
                console.error('Error fetching upvotes:', error);
            }
        };
        // async function checkUserUpvote() {
        //     try {
        //         const session = localStorage.getItem('session');
        //         // Parse the session string to an object
        //         const parsedSession = session ? JSON.parse(session) : null;
        //         setSession(parsedSession);
        //         if (!parsedSession) {
        //             setIsAuthenticated(false);
        //             setIsLoading(false);
        //             return;
        //         }

        //         setIsAuthenticated(true);

        // const { data, error } = await supabase
        //     .from('upvotes')
        //     .select('*')
        //     .eq('project_id', projectId)
        //     .eq('user_id', parsedSession.id)
        //     .single();

        // if (error && error.code !== 'PGRST116') {
        //     console.error('Error checking upvote:', error);
        // }

        //         setHasUpvoted(!!data);
        //         setIsLoading(false);
        //     } catch (error) {
        //         console.error('Error:', error);
        //         setIsLoading(false);
        //     }
        // }
        fetchUpvotes()
        // checkUserUpvote();
    }, [projectId]);

    const handleUpvote = async () => {
        if (!isAuthenticated) {
            // Redirect to login
            window.location.href = '/login?redirect=' + encodeURIComponent(window.location.pathname);
            return;
        }

        try {
            setIsLoading(true);
            // upvote or remove upvote
            const response = await axios.post(`/api/projects/${projectId}/upvote`, {
                user_id: user.id,
                project_id: projectId
            });
            console.log("Upvote response:", response.data);


            // Check if the user has already upvoted

            // if (hasUpvoted) {
            //     // Remove upvote
            //     const { error } = await supabase.rpc('handle_remove_upvote', {
            //         project_id: projectId
            //     });

            //     if (error) throw error;

            //     setUpvotes(prev => prev - 1);
            //     setHasUpvoted(false);
            // } else {
            //     // Add upvote
            //     const { error } = await supabase.rpc('handle_upvote', {
            //         project_id: projectId
            //     });

            //     if (error) throw error;

            //     setUpvotes(prev => prev + 1);
            //     setHasUpvoted(true);
            // }
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