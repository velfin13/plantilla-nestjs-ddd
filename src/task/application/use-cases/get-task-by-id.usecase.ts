import { Injectable } from '@nestjs/common';
import { Task } from 'src/task/domain/entities/task.entity';
import type { TaskRepository } from 'src/task/domain/repositories/task.repository';
import { NotFoundException } from 'src/common/domain/exceptions';

@Injectable()
export class GetTaskByIdUseCase {
  constructor(private readonly repo: TaskRepository) {}

  async execute(id: string): Promise<Task> {
    const task = await this.repo.findById(id);
    if (!task) {
      throw new NotFoundException('Task', id);
    }
    return task;
  }
}
