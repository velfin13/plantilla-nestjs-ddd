import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/domain/entities/user.entity';
import { UserRepository } from 'src/user/domain/repositories/user.repository';
import { Repository } from 'typeorm';
import { UserEntity } from './user.entity';

@Injectable()
export class PostgresUserRepository implements UserRepository {
  constructor(@InjectRepository(UserEntity) private readonly repo: Repository<UserEntity>) {}

  async findAll(): Promise<User[]> {
    const entities = await this.repo.find();
    return entities.map((e) =>
      new User.Builder()
        .setId(e.id)
        .setName(e.name)
        .setLastname(e.lastname)
        .setPhone(e.phone)
        .setEmail(e.email)
        .setActive(e.active)
        .setCreatedAt(e.createdAt)
        .setUpdatedAt(e.updatedAt)
        .build(),
    );
  }

  async findAllPaginated(page: number, limit: number): Promise<{ data: User[]; total: number }> {
    const skip = (page - 1) * limit;
    const [data, total] = await this.repo.findAndCount({ skip, take: limit });
    return {
      data: data.map((e) =>
        new User.Builder()
          .setId(e.id)
          .setName(e.name)
          .setLastname(e.lastname)
          .setPhone(e.phone)
          .setEmail(e.email)
          .setActive(e.active)
          .setCreatedAt(e.createdAt)
          .setUpdatedAt(e.updatedAt)
          .build(),
      ),
      total,
    };
  }

  async findById(id: string): Promise<User | null> {
    const entity = await this.repo.findOneBy({ id } as any);
    if (!entity) return null;
    return new User.Builder()
      .setId(entity.id)
      .setName(entity.name)
      .setLastname(entity.lastname)
      .setPhone(entity.phone)
      .setEmail(entity.email)
      .setActive(entity.active)
      .setCreatedAt(entity.createdAt)
      .setUpdatedAt(entity.updatedAt)
      .build();
  }

  async findByEmail(email: string): Promise<User | null> {
    const entity = await this.repo.findOne({ where: { email } });
    if (!entity) return null;
    return new User.Builder()
      .setId(entity.id)
      .setName(entity.name)
      .setLastname(entity.lastname)
      .setPhone(entity.phone)
      .setEmail(entity.email)
      .setPassword(entity.password)
      .setActive(entity.active)
      .setCreatedAt(entity.createdAt)
      .setUpdatedAt(entity.updatedAt)
      .build();
  }

  async save(entity: User): Promise<void> {
    await this.repo.save({
      id: entity.id,
      name: entity.name,
      lastname: entity.lastname,
      phone: entity.phone,
      email: entity.email,
      password: entity.password,
      active: entity.active,
    } as any);
  }

  async delete(id: string): Promise<void> {
    await this.repo.delete(id);
  }
}
