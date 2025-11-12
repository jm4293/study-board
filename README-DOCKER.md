# Docker 환경 설정 가이드

## 필수 조건

- Docker 설치
- Docker Compose 설치

## 사용 방법

### 1. 환경 변수 설정

```bash
cp .env.example .env
```

### 2. Docker 컨테이너 시작

```bash
docker-compose up -d
```

### 3. 로그 확인

```bash
docker-compose logs -f
```

### 4. 컨테이너 중지

```bash
docker-compose down
```

### 5. 데이터베이스 포함 전체 삭제

```bash
docker-compose down -v
```

## 서비스 접속

- **Next.js 앱**: http://localhost:3000
- **MySQL**: localhost:3306
  - Root 비밀번호: `password`
  - 데이터베이스: `boarddb`
  - 사용자: `boarduser`
  - 비밀번호: `boardpass`

## MySQL 접속 방법

### 컨테이너 내부에서 접속

```bash
docker-compose exec mysql mysql -u root -p
# 비밀번호: password
```

### 호스트에서 접속

```bash
mysql -h 127.0.0.1 -P 3306 -u root -p
# 비밀번호: password
```

## 유용한 명령어

### 컨테이너 상태 확인

```bash
docker-compose ps
```

### Next.js 컨테이너 재시작

```bash
docker-compose restart nextapp
```

### MySQL 컨테이너 재시작

```bash
docker-compose restart mysql
```

### 컨테이너 로그 확인

```bash
# 전체 로그
docker-compose logs

# 특정 서비스 로그
docker-compose logs nextapp
docker-compose logs mysql
```

## 프로덕션 빌드

프로덕션 환경을 위해 Dockerfile을 수정하세요:

```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV production
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
EXPOSE 3000
CMD ["node", "server.js"]
```

## 문제 해결

### 포트 충돌

포트가 이미 사용 중인 경우 `docker-compose.yml`에서 포트를 변경하세요:

```yaml
ports:
  - "3001:3000" # Next.js
  - "3307:3306" # MySQL
```

### 데이터베이스 초기화

```bash
docker-compose down -v
docker-compose up -d
```
