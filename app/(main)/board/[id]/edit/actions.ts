'use server';

import { redirect } from 'next/navigation';
import { getDataSource } from '@/config/data-source';
import { BoardRepository } from '@/database/repositories';
import { getSession } from '@/share/utils/auth';

export async function updateBoard(boardId: number, formData: FormData) {
  const session = await getSession();

  if (!session) {
    redirect('/auth/login');
  }

  const title = formData.get('title') as string;
  const content = formData.get('content') as string;

  if (!title || !title.trim()) {
    throw new Error('제목을 입력해주세요');
  }

  if (!content || !content.trim()) {
    throw new Error('내용을 입력해주세요');
  }

  try {
    const dataSource = await getDataSource();
    const boardRepository = new BoardRepository(dataSource.manager);

    const board = await boardRepository.findOne({
      where: {
        id: boardId,
        isDeleted: false,
      },
    });

    if (!board) {
      throw new Error('게시글을 찾을 수 없습니다');
    }

    if (board.userId !== session.userId) {
      throw new Error('수정 권한이 없습니다');
    }

    board.title = title.trim();
    board.content = content.trim();
    await boardRepository.save(board);

    redirect(`/board/${boardId}`);
  } catch (error) {
    // redirect()는 NEXT_REDIRECT 에러를 throw하는데, 이것은 정상 동작이므로 다시 throw
    if (error && typeof error === 'object' && 'digest' in error && typeof error.digest === 'string' && error.digest.startsWith('NEXT_REDIRECT')) {
      throw error;
    }

    throw new Error('게시글 수정에 실패했습니다');
  }
}

