import crypto from 'crypto';
import { NextRequest, NextResponse } from 'next/server';

import { getDataSource } from '@/config/data-source';

import { UserAccountRepository, UserRepository } from '@/database/repositories';

interface LoginRequestBody {
  email: string;
  password: string;
}

interface LoginResponseData {
  id: number;
  email: string;
  username: string;
  nickname: string | null;
}

function verifyPasswordScrypt(stored: string, input: string): boolean {
  if (!stored.includes(':')) {
    return stored === input;
  }
  const [salt, hash] = stored.split(':');
  const derived = crypto.scryptSync(input, salt, 64).toString('hex');
  return crypto.timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(derived, 'hex'));
}

export async function POST(request: NextRequest) {
  const dataSource = await getDataSource();
  const userRepository = new UserRepository(dataSource.manager);
  const userAccountRepository = new UserAccountRepository(dataSource.manager);

  try {
    const body = (await request.json()) as Partial<LoginRequestBody>;
    const email = body.email?.trim() ?? '';
    const password = body.password ?? '';

    if (!email || !password) {
      return NextResponse.json({ success: false, error: 'Missing required fields: email, password' }, { status: 400 });
    }

    const account = await userAccountRepository.findOne({ where: { email } });
    if (!account || !account.userId || !account.password) {
      return NextResponse.json({ success: false, error: 'Invalid credentials' }, { status: 401 });
    }

    const isValid = verifyPasswordScrypt(account.password, password);
    if (!isValid) {
      return NextResponse.json({ success: false, error: 'Invalid credentials' }, { status: 401 });
    }

    // Update login metadata
    account.lastLoginAt = new Date();
    account.loginCount = (account.loginCount ?? 0) + 1;
    await userAccountRepository.save(account);

    const user = await userRepository.findOne({ where: { id: account.userId } });
    if (!user) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }

    const data: LoginResponseData = {
      id: user.id,
      email: account.email ?? '',
      username: user.username,
      nickname: user.nickname,
    };

    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (_error) {
    return NextResponse.json({ success: false, error: 'Failed to login' }, { status: 500 });
  }
}
