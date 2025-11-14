import { NextRequest, NextResponse } from 'next/server';
import { getDataSource } from '@/config/data-source';
import { BoardRepository } from '@/database/repositories';
import { getSession } from '@/share/utils/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  const dataSource = await getDataSource();
  const boardRepository = new BoardRepository(dataSource.manager);

  try {
    const resolvedParams = await Promise.resolve(params);
    const boardId = parseInt(resolvedParams.id);

    if (isNaN(boardId)) {
      return NextResponse.json(
        {
          success: false,
          error: '유효하지 않은 게시글 ID입니다',
        },
        { status: 400 }
      );
    }

    const board = await boardRepository.findOne({
      where: {
        id: boardId,
        isDeleted: false,
      },
      relations: ['user'],
    });

    if (!board) {
      return NextResponse.json(
        {
          success: false,
          error: '게시글을 찾을 수 없습니다',
        },
        { status: 404 }
      );
    }

    // 조회수 증가
    board.viewCount = (board.viewCount || 0) + 1;
    await boardRepository.save(board);

    return NextResponse.json(
      {
        success: true,
        data: board,
      },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: '게시글을 불러오는데 실패했습니다',
      },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  const dataSource = await getDataSource();
  const boardRepository = new BoardRepository(dataSource.manager);

  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json(
        {
          success: false,
          error: '인증이 필요합니다',
        },
        { status: 401 }
      );
    }

    const resolvedParams = await Promise.resolve(params);
    const boardId = parseInt(resolvedParams.id);

    if (isNaN(boardId)) {
      return NextResponse.json(
        {
          success: false,
          error: '유효하지 않은 게시글 ID입니다',
        },
        { status: 400 }
      );
    }

    const board = await boardRepository.findOne({
      where: {
        id: boardId,
        isDeleted: false,
      },
    });

    if (!board) {
      return NextResponse.json(
        {
          success: false,
          error: '게시글을 찾을 수 없습니다',
        },
        { status: 404 }
      );
    }

    if (board.userId !== session.userId) {
      return NextResponse.json(
        {
          success: false,
          error: '수정 권한이 없습니다',
        },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { title, content } = body;

    if (title) board.title = title;
    if (content) board.content = content;

    const updatedBoard = await boardRepository.save(board);

    return NextResponse.json(
      {
        success: true,
        message: '게시글이 수정되었습니다',
        data: updatedBoard,
      },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: '게시글 수정에 실패했습니다',
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  const dataSource = await getDataSource();
  const boardRepository = new BoardRepository(dataSource.manager);

  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json(
        {
          success: false,
          error: '인증이 필요합니다',
        },
        { status: 401 }
      );
    }

    const resolvedParams = await Promise.resolve(params);
    const boardId = parseInt(resolvedParams.id);

    if (isNaN(boardId)) {
      return NextResponse.json(
        {
          success: false,
          error: '유효하지 않은 게시글 ID입니다',
        },
        { status: 400 }
      );
    }

    const board = await boardRepository.findOne({
      where: {
        id: boardId,
        isDeleted: false,
      },
    });

    if (!board) {
      return NextResponse.json(
        {
          success: false,
          error: '게시글을 찾을 수 없습니다',
        },
        { status: 404 }
      );
    }

    if (board.userId !== session.userId) {
      return NextResponse.json(
        {
          success: false,
          error: '삭제 권한이 없습니다',
        },
        { status: 403 }
      );
    }

    board.isDeleted = true;
    board.deletedAt = new Date();
    await boardRepository.save(board);

    return NextResponse.json(
      {
        success: true,
        message: '게시글이 삭제되었습니다',
      },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: '게시글 삭제에 실패했습니다',
      },
      { status: 500 }
    );
  }
}

