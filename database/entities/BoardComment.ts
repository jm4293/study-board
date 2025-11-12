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
import { Board } from "./Board";
import { User } from "./User";

@Entity("BoardComment")
@Index("idx_board_id", ["boardId"])
@Index("idx_user_id", ["userId"])
@Index("idx_parent_id", ["parentId"])
@Index("idx_is_deleted", ["isDeleted"])
@Index("idx_created_at", ["createdAt"])
export class BoardComment {
  @PrimaryGeneratedColumn({ type: "bigint" })
  id!: number;

  @Column({ type: "bigint", name: "board_id" })
  boardId!: number;

  @ManyToOne(() => Board, { onDelete: "CASCADE" })
  @JoinColumn({ name: "board_id" })
  board!: Board;

  @Column({ type: "bigint", name: "user_id" })
  userId!: number;

  @ManyToOne(() => User, { onDelete: "CASCADE" })
  @JoinColumn({ name: "user_id" })
  user!: User;

  @Column({ type: "bigint", nullable: true, name: "parent_id" })
  parentId!: number | null;

  @ManyToOne(() => BoardComment, { onDelete: "CASCADE" })
  @JoinColumn({ name: "parent_id" })
  parent!: BoardComment | null;

  @Column({ type: "text" })
  content!: string;

  @Column({ type: "int", default: 0, nullable: true, name: "like_count" })
  likeCount!: number;

  @Column({ type: "tinyint", width: 1, default: 0, nullable: true, name: "is_deleted" })
  isDeleted!: boolean;

  @Column({ type: "timestamp", nullable: true, name: "deleted_at" })
  deletedAt!: Date | null;

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt!: Date;
}
