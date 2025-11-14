import { getDataSource } from '@/config/data-source';

import { BoardRepository } from '@/database/repositories';

export interface BoardDetail {
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

export async function getBoardDetail(boardId: number): Promise<BoardDetail | null> {
  const dataSource = await getDataSource();
  const boardRepository = new BoardRepository(dataSource.manager);

  const board = await boardRepository.findOne({
    where: {
      id: boardId,
      isDeleted: false,
    },
    relations: ['user'],
  });

  if (!board) {
    return null;
  }

  // 조회수 증가
  board.viewCount = (board.viewCount || 0) + 1;
  await boardRepository.save(board);

  return {
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
  };
}

