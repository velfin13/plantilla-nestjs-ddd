import { User } from "src/user/domain/entities/user.entity";
import { UserRepository } from "src/user/domain/repositories/user.repository";


export class GetUsersUseCase {
  constructor(private readonly repo: UserRepository) { }

  async execute(): Promise<User[]> {
    return this.repo.findAll();
  }
}
