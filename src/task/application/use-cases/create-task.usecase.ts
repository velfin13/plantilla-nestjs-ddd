import { TaskRepository } from '../../domain/repositories/task.repository';
import { Task } from '../../domain/entities/task.entity';
import { randomUUID } from 'crypto';
import { CreateTaskDto } from 'src/task/infrastructure/dto/create-task.dto';

export class CreateTaskUseCase {
    constructor(private readonly repo: TaskRepository) { }

    async execute(data: CreateTaskDto): Promise<Task> {
        const entity = new Task(randomUUID(), data.title);
        await this.repo.save(entity);
        return entity;
    }
}
