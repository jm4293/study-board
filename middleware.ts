import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const session = request.cookies.get('session');
  const pathname = request.nextUrl.pathname;

  // 인증이 필요한 경로 (현재 없음)
  const protectedPaths: string[] = [];

  // 게시글 작성/수정 경로는 인증 필요
  const isBoardWritePath =
    pathname === '/board/write' || (pathname.startsWith('/board/') && pathname.endsWith('/edit'));

  // 현재 경로가 보호된 경로인지 확인
  const isProtectedPath = protectedPaths.some((path) => pathname.startsWith(path)) || isBoardWritePath;

  // 보호된 경로이고 세션이 없으면 로그인 페이지로 리다이렉트
  if (isProtectedPath && !session) {
    const loginUrl = new URL('/auth/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 로그인/회원가입 페이지에 이미 로그인된 사용자가 접근하면 홈으로 리다이렉트
  if ((pathname === '/auth/login' || pathname === '/auth/register') && session) {
    return NextResponse.redirect(new URL('/home', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
