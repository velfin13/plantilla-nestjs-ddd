import { User } from '../../domain/entities/user.entity';
import { UserEntity } from '../../infrastructure/persistence/user.entity';

export class UserMapper {
  static toDomain(entity: UserEntity): User {
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

  static toPersistence(domain: User): UserEntity {
    const entity = new UserEntity();
    entity.id = domain.id;
    entity.name = domain.name;
    entity.lastname = domain.lastname;
    entity.phone = domain.phone;
    entity.email = domain.email;
    entity.password = domain.password;
    entity.active = domain.active;
    if (domain.createdAt) entity.createdAt = domain.createdAt;
    if (domain.updatedAt) entity.updatedAt = domain.updatedAt;
    return entity;
  }

  static toResponse(domain: User): Omit<User, 'password'> {
    const { password, ...userWithoutPassword } = domain;
    return userWithoutPassword;
  }
}
