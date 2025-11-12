import { Repository } from "typeorm";
import { BoardImage } from "../entities/BoardImage";

export class BoardImageRepository extends Repository<BoardImage> {
  /**
   * 게시글의 이미지 조회 (순서대로)
   */
  async findByBoardId(boardId: number): Promise<BoardImage[]> {
    return this.find({
      where: { boardId },
      order: { orderNum: "ASC" },
    });
  }

  /**
   * 게시글의 첫 번째 이미지 조회 (썸네일용)
   */
  async findFirstByBoardId(boardId: number): Promise<BoardImage | null> {
    return this.findOne({
      where: { boardId },
      order: { orderNum: "ASC" },
    });
  }

  /**
   * 게시글의 이미지 개수
   */
  async countByBoardId(boardId: number): Promise<number> {
    return this.count({ where: { boardId } });
  }

  /**
   * 게시글의 모든 이미지 삭제
   */
  async deleteByBoardId(boardId: number): Promise<void> {
    await this.delete({ boardId });
  }

  /**
   * 이미지 순서 업데이트
   */
  async updateOrder(id: number, orderNum: number): Promise<void> {
    await this.update(id, { orderNum });
  }

  /**
   * 여러 이미지 일괄 저장
   */
  async saveBulk(images: Partial<BoardImage>[]): Promise<BoardImage[]> {
    const entities = this.create(images);
    return this.save(entities);
  }
}
