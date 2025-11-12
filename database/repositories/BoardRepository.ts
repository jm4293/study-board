import { Repository } from "typeorm";
import { Board, BoardType } from "../entities/Board";

export class BoardRepository extends Repository<Board> {
  /**
   * 삭제되지 않은 게시글만 조회
   */
  async findActive(limit = 20, offset = 0): Promise<[Board[], number]> {
    return this.findAndCount({
      where: { isDeleted: false },
      order: { createdAt: "DESC" },
      take: limit,
      skip: offset,
    });
  }

  /**
   * 게시판 타입별 조회
   */
  async findByBoardType(boardType: BoardType, limit = 20, offset = 0): Promise<[Board[], number]> {
    return this.findAndCount({
      where: { boardType, isDeleted: false },
      order: { createdAt: "DESC" },
      take: limit,
      skip: offset,
    });
  }

  /**
   * 공지사항 조회
   */
  async findNotices(limit = 10): Promise<Board[]> {
    return this.find({
      where: { isNotice: true, isDeleted: false },
      order: { createdAt: "DESC" },
      take: limit,
    });
  }

  /**
   * 사용자가 작성한 게시글 조회
   */
  async findByUserId(userId: number, limit = 20, offset = 0): Promise<[Board[], number]> {
    return this.findAndCount({
      where: { userId, isDeleted: false },
      order: { createdAt: "DESC" },
      take: limit,
      skip: offset,
    });
  }

  /**
   * 제목 또는 내용으로 검색
   */
  async searchByKeyword(keyword: string, limit = 20, offset = 0): Promise<[Board[], number]> {
    return this.createQueryBuilder("board")
      .where("board.isDeleted = :isDeleted", { isDeleted: false })
      .andWhere("(board.title LIKE :keyword OR board.content LIKE :keyword)", {
        keyword: `%${keyword}%`,
      })
      .orderBy("board.createdAt", "DESC")
      .take(limit)
      .skip(offset)
      .getManyAndCount();
  }

  /**
   * 조회수 증가
   */
  async incrementViewCount(id: number): Promise<void> {
    await this.increment({ id }, "viewCount", 1);
  }

  /**
   * 좋아요 수 증가
   */
  async incrementLikeCount(id: number): Promise<void> {
    await this.increment({ id }, "likeCount", 1);
  }

  /**
   * 좋아요 수 감소
   */
  async decrementLikeCount(id: number): Promise<void> {
    await this.decrement({ id }, "likeCount", 1);
  }

  /**
   * 댓글 수 업데이트
   */
  async updateCommentCount(id: number, count: number): Promise<void> {
    await this.update(id, { commentCount: count });
  }

  /**
   * 논리 삭제
   */
  async softDeleteBoard(id: number): Promise<void> {
    await this.update(id, {
      isDeleted: true,
      deletedAt: new Date(),
    });
  }
}
