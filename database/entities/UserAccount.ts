import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from "typeorm";
import { User } from "./User";

@Entity("UserAccount")
@Index("idx_email", ["email"])
export class UserAccount {
  @PrimaryGeneratedColumn({ type: "bigint" })
  id!: number;

  @Column({ type: "bigint", name: "user_id" })
  userId!: number;

  @ManyToOne(() => User, { onDelete: "CASCADE" })
  @JoinColumn({ name: "user_id" })
  user!: User;

  @Column({ type: "varchar", length: 100, unique: true, nullable: true })
  email!: string | null;

  @Column({ type: "varchar", length: 255, nullable: true })
  password!: string | null;

  @Column({ type: "text", nullable: true, name: "refresh_token" })
  refreshToken!: string | null;

  @Column({ type: "timestamp", nullable: true, name: "last_login_at" })
  lastLoginAt!: Date | null;

  @Column({ type: "int", default: 0, nullable: true, name: "login_count" })
  loginCount!: number;

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt!: Date;
}
