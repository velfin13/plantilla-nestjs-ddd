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

    const user: User = {
      id: randomUUID(),
      name: dto.name,
      lastname: dto.lastname,
      phone: dto.phone,
      email: dto.email,
      password: hashedPassword,
      active: false,
    };

    return this.userRepo.save(user);
  }
}