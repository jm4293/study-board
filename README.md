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
- Database: `boarddb`
- User: `boarduser`
- Password: `boardpass`
- Root Password: `password`

### 2. Next.js 개발 서버 실행 (로컬)

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev
```

**브라우저에서 접속:** http://localhost:3000

### 3. 환경 변수 설정

`.env.local` 파일 생성:

```env
DATABASE_URL=mysql://root:password@localhost:3308/boarddb
```

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
