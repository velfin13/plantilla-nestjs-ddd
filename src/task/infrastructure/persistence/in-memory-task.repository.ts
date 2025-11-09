import { Task } from 'src/task/domain/entities/task.entity';
import { BaseRepositoryInMemory } from '../../../common/repositories/base.repository.inmemory';
import { TaskRepository } from 'src/task/domain/repositories/task.repository';

export class InMemoryTaskRepository extends BaseRepositoryInMemory<Task> implements TaskRepository { }
