import { Repository } from "typeorm";
import { UserVisit } from "../entities/UserVisit";

export class UserVisitRepository extends Repository<UserVisit> {
  /**
   * 사용자 ID로 방문 기록 조회
   */
  async findByUserId(userId: number, limit = 100): Promise<UserVisit[]> {
    return this.find({
      where: { userId },
      order: { visitedAt: "DESC" },
      take: limit,
    });
  }

  /**
   * IP 주소로 방문 기록 조회
   */
  async findByIpAddress(ipAddress: string, limit = 100): Promise<UserVisit[]> {
    return this.find({
      where: { ipAddress },
      order: { visitedAt: "DESC" },
      take: limit,
    });
  }

  /**
   * 특정 기간의 방문 기록 조회
   */
  async findByDateRange(startDate: Date, endDate: Date): Promise<UserVisit[]> {
    return this.createQueryBuilder("visit")
      .where("visit.visitedAt BETWEEN :startDate AND :endDate", {
        startDate,
        endDate,
      })
      .orderBy("visit.visitedAt", "DESC")
      .getMany();
  }

  /**
   * 오늘의 방문자 수 카운트
   */
  async getTodayVisitCount(): Promise<number> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return this.createQueryBuilder("visit").where("visit.visitedAt >= :today", { today }).getCount();
  }
}
