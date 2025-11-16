import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-zinc-950 dark:via-black dark:to-zinc-900">
      {/* Header Section */}
      <header className="sticky top-0 z-50 border-b border-zinc-200/50 bg-white/70 backdrop-blur-md dark:border-zinc-800/50 dark:bg-zinc-900/70">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-indigo-400">
                Board
              </h1>
              <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                자유롭게 소통하고 정보를 공유하세요
              </p>
            </div>
            <Link
              href="/auth/login"
              className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition-all hover:scale-105 hover:shadow-xl hover:shadow-blue-500/30 dark:from-blue-500 dark:to-indigo-500"
            >
              로그인하러 가기
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="mb-6 inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-sm font-medium text-blue-700 dark:border-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
            <span className="mr-2">✨</span>
            Next.js 기반 게시판 프로젝트
          </div>
          <h2 className="text-6xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-7xl lg:text-8xl">
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent dark:from-blue-400 dark:via-indigo-400 dark:to-purple-400">
              Board
            </span>
          </h2>
          <p className="mx-auto mt-8 max-w-2xl text-xl leading-8 text-zinc-600 dark:text-zinc-400 sm:text-2xl">
            다양한 주제로 자유롭게 글을 작성하고
            <br className="hidden sm:block" />
            <span className="text-blue-600 dark:text-blue-400"> 다른 사람들과 공유</span>해보세요
          </p>
          <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/home"
              className="group rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-4 text-base font-semibold text-white shadow-xl shadow-blue-500/25 transition-all hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/40 dark:from-blue-500 dark:to-indigo-500"
            >
              게시판 둘러보기
              <span className="ml-2 inline-block transition-transform group-hover:translate-x-1">
                →
              </span>
            </Link>
            <Link
              href="/auth/register"
              className="rounded-xl border-2 border-zinc-300 bg-white px-8 py-4 text-base font-semibold text-zinc-700 transition-all hover:border-blue-500 hover:bg-blue-50 hover:text-blue-600 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:border-blue-400 dark:hover:bg-blue-950/30 dark:hover:text-blue-400"
            >
              회원가입
            </Link>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-32 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <div className="group relative overflow-hidden rounded-2xl border border-zinc-200 bg-white/50 p-8 backdrop-blur-sm transition-all hover:scale-105 hover:border-blue-300 hover:shadow-xl hover:shadow-blue-500/10 dark:border-zinc-800 dark:bg-zinc-900/50 dark:hover:border-blue-700">
            <div className="mb-4 text-4xl">📝</div>
            <h3 className="mb-2 text-xl font-bold text-zinc-900 dark:text-zinc-50">
              자유로운 글 작성
            </h3>
            <p className="text-zinc-600 dark:text-zinc-400">
              다양한 주제로 자유롭게 글을 작성하고 공유할 수 있습니다
            </p>
          </div>

          <div className="group relative overflow-hidden rounded-2xl border border-zinc-200 bg-white/50 p-8 backdrop-blur-sm transition-all hover:scale-105 hover:border-blue-300 hover:shadow-xl hover:shadow-blue-500/10 dark:border-zinc-800 dark:bg-zinc-900/50 dark:hover:border-blue-700">
            <div className="mb-4 text-4xl">💬</div>
            <h3 className="mb-2 text-xl font-bold text-zinc-900 dark:text-zinc-50">
              활발한 소통
            </h3>
            <p className="text-zinc-600 dark:text-zinc-400">
              댓글과 좋아요를 통해 다른 사용자들과 소통하세요
            </p>
          </div>

          <div className="group relative overflow-hidden rounded-2xl border border-zinc-200 bg-white/50 p-8 backdrop-blur-sm transition-all hover:scale-105 hover:border-blue-300 hover:shadow-xl hover:shadow-blue-500/10 dark:border-zinc-800 dark:bg-zinc-900/50 dark:hover:border-blue-700 sm:col-span-2 lg:col-span-1">
            <div className="mb-4 text-4xl">🔍</div>
            <h3 className="mb-2 text-xl font-bold text-zinc-900 dark:text-zinc-50">
              빠른 검색
            </h3>
            <p className="text-zinc-600 dark:text-zinc-400">
              제목과 내용으로 원하는 게시글을 빠르게 찾아보세요
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-200/50 bg-white/50 py-8 backdrop-blur-sm dark:border-zinc-800/50 dark:bg-zinc-900/50">
        <div className="mx-auto max-w-7xl px-4 text-center text-sm text-zinc-600 dark:text-zinc-400 sm:px-6 lg:px-8">
          <p>© 2024 게시판 프로젝트. Next.js로 만들어졌습니다.</p>
        </div>
      </footer>
    </div>
  )
}
