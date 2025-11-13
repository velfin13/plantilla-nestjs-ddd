import { Injectable } from '@nestjs/common';
import { User } from 'src/user/domain/entities/user.entity';
import type { UserRepository } from 'src/user/domain/repositories/user.repository';
import { NotFoundException } from 'src/common/domain/exceptions';

export interface UpdateUserDto {
  name?: string;
  lastname?: string;
  phone?: string;
  active?: boolean;
}

@Injectable()
export class UpdateUserUseCase {
  constructor(private readonly repo: UserRepository) {}

  async execute(id: string, dto: UpdateUserDto): Promise<User> {
    const user = await this.repo.findById(id);
    if (!user) {
      throw new NotFoundException('User', id);
    }

    // Actualizar solo los campos proporcionados
    if (dto.name !== undefined) user.name = dto.name;
    if (dto.lastname !== undefined) user.lastname = dto.lastname;
    if (dto.phone !== undefined) user.phone = dto.phone;
    if (dto.active !== undefined) user.active = dto.active;

    await this.repo.save(user);
    return user;
  }
}
