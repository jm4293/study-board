import { Repository, IsNull } from "typeorm";
import { BoardComment } from "../entities/BoardComment";

export class BoardCommentRepository extends Repository<BoardComment> {
  /**
   * 게시글의 댓글 조회 (대댓글 제외)
   */
  async findByBoardId(boardId: number): Promise<BoardComment[]> {
    return this.find({
      where: { boardId, parentId: IsNull(), isDeleted: false },
      order: { createdAt: "ASC" },
      relations: ["user"],
    });
  }

  /**
   * 대댓글 조회
   */
  async findRepliesByParentId(parentId: number): Promise<BoardComment[]> {
    return this.find({
      where: { parentId, isDeleted: false },
      order: { createdAt: "ASC" },
      relations: ["user"],
    });
  }

  /**
   * 게시글의 전체 댓글 수 (삭제되지 않은 것만)
   */
  async countByBoardId(boardId: number): Promise<number> {
    return this.count({
      where: { boardId, isDeleted: false },
    });
  }

  /**
   * 사용자가 작성한 댓글 조회
   */
  async findByUserId(userId: number, limit = 20, offset = 0): Promise<[BoardComment[], number]> {
    return this.findAndCount({
      where: { userId, isDeleted: false },
      order: { createdAt: "DESC" },
      take: limit,
      skip: offset,
      relations: ["board"],
    });
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
   * 논리 삭제
   */
  async softDeleteComment(id: number): Promise<void> {
    await this.update(id, {
      isDeleted: true,
      deletedAt: new Date(),
    });
  }

  /**
   * 게시글의 모든 댓글 조회 (계층 구조)
   */
  async findWithRepliesByBoardId(boardId: number): Promise<Array<BoardComment & { replies: BoardComment[] }>> {
    const comments = await this.find({
      where: { boardId, isDeleted: false },
      order: { createdAt: "ASC" },
      relations: ["user"],
    });

    // 계층 구조 구성
    const commentMap = new Map<number, BoardComment & { replies: BoardComment[] }>();
    const rootComments: Array<BoardComment & { replies: BoardComment[] }> = [];

    comments.forEach((comment) => {
      commentMap.set(comment.id, { ...comment, replies: [] });
    });

    comments.forEach((comment) => {
      const commentWithReplies = commentMap.get(comment.id)!;
      if (comment.parentId === null) {
        rootComments.push(commentWithReplies);
      } else {
        const parent = commentMap.get(comment.parentId);
        if (parent) {
          parent.replies.push(commentWithReplies);
        }
      }
    });

    return rootComments;
  }
}
