"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Input, Card, Link } from "@/component/common";

export default function AuthRegister() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    passwordConfirm: "",
  });
  const [errors, setErrors] = useState({
    username: "",
    email: "",
    password: "",
    passwordConfirm: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors = {
      username: "",
      email: "",
      password: "",
      passwordConfirm: "",
    };

    if (!formData.username) {
      newErrors.username = "이름을 입력해주세요";
    } else if (formData.username.length < 2) {
      newErrors.username = "이름은 최소 2자 이상이어야 합니다";
    }

    if (!formData.email) {
      newErrors.email = "이메일을 입력해주세요";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "올바른 이메일 형식이 아닙니다";
    }

    if (!formData.password) {
      newErrors.password = "비밀번호를 입력해주세요";
    } else if (formData.password.length < 8) {
      newErrors.password = "비밀번호는 최소 8자 이상이어야 합니다";
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = "비밀번호는 대소문자와 숫자를 포함해야 합니다";
    }

    if (!formData.passwordConfirm) {
      newErrors.passwordConfirm = "비밀번호 확인을 입력해주세요";
    } else if (formData.password !== formData.passwordConfirm) {
      newErrors.passwordConfirm = "비밀번호가 일치하지 않습니다";
    }

    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error !== "");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!agreeTerms) {
      alert("이용약관에 동의해주세요");
      return;
    }

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // TODO: API 호출
      // API call here

      // 임시: 회원가입 성공 시 로그인 페이지로 이동
      setTimeout(() => {
        router.push("/auth/login");
      }, 1000);
    } catch {
      // Error handling
      setErrors({
        username: "",
        email: "이미 사용중인 이메일입니다",
        password: "",
        passwordConfirm: "",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 to-blue-100 px-4 py-12">
      <div className="w-full max-w-md">
        {/* 로고/타이틀 */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-blue-600 mb-2">Study Board</h1>
          <p className="text-gray-600">새로운 계정을 만들어보세요</p>
        </div>

        {/* 회원가입 폼 */}
        <Card shadow="lg">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <Input
                name="username"
                type="text"
                label="이름"
                placeholder="홍길동"
                value={formData.username}
                onChange={handleChange}
                error={errors.username}
                fullWidth
                leftIcon={
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                      clipRule="evenodd"
                    />
                  </svg>
                }
              />
            </div>

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
                placeholder="8자 이상, 대소문자와 숫자 포함"
                value={formData.password}
                onChange={handleChange}
                error={errors.password}
                helperText="대소문자와 숫자를 포함하여 8자 이상 입력하세요"
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

            <div>
              <Input
                name="passwordConfirm"
                type="password"
                label="비밀번호 확인"
                placeholder="비밀번호를 다시 입력하세요"
                value={formData.passwordConfirm}
                onChange={handleChange}
                error={errors.passwordConfirm}
                fullWidth
                leftIcon={
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                }
              />
            </div>

            {/* 약관 동의 */}
            <div className="space-y-3">
              <label className="flex items-start">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">
                  <Link href="/terms" variant="primary" className="font-medium">
                    이용약관
                  </Link>{" "}
                  및{" "}
                  <Link href="/privacy" variant="primary" className="font-medium">
                    개인정보처리방침
                  </Link>
                  에 동의합니다 <span className="text-red-500">*</span>
                </span>
              </label>
            </div>

            <Button type="submit" variant="primary" size="lg" fullWidth loading={isLoading} disabled={!agreeTerms}>
              회원가입
            </Button>
          </form>
        </Card>

        {/* 로그인 링크 */}
        <div className="text-center mt-6">
          <span className="text-gray-600">이미 계정이 있으신가요? </span>
          <Link href="/auth/login" variant="primary" className="font-semibold">
            로그인
          </Link>
        </div>
      </div>
    </div>
  );
}
