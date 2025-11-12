import { EntityManager, Repository } from "typeorm";
import { UserAccount } from "../entities/UserAccount";

export class UserAccountRepository extends Repository<UserAccount> {
  constructor(manager: EntityManager) {
    super(UserAccount, manager);
  }
}
