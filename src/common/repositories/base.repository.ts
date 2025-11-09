export abstract class BaseRepository<T extends { id: string | number }> {
  abstract findAll(): Promise<T[]>;
  abstract findById(id: string): Promise<T | null>;
  abstract save(item: T): Promise<void>;
  abstract delete(id: string): Promise<void>;
}
