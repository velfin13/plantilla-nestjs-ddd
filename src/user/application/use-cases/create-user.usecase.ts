import { BadRequestException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';
import { RegisterDto } from 'src/auth/dto/register.dto';
import { User } from '../../domain/entities/user.entity';
import type { UserRepository } from '../../domain/repositories/user.repository';
import { LoggerService } from 'src/common/infrastructure/logger/logger.service';

@Injectable()
export class CreateUserUseCase {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly logger: LoggerService,
  ) {
    this.logger.setContext('CreateUserUseCase');
  }

  async execute(dto: RegisterDto) {
    this.logger.log('Creating new user', { email: dto.email });

    const existing = await this.userRepo.findByEmail(dto.email);
    if (existing) {
      this.logger.warn('User creation failed: Email already registered', undefined, { email: dto.email });
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
    
    this.logger.log('User created successfully', { userId: user.id, email: user.email });
    
    return user;
  }
}