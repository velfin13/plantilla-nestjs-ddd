export abstract class BaseRepository<T extends { id: string | number }> {
  abstract findAll(): Promise<T[]>;
  abstract findAllPaginated(page: number, limit: number): Promise<{ data: T[]; total: number }>;
  abstract findById(id: string): Promise<T | null>;
  abstract save(item: T): Promise<void>;
  abstract delete(id: string): Promise<void>;
}
