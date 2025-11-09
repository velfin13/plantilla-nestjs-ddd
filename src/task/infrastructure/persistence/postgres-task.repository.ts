import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TaskEntity } from './task.entity';
import { BaseRepositoryTypeORM } from '../../../common/repositories/base.repository.typeorm';
import { TaskRepository } from 'src/task/domain/repositories/task.repository';
import { Task } from 'src/task/domain/entities/task.entity';

@Injectable()
export class PostgresTaskRepository extends BaseRepositoryTypeORM<TaskEntity> implements TaskRepository {
  
  constructor(@InjectRepository(TaskEntity) repo: Repository<TaskEntity>) {
    super(repo);
  }

  async findAll(): Promise<Task[]> {
    const entities = await super.findAll();
    return entities.map(e => new Task(e.id, e.title, e.completed));
  }

  async findById(id: string): Promise<Task | null> {
    const entity = await super.findById(id);
    if (!entity) return null;
    return new Task(entity.id, entity.title, entity.completed);
  }

  async save(entity: Task): Promise<void> {
    await super.save({ id: entity.id, title: entity.title, completed: entity.completed });
  }

  async delete(id: string): Promise<void> {
    await super.delete(id);
  }
}
