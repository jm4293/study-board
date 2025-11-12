import { EntityManager, Repository } from "typeorm";
import { User } from "../entities/User";

export class UserRepository extends Repository<User> {
  constructor(manager: EntityManager) {
    super(User, manager);
  }
}
