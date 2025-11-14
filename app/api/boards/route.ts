import { NextRequest, NextResponse } from "next/server";
import { getDataSource } from "@/config/data-source";
import { BoardRepository } from "@/database/repositories";
import { getSession } from "@/share/utils/auth";

export async function GET(request: NextRequest) {
  const dataSource = await getDataSource();
  const boardRepository = new BoardRepository(dataSource.manager);

  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    const [boards, total] = await boardRepository.findAndCount({
      where: {
        isDeleted: false,
      },
      relations: ["user"],
      order: {
        createdAt: "DESC",
      },
      take: limit,
      skip,
    });

    return NextResponse.json(
      {
        success: true,
        data: {
          boards,
          pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
          },
        },
      },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: "게시글 목록을 불러오는데 실패했습니다",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const dataSource = await getDataSource();
  const boardRepository = new BoardRepository(dataSource.manager);

  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json(
        {
          success: false,
          error: "인증이 필요합니다",
        },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { title, content } = body;

    if (!title || !content) {
      return NextResponse.json(
        {
          success: false,
          error: "제목과 내용을 입력해주세요",
        },
        { status: 400 }
      );
    }

    const board = boardRepository.create({
      userId: session.userId,
      title,
      content,
    });

    const savedBoard = await boardRepository.save(board);

    return NextResponse.json(
      {
        success: true,
        message: "게시글이 작성되었습니다",
        data: savedBoard,
      },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: "게시글 작성에 실패했습니다",
      },
      { status: 500 }
    );
  }
}

