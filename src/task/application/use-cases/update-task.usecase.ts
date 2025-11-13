import { Injectable } from '@nestjs/common';
import { Task } from 'src/task/domain/entities/task.entity';
import type { TaskRepository } from 'src/task/domain/repositories/task.repository';
import { NotFoundException } from 'src/common/domain/exceptions';

export interface UpdateTaskDto {
  title?: string;
}

@Injectable()
export class UpdateTaskUseCase {
  constructor(private readonly repo: TaskRepository) {}

  async execute(id: string, dto: UpdateTaskDto): Promise<Task> {
    const task = await this.repo.findById(id);
    if (!task) {
      throw new NotFoundException('Task', id);
    }

    if (dto.title !== undefined) {
      task.updateTitle(dto.title);
    }

    await this.repo.save(task);
    return task;
  }
}
