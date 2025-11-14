import { NextResponse } from "next/server";
import { deleteSession } from "@/share/utils/auth";

export async function POST() {
  try {
    await deleteSession();

    return NextResponse.json(
      {
        success: true,
        message: "로그아웃되었습니다",
      },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: "로그아웃에 실패했습니다",
      },
      { status: 500 }
    );
  }
}

