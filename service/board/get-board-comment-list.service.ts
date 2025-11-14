import { IsNull } from 'typeorm';

import { getDataSource } from '@/config/data-source';

import { BoardCommentRepository } from '@/database/repositories';

export interface Comment {
  id: number;
  content: string;
  createdAt: string;
  user: {
    id: number;
    username: string;
  };
  replies?: Comment[];
}

export async function getBoardCommentList(boardId: number): Promise<Comment[]> {
  const dataSource = await getDataSource();
  const boardCommentRepository = new BoardCommentRepository(dataSource.manager);

  // 최상위 댓글 조회
  const comments = await boardCommentRepository.find({
    where: {
      boardId,
      isDeleted: false,
      parentId: IsNull(),
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
  const commentsWithReplies: Comment[] = comments.map((comment) => ({
    id: comment.id,
    content: comment.content,
    createdAt: comment.createdAt.toISOString(),
    user: {
      id: comment.user.id,
      username: comment.user.username,
    },
    replies: replies
      .filter((reply) => reply.parentId === comment.id)
      .map((reply) => ({
        id: reply.id,
        content: reply.content,
        createdAt: reply.createdAt.toISOString(),
        user: {
          id: reply.user.id,
          username: reply.user.username,
        },
      })),
  }));

  return commentsWithReplies;
}
