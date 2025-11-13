import { Repository } from 'typeorm';
import { BaseRepository } from './base.repository';

export abstract class BaseRepositoryTypeORM<T extends { id: string | number }> extends BaseRepository<T> {
    constructor(protected readonly repo: Repository<T>) { super(); }

    async findAll(): Promise<T[]> {
        return this.repo.find();
    }

    async findAllPaginated(page: number, limit: number): Promise<{ data: T[]; total: number }> {
        const skip = (page - 1) * limit;
        const [data, total] = await this.repo.findAndCount({
            skip,
            take: limit,
        });
        return { data, total };
    }

    async findById(id: string): Promise<T | null> {
        return (await this.repo.findOneBy({ id } as any)) || null;
    }

    async save(item: T): Promise<void> {
        await this.repo.save(item);
    }

    async delete(id: string): Promise<void> {
        await this.repo.delete(id);
    }
}
