import { Injectable } from '@nestjs/common';
import type { UserRepository } from 'src/user/domain/repositories/user.repository';
import { NotFoundException } from 'src/common/domain/exceptions';

@Injectable()
export class DeleteUserUseCase {
  constructor(private readonly repo: UserRepository) {}

  async execute(id: string): Promise<void> {
    const user = await this.repo.findById(id);
    if (!user) {
      throw new NotFoundException('User', id);
    }
    await this.repo.delete(id);
  }
}
