import { NextRequest, NextResponse } from 'next/server';

import { getDataSource } from '@/config/data-source';

import { UserAccountRepository } from '@/database/repositories';

import { createSession } from '@/share/utils/auth';
import { comparePassword } from '@/share/utils/password';

export async function POST(request: NextRequest) {
  const dataSource = await getDataSource();
  const userAccountRepository = new UserAccountRepository(dataSource.manager);

  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        {
          success: false,
          error: '이메일과 비밀번호를 입력해주세요',
        },
        { status: 400 },
      );
    }

    // 계정 조회 (관계 포함)
    const userAccount = await userAccountRepository.findOne({
      where: { email },
      relations: ['user'],
    });

    if (!userAccount || !userAccount.password) {
      return NextResponse.json(
        {
          success: false,
          error: '이메일 또는 비밀번호가 올바르지 않습니다',
        },
        { status: 401 },
      );
    }

    // 비밀번호 확인
    const isPasswordValid = await comparePassword(password, userAccount.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        {
          success: false,
          error: '이메일 또는 비밀번호가 올바르지 않습니다',
        },
        { status: 401 },
      );
    }

    // 로그인 정보 업데이트
    userAccount.lastLoginAt = new Date();
    userAccount.loginCount = (userAccount.loginCount || 0) + 1;
    await userAccountRepository.save(userAccount);

    // 세션 생성
    await createSession({
      userId: userAccount.userId,
      username: userAccount.user.username,
      email: userAccount.email || '',
    });

    return NextResponse.json(
      {
        success: true,
        message: '로그인에 성공했습니다',
        data: {
          userId: userAccount.userId,
          username: userAccount.user.username,
          email: userAccount.email,
        },
      },
      { status: 200 },
    );
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: '로그인에 실패했습니다',
      },
      { status: 500 },
    );
  }
}
