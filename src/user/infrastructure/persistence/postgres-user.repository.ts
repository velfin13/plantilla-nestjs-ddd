import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/domain/entities/user.entity';
import { UserRepository } from 'src/user/domain/repositories/user.repository';
import { Repository } from 'typeorm';
import { BaseRepositoryTypeORM } from '../../../common/repositories/base.repository.typeorm';
import { UserEntity } from './user.entity';

@Injectable()
export class PostgresUserRepository
  extends BaseRepositoryTypeORM<UserEntity>
  implements UserRepository {
  constructor(@InjectRepository(UserEntity) repo: Repository<UserEntity>) {
    super(repo);
  }

  async findAll(): Promise<User[]> {
    const entities = await super.findAll();
    return entities.map((e) =>
      new User.Builder()
        .setId(e.id)
        .setName(e.name)
        .setLastname(e.lastname)
        .setPhone(e.phone)
        .setEmail(e.email)
        .setActive(e.active)
        .build(),
    );
  }

  async findAllPaginated(page: number, limit: number): Promise<{ data: User[]; total: number }> {
    const { data, total } = await super.findAllPaginated(page, limit);
    return {
      data: data.map((e) =>
        new User.Builder()
          .setId(e.id)
          .setName(e.name)
          .setLastname(e.lastname)
          .setPhone(e.phone)
          .setEmail(e.email)
          .setActive(e.active)
          .build(),
      ),
      total,
    };
  }

  async findById(id: string): Promise<User | null> {
    const entity = await super.findById(id);
    if (!entity) return null;
    return new User.Builder()
      .setId(entity.id)
      .setName(entity.name)
      .setLastname(entity.lastname)
      .setPhone(entity.phone)
      .setEmail(entity.email)
      .setActive(entity.active)
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
      .build();
  }

  async save(entity: User): Promise<void> {
    await super.save({
      id: entity.id,
      name: entity.name,
      lastname: entity.lastname,
      phone: entity.phone,
      email: entity.email,
      password: entity.password,
      active: entity.active,
    });
  }

  async delete(id: string): Promise<void> {
    await super.delete(id);
  }
}
