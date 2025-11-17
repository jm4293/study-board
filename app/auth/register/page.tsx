"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import SubmitButton from "@/component/common/SubmitButton";
import Image from "next/image";
import InputField from "@/component/common/InputField";

export default function AuthRegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [nickname, setNickname] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [emailCheckStatus, setEmailCheckStatus] = useState<"success" | "error" | null>(null);
  const router = useRouter();

  // 회원가입 제출
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitting) return;
    setErrorMessage("");
    setIsSubmitting(true);
    try {
      if (!email || !password || !username || !nickname) {
        setErrorMessage("All fields are required.");
        setIsSubmitting(false);
        return;
      }
      const res = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, username, nickname }),
      });
      const data: { success?: boolean; error?: string } = await res.json();
      if (!res.ok || !data?.success) {
        setErrorMessage(data?.error ?? "Failed to sign up");
        setIsSubmitting(false);
        return;
      }
      router.push("/auth/login");
    } catch (_err) {
      setErrorMessage("Failed to sign up");
      setIsSubmitting(false);
    }
  };

  // 이메일 중복 확인
  const handleCheckEmail = async () => {
    if (!email) {
      setErrorMessage("이메일을 입력해주세요.");
      return;
    }

    const res = await fetch("/api/signup/check-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    if (res.status === 409) {
      setEmailCheckStatus("error");
    } else if (res.status === 200) {
      setEmailCheckStatus("success");
    }
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-zinc-950 dark:via-black dark:to-zinc-900">
      <div className="flex min-h-screen">
        {/* Left Section - Marketing/Info */}
        <div className="hidden w-1/2 items-center justify-center bg-gradient-to-br from-blue-600 to-indigo-700 p-12 text-white lg:flex">
          <div className="text-center">
            <h1 className="text-5xl font-bold leading-tight">
              Fast, Efficient and Productive
            </h1>
            <p className="mt-6 text-lg text-blue-100">
              다양한 주제로 자유롭게 글을 작성하고
              <br />
              다른 사람들과 소통해보세요
            </p>
          </div>
        </div>

        {/* Right Section - Sign Up Form */}
        <div className="flex w-full items-center justify-center bg-white p-8 lg:w-1/2 dark:bg-zinc-900">
          <div className="w-full max-w-md">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
                Sign Up
              </h2>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                Your Board Account
              </p>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
              {/* Email Field */}
              <div>
                <InputField
                  id="email"
                  name="email"
                  label="Email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                  rightSlot={
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:bg-blue-500 dark:hover:bg-blue-600"
                      onClick={handleCheckEmail}
                    >
                      중복 확인
                    </button>
                  }
                />
                {emailCheckStatus && (
                  <p
                    className={`mt-1.5 text-xs ${emailCheckStatus === "success"
                      ? "text-green-600 dark:text-green-400"
                      : "text-red-600 dark:text-red-400"
                      }`}
                  >
                    {emailCheckStatus === "success" ? "사용 가능한 이메일입니다." : "사용 불가능한 이메일입니다."}
                  </p>
                )}
              </div>

              {/* Password Field */}
              <InputField
                id="password"
                name="password"
                label="Password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                rightSlot={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
                  >
                    {showPassword ? (
                      <Image src="/eye-off.svg" alt="Hide password" width={20} height={20} className="h-5 w-5" />
                    ) : (
                      <Image src="/eye.svg" alt="Show password" width={20} height={20} className="h-5 w-5" />
                    )}
                  </button>
                }
              />
              <p className="mt-1.5 text-xs text-zinc-500 dark:text-zinc-400">
                Use 8 or more characters with a mix of letters, numbers & symbols.
              </p>

              {/* Username Field */}
              <InputField
                id="username"
                name="username"
                label="Username"
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />

              {/* Nickname Field */}
              <InputField
                id="nickname"
                name="nickname"
                label="Nickname"
                type="text"
                placeholder="Enter your nickname"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
              />

              {errorMessage && (
                <p className="text-sm text-red-600 dark:text-red-400">{errorMessage}</p>
              )}

              {/* Sign Up Button */}
              <SubmitButton isSubmitting={isSubmitting} loading="Signing Up...">
                Sign Up
              </SubmitButton>
            </form>

            {/* Login Link */}
            <p className="mt-6 text-center text-sm text-zinc-600 dark:text-zinc-400">
              Already have an account?{" "}
              <Link href="/auth/login" className="font-medium text-blue-600 hover:underline dark:text-blue-400">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

