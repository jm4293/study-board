import { NextRequest, NextResponse } from "next/server";
import { getDataSource } from "@/config/data-source";
import { UserAccountRepository, UserRepository } from "@/database/repositories";
import { hashPassword } from "@/share/utils/password";

export async function POST(request: NextRequest) {
  const dataSource = await getDataSource();
  const userRepository = new UserRepository(dataSource.manager);
  const userAccountRepository = new UserAccountRepository(dataSource.manager);

  try {
    const body = await request.json();
    const { username, email, password } = body;

    if (!username || !email || !password) {
      return NextResponse.json(
        {
          success: false,
          error: "필수 필드가 누락되었습니다: username, email, password",
        },
        { status: 400 }
      );
    }

    // 이메일 중복 확인
    const existingEmail = await userAccountRepository.findOne({
      where: { email },
    });

    if (existingEmail) {
      return NextResponse.json(
        {
          success: false,
          error: "이미 사용중인 이메일입니다",
        },
        { status: 400 }
      );
    }

    // 사용자명 중복 확인
    const existingUser = await userRepository.findOne({
      where: { username },
    });

    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          error: "이미 사용중인 사용자명입니다",
        },
        { status: 400 }
      );
    }

    // 비밀번호 해싱
    const hashedPassword = await hashPassword(password);

    // 사용자 생성
    const user = userRepository.create({
      username,
      nickname: username,
    });

    const savedUser = await userRepository.save(user);

    // 계정 생성
    const userAccount = userAccountRepository.create({
      userId: savedUser.id,
      email,
      password: hashedPassword,
    });

    await userAccountRepository.save(userAccount);

    return NextResponse.json(
      {
        success: true,
        message: "회원가입이 완료되었습니다",
        data: {
          id: savedUser.id,
          username: savedUser.username,
          email,
        },
      },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: "회원가입에 실패했습니다",
      },
      { status: 500 }
    );
  }
}

