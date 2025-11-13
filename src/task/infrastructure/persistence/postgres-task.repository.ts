import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TaskEntity } from './task.entity';
import { TaskRepository } from 'src/task/domain/repositories/task.repository';
import { Task } from 'src/task/domain/entities/task.entity';

@Injectable()
export class PostgresTaskRepository implements TaskRepository {
  
  constructor(@InjectRepository(TaskEntity) private readonly repo: Repository<TaskEntity>) {}

  async findAll(): Promise<Task[]> {
    const entities = await this.repo.find();
    return entities.map(e => new Task(e.id, e.title, e.completed, e.createdAt, e.updatedAt));
  }

  async findAllPaginated(page: number, limit: number): Promise<{ data: Task[]; total: number }> {
    const skip = (page - 1) * limit;
    const [data, total] = await this.repo.findAndCount({ skip, take: limit });
    return {
      data: data.map(e => new Task(e.id, e.title, e.completed, e.createdAt, e.updatedAt)),
      total,
    };
  }

  async findById(id: string): Promise<Task | null> {
    const entity = await this.repo.findOneBy({ id } as any);
    if (!entity) return null;
    return new Task(entity.id, entity.title, entity.completed, entity.createdAt, entity.updatedAt);
  }

  async save(entity: Task): Promise<void> {
    await this.repo.save({
      id: entity.id,
      title: entity.title,
      completed: entity.completed,
    } as any);
  }

  async delete(id: string): Promise<void> {
    await this.repo.delete(id);
  }
}
