import crypto from 'crypto';
import { NextRequest, NextResponse } from 'next/server';

import { getDataSource } from '@/config/data-source';

import { UserAccountRepository, UserRepository } from '@/database/repositories';

function hashPasswordWithScrypt(plain: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const derivedKey = crypto.scryptSync(plain, salt, 64);
  return `${salt}:${derivedKey.toString('hex')}`;
}

export async function POST(request: NextRequest) {
  const dataSource = await getDataSource();
  const userRepository = new UserRepository(dataSource.manager);
  const userAccountRepository = new UserAccountRepository(dataSource.manager);

  try {
    const body = await request.json();
    const { username, nickname, email, password } = body;

    if (!username || !nickname || !email || !password) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields: username, nickname, email, password',
        },
        { status: 400 },
      );
    }

    // 이메일 중복 확인
    const existingEmail = await userAccountRepository.findOne({ where: { email } });
    if (existingEmail) {
      return NextResponse.json(
        {
          success: false,
          error: 'Email already exists',
        },
        { status: 400 },
      );
    }

    // 사용자 생성
    const user = userRepository.create({
      username,
      nickname,
    });

    const savedUser = await userRepository.save(user);

    const userAccount = userAccountRepository.create({
      userId: savedUser.id,
      email,
      password: hashPasswordWithScrypt(password),
    });

    await userAccountRepository.save(userAccount);

    return NextResponse.json(
      {
        success: true,
        data: savedUser,
      },
      { status: 201 },
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create user',
      },
      { status: 500 },
    );
  }
}
