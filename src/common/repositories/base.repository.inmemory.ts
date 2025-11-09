import { BaseRepository } from './base.repository';

export abstract class BaseRepositoryInMemory<T extends { id: string | number }> extends BaseRepository<T> {
  protected items: T[] = [];

  async findAll(): Promise<T[]> {
    return [...this.items];
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
