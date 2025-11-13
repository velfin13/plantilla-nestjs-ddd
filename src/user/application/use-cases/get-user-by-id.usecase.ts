import { Injectable } from '@nestjs/common';
import { User } from 'src/user/domain/entities/user.entity';
import type { UserRepository } from 'src/user/domain/repositories/user.repository';
import { NotFoundException } from 'src/common/domain/exceptions';

@Injectable()
export class GetUserByIdUseCase {
  constructor(private readonly repo: UserRepository) {}

  async execute(id: string): Promise<User> {
    const user = await this.repo.findById(id);
    if (!user) {
      throw new NotFoundException('User', id);
    }
    return user;
  }
}
