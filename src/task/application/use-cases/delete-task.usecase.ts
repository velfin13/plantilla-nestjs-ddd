import { Injectable } from '@nestjs/common';
import type { TaskRepository } from 'src/task/domain/repositories/task.repository';
import { NotFoundException } from 'src/common/domain/exceptions';

@Injectable()
export class DeleteTaskUseCase {
  constructor(private readonly repo: TaskRepository) {}

  async execute(id: string): Promise<void> {
    const task = await this.repo.findById(id);
    if (!task) {
      throw new NotFoundException('Task', id);
    }
    await this.repo.delete(id);
  }
}
