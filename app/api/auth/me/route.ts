import { NextResponse } from "next/server";
import { getSession } from "@/share/utils/auth";

export async function GET() {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json(
        {
          success: false,
          error: "인증되지 않은 사용자입니다",
        },
        { status: 401 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: session,
      },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: "세션 조회에 실패했습니다",
      },
      { status: 500 }
    );
  }
}

