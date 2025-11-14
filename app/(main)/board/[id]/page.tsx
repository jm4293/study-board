import { redirect } from 'next/navigation';

import { getBoardCommentList } from '@/service/board/get-board-comment-list.service';
import { getBoardDetail } from '@/service/board/get-board-detail.service';

import { getSession } from '@/share/utils/auth';

import BoardDetail from './BoardDetail';
import BoardDetailComment from './BoardDetailComment';

interface PageProps {
  params: Promise<{ id: string }> | { id: string };
}

export default async function BoardDetailPage({ params }: PageProps) {
  // params가 Promise인 경우 처리
  const resolvedParams = await Promise.resolve(params);
  const boardId = parseInt(resolvedParams.id);

  if (isNaN(boardId)) {
    redirect('/board');
  }

  // 게시글 조회 및 조회수 증가
  const board = await getBoardDetail(boardId);

  if (!board) {
    redirect('/board');
  }

  // 댓글 조회
  const comments = await getBoardCommentList(boardId);

  // 현재 사용자 정보 가져오기
  const session = await getSession();
  const currentUserId = session?.userId || null;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <BoardDetail board={board} boardId={resolvedParams.id} currentUserId={currentUserId} />
      <BoardDetailComment boardId={resolvedParams.id} initialComments={comments} />
    </div>
  );
}
