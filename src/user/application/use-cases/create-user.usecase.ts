import { BadRequestException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';
import { RegisterDto } from 'src/auth/dto/register.dto';
import { User } from '../../domain/entities/user.entity';
import type { UserRepository } from '../../domain/repositories/user.repository';

@Injectable()
export class CreateUserUseCase {
  constructor(private readonly userRepo: UserRepository) { }

  async execute(dto: RegisterDto) {
    const existing = await this.userRepo.findByEmail(dto.email);
    if (existing) {
      throw new BadRequestException('Email already registered');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = new User.Builder()
      .setId(randomUUID())
      .setName(dto.name)
      .setLastname(dto.lastname)
      .setPhone(dto.phone)
      .setEmail(dto.email)
      .setPassword(hashedPassword)
      .setActive(true)
      .build();

    await this.userRepo.save(user);
    return user;
  }
}