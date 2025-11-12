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

export enum BoardType {
  GENERAL = "GENERAL",
  NOTICE = "NOTICE",
  QNA = "QNA",
  GALLERY = "GALLERY",
}

@Entity("Board")
@Index("idx_user_id", ["userId"])
@Index("idx_board_type", ["boardType"])
@Index("idx_is_notice", ["isNotice"])
@Index("idx_is_deleted", ["isDeleted"])
@Index("idx_created_at", ["createdAt"])
@Index("ft_title_content", ["title", "content"], { fulltext: true })
export class Board {
  @PrimaryGeneratedColumn({ type: "bigint" })
  id!: number;

  @Column({ type: "bigint", name: "user_id" })
  userId!: number;

  @ManyToOne(() => User, { onDelete: "CASCADE" })
  @JoinColumn({ name: "user_id" })
  user!: User;

  @Column({ type: "varchar", length: 255 })
  title!: string;

  @Column({ type: "text" })
  content!: string;

  @Column({
    type: "enum",
    enum: BoardType,
    default: BoardType.GENERAL,
    nullable: true,
    name: "board_type",
  })
  boardType!: BoardType;

  @Column({ type: "int", default: 0, nullable: true, name: "view_count" })
  viewCount!: number;

  @Column({ type: "int", default: 0, nullable: true, name: "like_count" })
  likeCount!: number;

  @Column({ type: "int", default: 0, nullable: true, name: "comment_count" })
  commentCount!: number;

  @Column({ type: "tinyint", width: 1, default: 0, nullable: true, name: "is_notice" })
  isNotice!: boolean;

  @Column({ type: "tinyint", width: 1, default: 0, nullable: true, name: "is_deleted" })
  isDeleted!: boolean;

  @Column({ type: "timestamp", nullable: true, name: "deleted_at" })
  deletedAt!: Date | null;

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt!: Date;
}
