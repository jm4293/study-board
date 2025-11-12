import { Repository } from "typeorm";
import { User, UserStatus } from "../entities/User";

export class UserRepository extends Repository<User> {
  /**
   * username으로 사용자 찾기
   */
  findByUsername(username: string): Promise<User | null> {
    return this.findOne({ where: { username } });
  }

  /**
   * 활성 사용자만 조회
   */
  findActiveUsers(): Promise<User[]> {
    return this.find({ where: { status: UserStatus.ACTIVE } });
  }

  /**
   * 상태별 사용자 조회
   */
  findByStatus(status: UserStatus): Promise<User[]> {
    return this.find({ where: { status } });
  }

  /**
   * 사용자 존재 여부 확인
   */
  async existsByUsername(username: string): Promise<boolean> {
    const count = await this.count({ where: { username } });
    return count > 0;
  }
}
