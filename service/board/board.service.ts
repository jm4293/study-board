import { getDataSource } from '@/config/data-source';

import { BoardRepository } from '@/database/repositories';

export interface Board {
  id: number;
  title: string;
  content: string;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  createdAt: string;
  user: {
    id: number;
    username: string;
  };
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface GetBoardsResult {
  boards: Board[];
  pagination: Pagination;
}

export async function getBoards(page: number = 1, limit: number = 10): Promise<GetBoardsResult> {
  const dataSource = await getDataSource();
  const boardRepository = new BoardRepository(dataSource.manager);

  const skip = (page - 1) * limit;

  const [boards, total] = await boardRepository.findAndCount({
    where: {
      isDeleted: false,
    },
    relations: ['user'],
    order: {
      createdAt: 'DESC',
    },
    take: limit,
    skip,
  });

  // Date를 string으로 변환
  const serializedBoards: Board[] = boards.map((board) => ({
    id: board.id,
    title: board.title,
    content: board.content,
    viewCount: board.viewCount || 0,
    likeCount: board.likeCount || 0,
    commentCount: board.commentCount || 0,
    createdAt: board.createdAt.toISOString(),
    user: {
      id: board.user.id,
      username: board.user.username,
    },
  }));

  return {
    boards: serializedBoards,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}
