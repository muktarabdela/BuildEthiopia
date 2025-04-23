"use client"

import { useState } from "react"
import Link from "next/link"
import { MessageSquare, Heart, Reply, MoreHorizontal } from "lucide-react"
import CommentForm from "./CommentForm"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

type User = {
    id: string;
    name: string;
    profile_picture?: string;
};

type Comment = {
    id: string;
    content: string;
    created_at: string;
    user: User;
};

type Props = {
    projectId: string;
    initialComments?: Comment[];
    commentsCount?: number;
};

export default function CommentsSection({ projectId, initialComments = [], commentsCount = 0 }: Props) {
    const [comments, setComments] = useState<Comment[]>(initialComments)
    const [count, setCount] = useState<number>(commentsCount)

    const handleCommentAdded = (newComment: Comment) => {
        setComments((prevComments) => [newComment, ...prevComments])
        setCount((prevCount) => prevCount + 1)
    }

    return (
        <Card className="overflow-hidden bg-gray-800/50 backdrop-blur-sm border border-gray-700/30 hover:border-gray-700/50 transition-all duration-300">
            <CardHeader className="bg- border-b rounded-md border-gray-700/30">
                <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center text-gray-100 text-lg">
                        <MessageSquare className="h-5 w-5 text-primary mr-2" />
                        Discussion
                    </CardTitle>
                </div>
            </CardHeader>
            <CardContent className="p-0">
                {/* Comment Form at the top */}
                <div className="p-6 border-b border-gray-700/30 bg-gray-800/20">
                    <CommentForm projectId={projectId} onCommentAdded={handleCommentAdded} />
                </div>

                {/* Comments List */}
                {comments.length > 0 ? (
                    <div className="divide-y divide-gray-700/30">
                        {comments.map((comment) => (
                            <CommentItem key={comment.id} comment={comment} />
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                        <MessageSquare className="h-12 w-12 text-gray-500 mb-4" />
                        <h3 className="text-lg font-medium text-gray-300 mb-2">No comments yet</h3>
                        <p className="text-gray-400 max-w-md">Be the first to share your thoughts about this project!</p>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}

type CommentItemProps = {
    comment: Comment;
};

function CommentItem({ comment }: CommentItemProps) {
    const [liked, setLiked] = useState<boolean>(false)
    const [likeCount, setLikeCount] = useState<number>(Math.floor(Math.random() * 5))

    const handleLike = () => {
        setLikeCount((prev) => (liked ? prev - 1 : prev + 1))
        setLiked(!liked)
    }

    return (
        <div className="p-6 hover:bg-gray-800/30 transition-colors">
            <div className="flex gap-4">
                {/* User Avatar */}
                <Avatar className="h-10 w-10 border border-gray-700/50">
                    {comment.user.profile_picture ? (
                        <AvatarImage src={comment.user.profile_picture} alt={comment.user.name} />
                    ) : (
                        <AvatarFallback className="bg-primary/10 text-primary">
                            {comment.user.name?.charAt(0).toUpperCase() || "U"}
                        </AvatarFallback>
                    )}
                </Avatar>

                {/* Comment Content */}
                <div className="flex-1 space-y-2">
                    {/* Comment Header */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div
                                // href={`/${comment.user.username}` || "#"}
                                className="font-medium text-gray-200  transition-colors"
                            >
                                {comment.user.name}
                            </div>
                            <span className="text-gray-400 text-sm">
                                {new Date(comment.created_at).toLocaleDateString(undefined, {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                })}
                            </span>
                        </div>
                        {/* 
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-gray-200">
                            <MoreHorizontal className="h-4 w-4" />
                        </Button> */}
                    </div>

                    {/* Comment Text */}
                    <div className="text-gray-300 leading-relaxed">{comment.content}</div>

                    {/* Comment Actions */}
                    <div className="flex items-center gap-4 pt-2">
                        <Button
                            variant="ghost"
                            size="sm"
                            className={`h-8 px-2 gap-1.5 text-sm ${liked ? "text-primary" : "text-gray-400 hover:text-gray-200"}`}
                            onClick={handleLike}
                        >
                            <Heart className={`h-4 w-4 ${liked ? "fill-primary" : ""}`} />
                            <span>{likeCount}</span>
                        </Button>

                        {/* <Button variant="ghost" size="sm" className="h-8 px-2 gap-1.5 text-sm text-gray-400 hover:text-gray-200">
                            <Reply className="h-4 w-4" />
                            <span>Reply</span>
                        </Button> */}
                    </div>
                </div>
            </div>
        </div>
    )
}

