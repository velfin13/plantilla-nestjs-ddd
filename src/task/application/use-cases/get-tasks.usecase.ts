import { TaskRepository } from '../../domain/repositories/task.repository';
import { Task } from '../../domain/entities/task.entity';

export class GetTasksUseCase {
  constructor(private readonly repo: TaskRepository) {}

  async execute(): Promise<Task[]> {
    return this.repo.findAll();
  }
}
