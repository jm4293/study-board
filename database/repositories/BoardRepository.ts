import { EntityManager, Repository } from "typeorm";
import { Board } from "../entities/Board";

export class BoardRepository extends Repository<Board> {
  constructor(manager: EntityManager) {
    super(Board, manager);
  }
}
