import { NextResponse } from 'next/server';
import { createClient, requireAuth } from '@/lib/supabase';

// POST /api/projects/[id]/upvote - Upvote a project
export async function POST(request, { params }) {
  try {
    await requireAuth();
    const supabase = createClient();

    const { error } = await supabase.rpc('handle_upvote', {
      project_id: params.id,
    });

    if (error) throw error;

    return NextResponse.json({ message: 'Project upvoted successfully' });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to upvote project' },
      { status: error.message === 'Unauthorized' ? 403 : 500 }
    );
  }
}

// DELETE /api/projects/[id]/upvote - Remove upvote from a project
export async function DELETE(request, { params }) {
  try {
    await requireAuth();
    const supabase = createClient();

    const { error } = await supabase.rpc('handle_remove_upvote', {
      project_id: params.id,
    });

    if (error) throw error;

    return NextResponse.json({ message: 'Upvote removed successfully' });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to remove upvote' },
      { status: error.message === 'Unauthorized' ? 403 : 500 }
    );
  }
} 