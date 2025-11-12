# 📚 Study Board

Next.js와 TypeORM을 활용한 게시판 학습 프로젝트입니다.

## 프로젝트 소개

이 프로젝트는 **Next.js 16 + TypeORM + MySQL**을 사용하여 구현된 게시판 애플리케이션입니다.
실무에서 자주 사용되는 기술 스택과 패턴을 학습하기 위한 목적으로 제작되었습니다.

### 🛠️ 기술 스택

- **Frontend**: Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: MySQL 8.0
- **ORM**: TypeORM
- **Container**: Docker & Docker Compose

### ✨ 주요 기능

- **사용자 관리**
  - 사용자 등록 및 프로필 관리
  - 사용자 상태 관리 (활성/비활성/정지)
  - 사용자 방문 기록 추적

- **게시판 기능**
  - 다양한 게시판 타입 지원 (일반, 공지, Q&A, 갤러리)
  - 게시글 작성/수정/삭제 (Soft Delete)
  - 조회수, 좋아요 수 집계
  - 전문 검색 (Full-text Search) 지원

- **댓글 시스템**
  - 게시글 댓글 작성
  - 대댓글 (중첩 댓글) 지원
  - 좋아요 기능
  - Soft Delete 지원

- **이미지 관리**
  - 게시글 이미지 첨부
  - 다중 이미지 업로드 지원

### 📁 프로젝트 구조

```
study-board/
├── app/                    # Next.js App Router
│   ├── api/               # API 라우트
│   └── page.tsx           # 페이지 컴포넌트
├── database/              # 데이터베이스 관련
│   ├── entities/         # TypeORM 엔티티
│   └── repositories/     # 커스텀 레포지토리
├── config/               # 설정 파일
├── docs/                 # 문서
└── public/               # 정적 파일
```

---

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## 🚀 Quick Start

### 1. MySQL 실행 (Docker)

```bash
# Docker Compose로 MySQL만 실행
docker-compose up -d

# 중지
docker-compose down
```

**MySQL 접속 정보:**

- Host: `localhost`
- Port: `3308`
- Database: `app`
- User: `user`
- Password: `password`

### 2. Next.js 개발 서버 실행 (로컬)

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev
```

**브라우저에서 접속:** http://localhost:3000

### 3. 환경 변수 설정

`.env.local` 파일 생성

---

## 개발 정보

- `app/page.tsx` 파일을 수정하면 페이지가 자동으로 업데이트됩니다.
- 이 프로젝트는 [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts)를 사용하여 [Geist](https://vercel.com/font) 폰트를 자동으로 최적화합니다.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
