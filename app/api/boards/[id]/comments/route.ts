import { NextRequest, NextResponse } from 'next/server';
import { IsNull } from 'typeorm';

import { getDataSource } from '@/config/data-source';

import { BoardCommentRepository, BoardRepository } from '@/database/repositories';

import { getSession } from '@/share/utils/auth';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> | { id: string } }) {
  const dataSource = await getDataSource();
  const boardCommentRepository = new BoardCommentRepository(dataSource.manager);

  try {
    const resolvedParams = await Promise.resolve(params);
    const boardId = parseInt(resolvedParams.id);

    if (isNaN(boardId)) {
      return NextResponse.json(
        {
          success: false,
          error: '유효하지 않은 게시글 ID입니다',
        },
        { status: 400 },
      );
    }

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

    return NextResponse.json(
      {
        success: true,
        data: commentsWithReplies,
      },
      { status: 200 },
    );
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: '댓글을 불러오는데 실패했습니다',
      },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> | { id: string } }) {
  const dataSource = await getDataSource();
  const boardRepository = new BoardRepository(dataSource.manager);
  const boardCommentRepository = new BoardCommentRepository(dataSource.manager);

  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json(
        {
          success: false,
          error: '인증이 필요합니다',
        },
        { status: 401 },
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
        { status: 400 },
      );
    }

    // 게시글 존재 확인
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
        { status: 404 },
      );
    }

    const body = await request.json();
    const { content, parentId } = body;

    if (!content || !content.trim()) {
      return NextResponse.json(
        {
          success: false,
          error: '댓글 내용을 입력해주세요',
        },
        { status: 400 },
      );
    }

    // 댓글 생성
    const comment = boardCommentRepository.create({
      boardId,
      userId: session.userId,
      content: content.trim(),
      parentId: parentId || null,
    });

    const savedComment = await boardCommentRepository.save(comment);

    // 게시글 댓글 수 증가
    board.commentCount = (board.commentCount || 0) + 1;
    await boardRepository.save(board);

    // 댓글과 사용자 정보 함께 반환
    const commentWithUser = await boardCommentRepository.findOne({
      where: { id: savedComment.id },
      relations: ['user'],
    });

    return NextResponse.json(
      {
        success: true,
        message: '댓글이 작성되었습니다',
        data: commentWithUser,
      },
      { status: 201 },
    );
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: '댓글 작성에 실패했습니다',
      },
      { status: 500 },
    );
  }
}
