'use client';

import { useState } from 'react';
import Link from 'next/link';
import { MessageSquare } from 'lucide-react';
import CommentForm from './CommentForm';
import { Card } from '@/components/ui/card';

export default function CommentsSection({ projectId, initialComments, commentsCount }) {
    const [comments, setComments] = useState(initialComments || []);
    const [count, setCount] = useState(commentsCount || 0);

    const handleCommentAdded = (newComment) => {
        setComments(prevComments => [newComment, ...prevComments]);
        setCount(prevCount => prevCount + 1);
    };

    return (
        <>
            <Card className="mb-6">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle>Comments</CardTitle>
                        <div className="flex items-center">
                            <MessageSquare className="h-4 w-4 mr-2" />
                            <span>{count}</span>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {comments.length > 0 ? (
                        <div className="space-y-4">
                            {comments.map((comment) => (
                                <div key={comment.id} className="flex space-x-4">
                                    <div className="flex-1">
                                        <div className="flex items-center space-x-2 mb-1">
                                            <Link
                                                href={`/developers/${comment.user.id}`}
                                                className="font-medium hover:text-primary"
                                            >
                                                {comment.user.name}
                                            </Link>
                                            <span className="text-muted-foreground text-sm">
                                                {new Date(comment.created_at).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <p className="text-muted-foreground">{comment.content}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-muted-foreground text-center py-4">
                            No comments yet. Be the first to comment!
                        </p>
                    )}
                </CardContent>
            </Card>

            <CommentForm projectId={projectId} onCommentAdded={handleCommentAdded} />
        </>
    );
} 