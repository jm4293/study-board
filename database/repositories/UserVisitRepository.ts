import { EntityManager, Repository } from "typeorm";
import { UserVisit } from "../entities/UserVisit";

export class UserVisitRepository extends Repository<UserVisit> {
  constructor(manager: EntityManager) {
    super(UserVisit, manager);
  }
}
