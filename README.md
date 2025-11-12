This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## 🚀 Quick Start (Docker)

**Docker를 사용한 빠른 시작 방법:**

```bash
# 1. 저장소 클론
git clone <repository-url>
cd board

# 2. 환경 변수 설정
cp .env.example .env

# 3. Docker Compose 실행
docker-compose up -d

# 4. 브라우저에서 접속
# http://localhost:3000
```

**서비스 구성:**

- Next.js App: http://localhost:3000
- MySQL 8.0.35: localhost:3306

**중지 방법:**

```bash
docker-compose down
```

자세한 Docker 사용법은 [README-DOCKER.md](./README-DOCKER.md)를 참조하세요.

---

## Getting Started (로컬 개발)

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
