'use server';

import { redirect } from 'next/navigation';

import { getDataSource } from '@/config/data-source';

import { UserAccountRepository } from '@/database/repositories';

import { createSession } from '@/share/utils/auth';
import { comparePassword } from '@/share/utils/password';

export interface FormState {
  error?: string;
}

export async function loginUser(prevState: FormState | null, formData: FormData): Promise<FormState> {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !email.trim()) {
    return {
      error: '이메일을 입력해주세요',
    };
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return {
      error: '올바른 이메일 형식이 아닙니다',
    };
  }

  if (!password || !password.trim()) {
    return {
      error: '비밀번호를 입력해주세요',
    };
  }

  if (!/^\d+$/.test(password)) {
    return {
      error: '비밀번호는 숫자만 입력 가능합니다',
    };
  }

  if (password.length < 4) {
    return {
      error: '비밀번호는 최소 4자리 이상이어야 합니다',
    };
  }

  try {
    const dataSource = await getDataSource();
    const userAccountRepository = new UserAccountRepository(dataSource.manager);

    // 계정 조회 (관계 포함)
    const userAccount = await userAccountRepository.findOne({
      where: { email },
      relations: ['user'],
    });

    if (!userAccount || !userAccount.password) {
      return {
        error: '이메일 또는 비밀번호가 올바르지 않습니다',
      };
    }

    // 비밀번호 확인
    const isPasswordValid = await comparePassword(password, userAccount.password);

    if (!isPasswordValid) {
      return {
        error: '이메일 또는 비밀번호가 올바르지 않습니다',
      };
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

    redirect('/home');
  } catch (error) {
    // redirect()는 NEXT_REDIRECT 에러를 throw하는데, 이것은 정상 동작이므로 다시 throw
    if (
      error &&
      typeof error === 'object' &&
      'digest' in error &&
      typeof error.digest === 'string' &&
      error.digest.startsWith('NEXT_REDIRECT')
    ) {
      throw error;
    }

    const errorMessage = error instanceof Error ? error.message : '로그인에 실패했습니다';
    return {
      error: errorMessage,
    };
  }
}
