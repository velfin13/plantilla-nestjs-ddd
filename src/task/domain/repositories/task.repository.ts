import { Task } from '../entities/task.entity';

export interface TaskRepository {
  findAll(): Promise<Task[]>;
  findAllPaginated(page: number, limit: number): Promise<{ data: Task[]; total: number }>;
  findById(id: string): Promise<Task | null>;
  save(task: Task): Promise<void>;
  delete(id: string): Promise<void>;
}
