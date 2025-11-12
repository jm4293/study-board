# 개발 가이드

## 1. Model vs Entity

### Entity (엔티티)

**정의**: 데이터베이스 테이블과 **직접 매핑**되는 클래스

**용도**: ORM(TypeORM)이 데이터베이스와 상호작용할 때 사용

**특징**:

- `@Entity()`, `@Column()` 등 TypeORM 데코레이터 사용
- 데이터베이스 스키마를 정의
- 테이블 구조와 1:1 대응
- 데이터베이스 컬럼, 인덱스, 관계 정의

**예시**:

```typescript
// database/entities/User.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity("User")
export class User {
  @PrimaryGeneratedColumn({ type: "bigint" })
  id!: number;

  @Column({ type: "varchar", length: 50, unique: true })
  username!: string;

  @Column({ type: "varchar", length: 255 })
  password!: string; // 민감한 정보 포함

  @Column({ type: "varchar", length: 100 })
  email!: string;

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt!: Date;
}
```

---

### Model (모델)

**정의**: 비즈니스 로직과 API에서 사용하는 **데이터 구조**

**용도**: API 요청/응답, DTO(Data Transfer Object), 비즈니스 로직 처리

**특징**:

- TypeScript 인터페이스나 타입으로 정의
- 엔티티와 다른 형태로 변환 가능
- 클라이언트에 노출되는 데이터 구조
- 필요한 필드만 선택적으로 포함

**예시**:

```typescript
// app/api/users/types.ts

// 생성 요청 모델
export interface CreateUserRequest {
  username: string;
  password: string;
  email: string;
}

// 업데이트 요청 모델
export interface UpdateUserRequest {
  nickname?: string;
  email?: string;
}

// 응답 모델 (민감한 정보 제외)
export interface UserResponse {
  id: number;
  username: string;
  email: string;
  createdAt: string;
  // password는 제외됨
}

// 목록 조회 응답 모델
export interface UserListResponse {
  users: UserResponse[];
  total: number;
  page: number;
  pageSize: number;
}
```

---

### 프로젝트 구조 권장사항

```
database/
  entities/              # Entity 정의
    User.ts
    Board.ts

app/
  api/
    users/
      route.ts          # API 라우트
      types.ts          # Request/Response Model 정의
    boards/
      route.ts
      types.ts

service/                # 비즈니스 로직 & 변환 로직
  UserService.ts
  BoardService.ts
```

**핵심 원칙**:

- `database/entities/`: 데이터베이스 구조 정의 (Entity)
- `app/api/{resource}/types.ts`: API 입출력 구조 정의 (Model)
- `service/`: Entity ↔ Model 변환 로직 및 비즈니스 로직

<br/>
<br/>

## 2. Form Validation (React Hook Form + Zod)

### 설치

```bash
npm install react-hook-form zod @hookform/resolvers
```

### 기본 사용법

#### 1. Zod 스키마 정의

```typescript
import { z } from "zod";

const formSchema = z.object({
  title: z.string().min(1, "제목은 최소 1자 이상이어야 합니다.").max(100, "제목은 최대 100자 이하여야 합니다."),
  content: z.string().min(1, "내용은 최소 1자 이상이어야 합니다."),
});

type FormValues = z.infer<typeof formSchema>;
```

#### 2. React Hook Form 설정

```typescript
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

export default function BoardRegister() {
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = (data: FormValues) => {
    console.log(data);
    // API 호출 로직
  };

  return <form onSubmit={handleSubmit(onSubmit)}>{/* 폼 내용 */}</form>;
}
```

#### 3. Input 등록 및 에러 표시

```typescript
<div>
  <Input
    title="제목"
    placeholder="제목을 입력해주세요"
    {...register('title')}
  />
  {errors.title && (
    <Text.PARAGRAPH text={errors.title.message} color="red" />
  )}
</div>

<div>
  <Textarea
    title="내용"
    placeholder="내용을 입력해주세요"
    {...register('content')}
  />
  {errors.content && (
    <Text.PARAGRAPH text={errors.content.message} color="red" />
  )}
</div>
```

#### 4. 제출 버튼

```typescript
<Button.CONTAINER text="등록하기" type="submit" disabled={isSubmitting} />
```

### 주요 기능

| 기능           | 설명                | 사용법                                      |
| -------------- | ------------------- | ------------------------------------------- |
| `register`     | Input을 폼에 등록   | `{...register('fieldName')}`                |
| `handleSubmit` | 폼 제출 처리        | `onSubmit={handleSubmit(onSubmit)}`         |
| `getValues`    | 현재 폼 값 가져오기 | `getValues()` 또는 `getValues('fieldName')` |
| `errors`       | 검증 에러 확인      | `errors.fieldName?.message`                 |
| `isSubmitting` | 제출 중 상태        | `formState.isSubmitting`                    |

### 전체 예시

```typescript
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  title: z.string().min(1, "제목은 필수입니다.").max(100),
  content: z.string().min(1, "내용은 필수입니다."),
});

type FormValues = z.infer<typeof formSchema>;

export default function BoardRegister() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: FormValues) => {
    try {
      const response = await fetch("/api/boards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("등록 실패");

      // 성공 처리
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <Input title="제목" placeholder="제목을 입력해주세요" {...register("title")} />
        {errors.title && <Text.PARAGRAPH text={errors.title.message} color="red" />}
      </div>

      <div>
        <Textarea title="내용" placeholder="내용을 입력해주세요" {...register("content")} />
        {errors.content && <Text.PARAGRAPH text={errors.content.message} color="red" />}
      </div>

      <Button.CONTAINER text="등록하기" type="submit" disabled={isSubmitting} />
    </form>
  );
}
```
