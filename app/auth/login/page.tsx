"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import SubmitButton from "@/component/common/SubmitButton";

export default function AuthLoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const router = useRouter();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitting) return;
    setErrorMessage("");
    setIsSubmitting(true);
    try {
      if (!email || !password) {
        setErrorMessage("Email and password are required.");
        setIsSubmitting(false);
        return;
      }
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });
      if (result?.ok) {
        router.push("/"); // or "/(main)/home"
        return;
      }
      setErrorMessage(result?.error ?? "Invalid credentials");
      setIsSubmitting(false);
    } catch (_err) {
      setErrorMessage("Failed to sign in");
      setIsSubmitting(false);
    }
  };

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

        {/* Right Section - Sign In Form */}
        <div className="flex w-full items-center justify-center bg-white p-8 lg:w-1/2 dark:bg-zinc-900">
          <div className="w-full max-w-md">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
                Sign In
              </h2>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                Your Board Account
              </p>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
              {/* Email Field */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="mt-2 w-full rounded-lg border border-zinc-300 bg-white px-4 py-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50 dark:focus:border-blue-400"
                  placeholder="your.email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              {/* Password Field */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
                >
                  Password
                </label>
                <div className="relative mt-2">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-3 pr-10 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50 dark:focus:border-blue-400"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
                  >
                    {showPassword ? (
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.007m0 0L21 21"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="remember"
                    className="h-4 w-4 rounded border-zinc-300 text-blue-600 focus:ring-blue-500 dark:border-zinc-700"
                  />
                  <label htmlFor="remember" className="ml-2 text-sm text-zinc-700 dark:text-zinc-300">
                    Remember me
                  </label>
                </div>
                <Link
                  href="/auth/forgot-password"
                  className="text-sm text-blue-600 hover:underline dark:text-blue-400"
                >
                  Forgot password?
                </Link>
              </div>

              {errorMessage && (
                <p className="text-sm text-red-600 dark:text-red-400">{errorMessage}</p>
              )}

              {/* Sign In Button */}
              <SubmitButton isSubmitting={isSubmitting} loading="Signing In...">
                Sign In
              </SubmitButton>
            </form>

            {/* Sign Up Link */}
            <p className="mt-6 text-center text-sm text-zinc-600 dark:text-zinc-400">
              Don&apos;t have an account?{" "}
              <Link href="/auth/register" className="font-medium text-blue-600 hover:underline dark:text-blue-400">
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
