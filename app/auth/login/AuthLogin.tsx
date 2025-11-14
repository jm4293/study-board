'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { Button, Card, Input, Link } from '@/component/common';

export default function AuthLogin() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({
    email: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const newErrors = {
      email: '',
      password: '',
    };

    if (!formData.email) {
      newErrors.email = '이메일을 입력해주세요';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = '올바른 이메일 형식이 아닙니다';
    }

    if (!formData.password) {
      newErrors.password = '비밀번호를 입력해주세요';
    } else if (!/^\d+$/.test(formData.password)) {
      newErrors.password = '비밀번호는 숫자만 입력 가능합니다';
    } else if (formData.password.length < 4) {
      newErrors.password = '비밀번호는 최소 4자리 이상이어야 합니다';
    }

    setErrors(newErrors);
    return !newErrors.email && !newErrors.password;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        // 로그인 성공 시 홈으로 이동
        const redirectUrl = new URLSearchParams(window.location.search).get('redirect') || '/home';
        router.push(redirectUrl);
      } else {
        setErrors({
          email: '',
          password: data.error || '로그인에 실패했습니다',
        });
      }
    } catch (error) {
      setErrors({
        email: '',
        password: '로그인에 실패했습니다',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 to-blue-100 px-4 py-12">
      <div className="w-full max-w-md">
        {/* 로고/타이틀 */}
        {/* <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-blue-600 mb-2">Study Board</h1>
          <p className="text-gray-600">로그인하여 시작하세요</p>
        </div> */}

        {/* 로그인 폼 */}
        <Card shadow="lg">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Input
                name="email"
                type="email"
                label="이메일"
                placeholder="email@example.com"
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
                fullWidth
                leftIcon={
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                }
              />
            </div>

            <div>
              <Input
                name="password"
                type="password"
                label="비밀번호"
                placeholder="숫자 4자리 이상"
                value={formData.password}
                onChange={handleChange}
                error={errors.password}
                fullWidth
                leftIcon={
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                <span className="ml-2 text-sm text-gray-600">로그인 상태 유지</span>
              </label>
              <Link href="/auth/forgot-password" variant="primary" className="text-sm">
                비밀번호 찾기
              </Link>
            </div>

            <Button type="submit" variant="primary" size="lg" fullWidth loading={isLoading}>
              로그인
            </Button>
          </form>
        </Card>

        {/* 회원가입 링크 */}
        <div className="text-center mt-6">
          <span className="text-gray-600">아직 계정이 없으신가요? </span>
          <Link href="/auth/register" variant="primary" className="font-semibold">
            회원가입
          </Link>
        </div>
      </div>
    </div>
  );
}
