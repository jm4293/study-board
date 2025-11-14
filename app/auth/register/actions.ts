'use server';

import { redirect } from 'next/navigation';

import { getDataSource } from '@/config/data-source';

import { UserAccountRepository, UserRepository } from '@/database/repositories';

import { hashPassword } from '@/share/utils/password';

export async function registerUser(formData: FormData) {
  const username = formData.get('username') as string;
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const passwordConfirm = formData.get('passwordConfirm') as string;

  if (!username || !username.trim()) {
    throw new Error('이름을 입력해주세요');
  }

  if (username.trim().length < 2) {
    throw new Error('이름은 최소 2자 이상이어야 합니다');
  }

  if (!email || !email.trim()) {
    throw new Error('이메일을 입력해주세요');
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error('올바른 이메일 형식이 아닙니다');
  }

  if (!password || !password.trim()) {
    throw new Error('비밀번호를 입력해주세요');
  }

  if (!/^\d+$/.test(password)) {
    throw new Error('비밀번호는 숫자만 입력 가능합니다');
  }

  if (password.length < 4) {
    throw new Error('비밀번호는 최소 4자리 이상이어야 합니다');
  }

  if (!passwordConfirm || password !== passwordConfirm) {
    throw new Error('비밀번호가 일치하지 않습니다');
  }

  const agreeTerms = formData.get('agreeTerms');
  if (!agreeTerms) {
    throw new Error('이용약관에 동의해주세요');
  }

  try {
    const dataSource = await getDataSource();
    const userRepository = new UserRepository(dataSource.manager);
    const userAccountRepository = new UserAccountRepository(dataSource.manager);

    // 이메일 중복 확인
    const existingEmail = await userAccountRepository.findOne({
      where: { email },
    });

    if (existingEmail) {
      throw new Error('이미 사용중인 이메일입니다');
    }

    // 사용자명 중복 확인
    const existingUser = await userRepository.findOne({
      where: { username },
    });

    if (existingUser) {
      throw new Error('이미 사용중인 사용자명입니다');
    }

    // 비밀번호 해싱
    const hashedPassword = await hashPassword(password);

    // 사용자 생성
    const user = userRepository.create({
      username: username.trim(),
      nickname: username.trim(),
    });

    const savedUser = await userRepository.save(user);

    // 계정 생성
    const userAccount = userAccountRepository.create({
      userId: savedUser.id,
      email: email.trim(),
      password: hashedPassword,
    });

    await userAccountRepository.save(userAccount);

    redirect('/auth/login');
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

    throw error;
  }
}
