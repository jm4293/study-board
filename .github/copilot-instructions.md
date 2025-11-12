# AI Coding Rules & Guidelines

## 프로젝트 개요

- **Stack**: Next.js 16, TypeScript, TypeORM, MySQL, Tailwind CSS
- **구조**: App Router 기반 Next.js 프로젝트
- **데이터베이스**: TypeORM을 사용한 MySQL 연결

## 코딩 스타일

### TypeScript

- **타입 안정성**: `any` 사용 금지, 명시적 타입 정의 필수
- **Null 처리**: `null`과 `undefined`를 명확히 구분
- **인터페이스**: 엔티티와 별도로 DTO/Request/Response 타입 정의

### 네이밍 컨벤션

- **파일명**: kebab-case (예: `user-repository.ts`)
- **클래스**: PascalCase (예: `UserRepository`)
- **함수/변수**: camelCase (예: `getUserById`)
- **상수**: UPPER_SNAKE_CASE (예: `MAX_RETRY_COUNT`)
- **Enum**: PascalCase (예: `UserStatus`)

## 프로젝트 구조 규칙

### 폴더 구조

```
app/              # Next.js App Router (페이지, 레이아웃, API 라우트)
  api/            # API 라우트
component/        # React 컴포넌트
config/           # 설정 파일 (데이터베이스 연결 등)
database/
  entities/       # TypeORM 엔티티
  repositories/   # 커스텀 레포지토리
public/           # 정적 파일
service/          # 비즈니스 로직 서비스 레이어
share/            # 공유 리소스
  const/          # 상수 정의
  enum/           # Enum 정의
```

### TypeORM 규칙

#### 엔티티 작성

- 파일명: PascalCase (예: `User.ts`, `BoardComment.ts`)
- 데코레이터 순서:
  1. `@Entity()`
  2. `@Index()` (필요시)
  3. `@PrimaryGeneratedColumn()`
  4. `@Column()`
  5. `@CreateDateColumn()` / `@UpdateDateColumn()`
  6. `@ManyToOne()` / `@OneToMany()` 등 관계
- 컬럼 타입 명시: `type`, `length`, `nullable` 등 명확히 정의
- snake_case DB 컬럼명에 camelCase 매핑: `name: "profile_image"`
- Enum 사용 시 별도 export

#### 레포지토리 작성

- 파일명: `{Entity}Repository.ts`
- 커스텀 레포지토리는 TypeORM Repository 상속
- 복잡한 쿼리는 QueryBuilder 사용
- 트랜잭션이 필요한 작업은 명시적으로 처리

### API 라우트 규칙

- 파일 위치: `app/api/{resource}/route.ts`
- HTTP 메서드별 함수: `GET`, `POST`, `PUT`, `PATCH`, `DELETE`
- 응답 형식:
  ```typescript
  return Response.json({ data, message }, { status: 200 });
  ```
- 에러 처리:
  ```typescript
  return Response.json({ error: message }, { status: 400 });
  ```

### 컴포넌트 규칙

- Server Component 기본, Client Component는 `"use client"` 명시
- Props 인터페이스는 컴포넌트 위에 정의
- 스타일: Tailwind CSS 사용, 인라인 클래스 작성

## 데이터베이스 규칙

- 테이블명: PascalCase (TypeORM 엔티티명과 동일)
- 컬럼명: snake_case
- Primary Key: `id` (bigint, auto_increment)
- 타임스탬프: `created_at`, `updated_at` 필수
- 인덱스: 검색/조인이 빈번한 컬럼에 설정

## 주의사항

- **비동기 처리**: async/await 사용, Promise 체이닝 지양
- **에러 핸들링**: try-catch 블록 필수, 의미 있는 에러 메시지
- **보안**: 환경변수로 민감 정보 관리 (`.env.local`)
- **성능**: N+1 쿼리 방지, 필요시 relations 명시적 로드
- **코드 품질**: ESLint 규칙 준수, 불필요한 console.log 제거

## 커밋 메시지

- feat: 새로운 기능
- fix: 버그 수정
- refactor: 리팩토링
- docs: 문서 수정
- style: 코드 포맷팅
- test: 테스트 추가/수정
- chore: 빌드/설정 변경
