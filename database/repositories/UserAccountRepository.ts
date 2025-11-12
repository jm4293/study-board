import { Repository } from "typeorm";
import { UserAccount } from "../entities/UserAccount";

export class UserAccountRepository extends Repository<UserAccount> {
  /**
   * 이메일로 계정 찾기
   */
  async findByEmail(email: string): Promise<UserAccount | null> {
    return this.findOne({ where: { email } });
  }

  /**
   * 사용자 ID로 계정 찾기
   */
  async findByUserId(userId: number): Promise<UserAccount | null> {
    return this.findOne({ where: { userId } });
  }

  /**
   * 이메일 존재 여부 확인
   */
  async existsByEmail(email: string): Promise<boolean> {
    const count = await this.count({ where: { email } });
    return count > 0;
  }

  /**
   * 마지막 로그인 시간 업데이트
   */
  async updateLastLogin(id: number): Promise<void> {
    await this.update(id, {
      lastLoginAt: new Date(),
      loginCount: () => "login_count + 1",
    });
  }

  /**
   * 리프레시 토큰 업데이트
   */
  async updateRefreshToken(id: number, refreshToken: string | null): Promise<void> {
    await this.update(id, { refreshToken });
  }
}
