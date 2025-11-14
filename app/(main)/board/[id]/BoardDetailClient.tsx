'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { Button, Card } from '@/component/common';

import { deleteBoard } from './actions';

interface Board {
  id: number;
  title: string;
  content: string;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  createdAt: string;
  updatedAt: string;
  user: {
    id: number;
    username: string;
  };
}

interface Comment {
  id: number;
  content: string;
  createdAt: string;
  user: {
    id: number;
    username: string;
  };
  replies?: Comment[];
}

interface UserInfo {
  userId: number;
  username: string;
  email: string;
}

interface BoardDetailClientProps {
  board: Board;
  initialComments: Comment[];
  boardId: string;
  currentUserId: number | null;
}

export default function BoardDetailClient({ board, initialComments, boardId, currentUserId }: BoardDetailClientProps) {
  const router = useRouter();
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [user, setUser] = useState<UserInfo | null>(null);
  const [commentContent, setCommentContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const response = await fetch('/api/auth/me');
      const data = await response.json();
      if (data.success && data.data) {
        setUser(data.data);
      }
    } catch {
      // Error handling
    }
  };

  const fetchComments = async () => {
    try {
      const response = await fetch(`/api/boards/${boardId}/comments`);
      const data = await response.json();

      if (data.success) {
        setComments(data.data);
      }
    } catch {
      // Error handling
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!commentContent.trim()) {
      alert('댓글 내용을 입력해주세요');
      return;
    }

    if (!user) {
      alert('로그인이 필요합니다');
      router.push('/auth/login');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/boards/${boardId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: commentContent,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setCommentContent('');
        fetchComments();
        // 댓글 수 업데이트를 위해 페이지 새로고침
        router.refresh();
      } else {
        alert(data.error || '댓글 작성에 실패했습니다');
      }
    } catch {
      alert('댓글 작성에 실패했습니다');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* 게시글 상세 */}
      <Card shadow="lg" className="mb-8">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h1 className="text-3xl font-bold text-gray-900">{board.title}</h1>
            <div className="flex items-center space-x-2">
              {currentUserId === board.user.id && (
                <>
                  <Link href={`/board/${boardId}/edit`}>
                    <Button variant="secondary" size="sm">
                      수정
                    </Button>
                  </Link>
                  <form action={deleteBoard.bind(null, board.id)} className="inline">
                    <Button type="submit" variant="outline" size="sm">
                      삭제
                    </Button>
                  </form>
                </>
              )}
              <Link href="/board">
                <Button variant="outline" size="sm">
                  목록
                </Button>
              </Link>
            </div>
          </div>

          <div className="flex items-center space-x-4 text-sm text-gray-600 mb-6 pb-6 border-b">
            <span className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              {board.user.username}
            </span>
            <span>{formatDate(board.createdAt)}</span>
            <span className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
              조회 {board.viewCount}
            </span>
            <span className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
              좋아요 {board.likeCount}
            </span>
            <span className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
              댓글 {board.commentCount}
            </span>
          </div>

          <div className="prose max-w-none">
            <div className="whitespace-pre-wrap text-gray-700">{board.content}</div>
          </div>
        </div>
      </Card>

      {/* 댓글 작성 */}
      {user && (
        <Card shadow="md" className="mb-8">
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">댓글 작성</h2>
            <form onSubmit={handleSubmitComment} className="space-y-4">
              <textarea
                value={commentContent}
                onChange={(e) => setCommentContent(e.target.value)}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="댓글을 입력하세요"
              />
              <div className="flex justify-end">
                <Button type="submit" variant="primary" loading={isSubmitting}>
                  댓글 작성
                </Button>
              </div>
            </form>
          </div>
        </Card>
      )}

      {/* 댓글 목록 */}
      <Card shadow="md">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">댓글 {comments.length}개</h2>

          {comments.length === 0 ? (
            <div className="text-center py-8 text-gray-500">아직 댓글이 없습니다.</div>
          ) : (
            <div className="space-y-6">
              {comments.map((comment) => (
                <div key={comment.id} className="border-b border-gray-200 pb-4 last:border-0">
                  <div className="flex items-start space-x-3">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="font-semibold text-gray-900">{comment.user.username}</span>
                        <span className="text-sm text-gray-500">{formatDate(comment.createdAt)}</span>
                      </div>
                      <p className="text-gray-700 whitespace-pre-wrap">{comment.content}</p>
                    </div>
                  </div>

                  {/* 대댓글 */}
                  {comment.replies && comment.replies.length > 0 && (
                    <div className="mt-4 ml-8 pl-4 border-l-2 border-gray-200 space-y-4">
                      {comment.replies.map((reply) => (
                        <div key={reply.id} className="flex items-start space-x-3">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <span className="font-semibold text-gray-900">{reply.user.username}</span>
                              <span className="text-sm text-gray-500">{formatDate(reply.createdAt)}</span>
                            </div>
                            <p className="text-gray-700 whitespace-pre-wrap">{reply.content}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
