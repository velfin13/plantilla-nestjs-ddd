import { Injectable } from '@nestjs/common';
import type { UserRepository } from 'src/user/domain/repositories/user.repository';
import { NotFoundException } from 'src/common/domain/exceptions';
import { LoggerService } from 'src/common/infrastructure/logger/logger.service';

@Injectable()
export class DeleteUserUseCase {
  constructor(
    private readonly repo: UserRepository,
    private readonly logger: LoggerService,
  ) {
    this.logger.setContext('DeleteUserUseCase');
  }

  async execute(id: string): Promise<void> {
    this.logger.log('Deleting user', { userId: id });

    const user = await this.repo.findById(id);
    if (!user) {
      this.logger.warn('User deletion failed: Not found', undefined, { userId: id });
      throw new NotFoundException('User', id);
    }
    
    await this.repo.delete(id);
    this.logger.log('User deleted successfully', { userId: id });
  }
}
