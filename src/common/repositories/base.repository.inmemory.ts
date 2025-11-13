import { BaseRepository } from './base.repository';

export abstract class BaseRepositoryInMemory<T extends { id: string | number }> extends BaseRepository<T> {
  protected items: T[] = [];

  async findAll(): Promise<T[]> {
    return [...this.items];
  }

  async findAllPaginated(page: number, limit: number): Promise<{ data: T[]; total: number }> {
    const skip = (page - 1) * limit;
    const data = this.items.slice(skip, skip + limit);
    return { data, total: this.items.length };
  }

  async findById(id: string): Promise<T | null> {
    return this.items.find(i => i.id === id) || null;
  }

  async save(item: T): Promise<void> {
    const index = this.items.findIndex(i => i.id === item.id);
    if (index >= 0) this.items[index] = item;
    else this.items.push(item);
  }

  async delete(id: string): Promise<void> {
    this.items = this.items.filter(i => i.id !== id);
  }
}
