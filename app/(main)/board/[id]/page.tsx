import { redirect } from 'next/navigation';
import { IsNull } from 'typeorm';

import { getDataSource } from '@/config/data-source';

import { BoardCommentRepository, BoardRepository } from '@/database/repositories';

import { getSession } from '@/share/utils/auth';

import BoardDetailClient from './BoardDetailClient';

interface PageProps {
  params: Promise<{ id: string }> | { id: string };
}

export default async function BoardDetailPage({ params }: PageProps) {
  const dataSource = await getDataSource();
  const boardRepository = new BoardRepository(dataSource.manager);
  const boardCommentRepository = new BoardCommentRepository(dataSource.manager);

  // params가 Promise인 경우 처리
  const resolvedParams = await Promise.resolve(params);
  const boardId = parseInt(resolvedParams.id);

  if (isNaN(boardId)) {
    redirect('/board');
  }

  // 게시글 조회
  const board = await boardRepository.findOne({
    where: {
      id: boardId,
      isDeleted: false,
    },
    relations: ['user'],
  });

  if (!board) {
    redirect('/board');
  }

  // 조회수 증가
  board.viewCount = (board.viewCount || 0) + 1;
  await boardRepository.save(board);

  // 댓글 조회
  const comments = await boardCommentRepository.find({
    where: {
      boardId,
      isDeleted: false,
      parentId: IsNull(), // 최상위 댓글만
    },
    relations: ['user'],
    order: {
      createdAt: 'ASC',
    },
  });

  // 대댓글 조회
  const commentIds = comments.map((comment) => comment.id);
  const replies =
    commentIds.length > 0
      ? await boardCommentRepository
          .createQueryBuilder('comment')
          .where('comment.boardId = :boardId', { boardId })
          .andWhere('comment.isDeleted = :isDeleted', { isDeleted: false })
          .andWhere('comment.parentId IN (:...commentIds)', { commentIds })
          .leftJoinAndSelect('comment.user', 'user')
          .orderBy('comment.createdAt', 'ASC')
          .getMany()
      : [];

  // 각 댓글에 대댓글 연결
  const commentsWithReplies = comments.map((comment) => ({
    ...comment,
    replies: replies.filter((reply) => reply.parentId === comment.id),
  }));

  // 현재 사용자 정보 가져오기
  const session = await getSession();
  const currentUserId = session?.userId || null;

  return (
    <BoardDetailClient
      board={{
        id: board.id,
        title: board.title,
        content: board.content,
        viewCount: board.viewCount || 0,
        likeCount: board.likeCount || 0,
        commentCount: board.commentCount || 0,
        createdAt: board.createdAt.toISOString(),
        updatedAt: board.updatedAt.toISOString(),
        user: {
          id: board.user.id,
          username: board.user.username,
        },
      }}
      initialComments={commentsWithReplies.map((comment) => ({
        id: comment.id,
        content: comment.content,
        createdAt: comment.createdAt.toISOString(),
        user: {
          id: comment.user.id,
          username: comment.user.username,
        },
        replies: comment.replies?.map((reply) => ({
          id: reply.id,
          content: reply.content,
          createdAt: reply.createdAt.toISOString(),
          user: {
            id: reply.user.id,
            username: reply.user.username,
          },
        })),
      }))}
      boardId={resolvedParams.id}
      currentUserId={currentUserId}
    />
  );
}
