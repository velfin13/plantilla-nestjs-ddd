import { Task } from '../../domain/entities/task.entity';
import { TaskRepository } from '../../domain/repositories/task.repository';

export class ToggleTaskUseCase {

    constructor(private readonly repo: TaskRepository) { }

    async execute(id: string): Promise<Task | null> {
        const entity = await this.repo.findById(id);
        if (!entity) return null;

        entity.toggle();

        await this.repo.save(entity);

        return entity;
    }
}
