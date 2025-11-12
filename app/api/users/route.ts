import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/src/config/database";
import { User } from "@/src/entities/User";

// GET: 모든 사용자 조회
export async function GET() {
  try {
    const dataSource = await getDatabase();
    const userRepository = dataSource.getRepository(User);

    const users = await userRepository.find();

    return NextResponse.json({
      success: true,
      data: users,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch users",
      },
      { status: 500 }
    );
  }
}

// POST: 새 사용자 생성
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, name, password } = body;

    if (!email || !name || !password) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields: email, name, password",
        },
        { status: 400 }
      );
    }

    const dataSource = await getDatabase();
    const userRepository = dataSource.getRepository(User);

    const user = userRepository.create({
      email,
      name,
      password, // 실제 프로덕션에서는 bcrypt 등으로 암호화 필요
    });

    const savedUser = await userRepository.save(user);

    return NextResponse.json(
      {
        success: true,
        data: savedUser,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to create user",
      },
      { status: 500 }
    );
  }
}
