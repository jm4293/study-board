# 개발 가이드

## Model vs Entity

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

### 실제 사용 예시

#### 1. API 라우트에서 Entity를 Model로 변환

```typescript
// app/api/users/route.ts
import { AppDataSource } from "@/config/data-source";
import { User } from "@/database/entities/User";
import { UserResponse } from "./types";

export async function GET(request: Request) {
  try {
    const userRepository = AppDataSource.getRepository(User);
    const users = await userRepository.find();

    // Entity를 Response Model로 변환 (password 제외)
    const response: UserResponse[] = users.map((user) => ({
      id: user.id,
      username: user.username,
      email: user.email,
      createdAt: user.createdAt.toISOString(),
      // password는 응답에 포함하지 않음
    }));

    return Response.json({ data: response }, { status: 200 });
  } catch (error) {
    return Response.json({ error: "사용자 조회 실패" }, { status: 500 });
  }
}
```

#### 2. Request Model을 Entity로 변환하여 저장

```typescript
// app/api/users/route.ts
import { CreateUserRequest, UserResponse } from "./types";

export async function POST(request: Request) {
  try {
    const body: CreateUserRequest = await request.json();

    // Request Model에서 Entity 생성
    const userRepository = AppDataSource.getRepository(User);
    const newUser = userRepository.create({
      username: body.username,
      password: body.password, // 실제로는 해시화 필요
      email: body.email,
    });

    const savedUser = await userRepository.save(newUser);

    // Entity를 Response Model로 변환
    const response: UserResponse = {
      id: savedUser.id,
      username: savedUser.username,
      email: savedUser.email,
      createdAt: savedUser.createdAt.toISOString(),
    };

    return Response.json({ data: response }, { status: 201 });
  } catch (error) {
    return Response.json({ error: "사용자 생성 실패" }, { status: 400 });
  }
}
```

#### 3. Service 레이어에서 변환 로직 분리

```typescript
// service/UserService.ts
import { User } from "@/database/entities/User";
import { UserResponse, CreateUserRequest } from "@/app/api/users/types";

export class UserService {
  // Entity를 Response Model로 변환
  static toResponse(user: User): UserResponse {
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      createdAt: user.createdAt.toISOString(),
    };
  }

  // Request Model에서 Entity 생성 데이터 준비
  static fromCreateRequest(request: CreateUserRequest): Partial<User> {
    return {
      username: request.username,
      password: request.password, // 해시화 로직 추가 필요
      email: request.email,
    };
  }
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
