import { Repository, EntityManager } from "typeorm";
import { BoardComment } from "../entities/BoardComment";

export class BoardCommentRepository extends Repository<BoardComment> {
  constructor(manager: EntityManager) {
    super(BoardComment, manager);
  }
}
