import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, Index } from "typeorm";
import { User } from "./User";

@Entity("UserVisit")
@Index("idx_user_id", ["userId"])
@Index("idx_ip_address", ["ipAddress"])
@Index("idx_visited_at", ["visitedAt"])
export class UserVisit {
  @PrimaryGeneratedColumn({ type: "bigint" })
  id!: number;

  @Column({ type: "bigint", nullable: true, name: "user_id" })
  userId!: number | null;

  @ManyToOne(() => User, { onDelete: "SET NULL" })
  @JoinColumn({ name: "user_id" })
  user!: User | null;

  @Column({ type: "varchar", length: 45, nullable: true, name: "ip_address" })
  ipAddress!: string | null;

  @Column({ type: "text", nullable: true, name: "user_agent" })
  userAgent!: string | null;

  @Column({ type: "varchar", length: 255, nullable: true })
  referrer!: string | null;

  @Column({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP",
    nullable: true,
    name: "visited_at",
  })
  visitedAt!: Date;
}
