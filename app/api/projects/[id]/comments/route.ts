import { NextResponse } from 'next/server';
import { createClient, requireAuth } from '@/lib/supabase';

// POST /api/projects/[id]/comments - Add a comment to a project
export async function POST(request, { params }) {
    try {
        const session = await requireAuth();
        const { content } = await request.json();

        const supabase = createClient();

        const { data: comment, error } = await supabase
            .from('comments')
            .insert({
                content,
                project_id: params.id,
                user_id: session.user.id,
            })
            .select(`
        *,
        user:profiles(name, role)
      `)
            .single();

        if (error) throw error;

        return NextResponse.json(comment);
    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to add comment' },
            { status: error.message === 'Unauthorized' ? 403 : 500 }
        );
    }
}

// GET /api/projects/[id]/comments - Get all comments for a project
export async function GET(request, { params }) {
    const supabase = createClient();

    try {
        const { data: comments, error } = await supabase
            .from('comments')
            .select(`
        *,
        user:profiles(name, role)
      `)
            .eq('project_id', params.id)
            .order('created_at', { ascending: true });

        if (error) throw error;

        return NextResponse.json(comments);
    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch comments' },
            { status: 500 }
        );
    }
} 