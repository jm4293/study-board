import { EntityManager, Repository } from "typeorm";
import { BoardImage } from "../entities/BoardImage";

export class BoardImageRepository extends Repository<BoardImage> {
  constructor(manager: EntityManager) {
    super(BoardImage, manager);
  }
}
