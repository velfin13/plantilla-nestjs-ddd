import { Task } from '../../domain/entities/task.entity';
import { TaskEntity } from '../../infrastructure/persistence/task.entity';

export class TaskMapper {
  static toDomain(entity: TaskEntity): Task {
    return new Task(entity.id, entity.title, entity.completed, entity.createdAt, entity.updatedAt);
  }

  static toPersistence(domain: Task): TaskEntity {
    const entity = new TaskEntity();
    entity.id = domain.id;
    entity.title = domain.title;
    entity.completed = domain.completed;
    if (domain.createdAt) entity.createdAt = domain.createdAt;
    if (domain.updatedAt) entity.updatedAt = domain.updatedAt;
    return entity;
  }

  static toDomainArray(entities: TaskEntity[]): Task[] {
    return entities.map(entity => this.toDomain(entity));
  }
}
