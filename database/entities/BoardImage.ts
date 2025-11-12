import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, Index } from "typeorm";
import { Board } from "./Board";

@Entity("BoardImage")
@Index("idx_board_id", ["boardId"])
@Index("idx_order_num", ["orderNum"])
export class BoardImage {
  @PrimaryGeneratedColumn({ type: "bigint" })
  id!: number;

  @Column({ type: "bigint", name: "board_id" })
  boardId!: number;

  @ManyToOne(() => Board, { onDelete: "CASCADE" })
  @JoinColumn({ name: "board_id" })
  board!: Board;

  @Column({ type: "varchar", length: 500, name: "image_url" })
  imageUrl!: string;

  @Column({ type: "varchar", length: 255, nullable: true, name: "image_name" })
  imageName!: string | null;

  @Column({ type: "int", nullable: true, name: "image_size" })
  imageSize!: number | null;

  @Column({ type: "varchar", length: 50, nullable: true, name: "mime_type" })
  mimeType!: string | null;

  @Column({ type: "int", default: 0, nullable: true, name: "order_num" })
  orderNum!: number;

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;
}
