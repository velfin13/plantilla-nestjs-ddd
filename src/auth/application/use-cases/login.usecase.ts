import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type { UserRepository } from 'src/user/domain/repositories/user.repository';
import * as bcrypt from 'bcrypt';
import { LoggerService } from 'src/common/infrastructure/logger/logger.service';

@Injectable()
export class LoginUseCase {
    constructor(
        private readonly userRepo: UserRepository,
        private readonly jwtService: JwtService,
        private readonly logger: LoggerService,
    ) {
        this.logger.setContext('LoginUseCase');
    }

    async execute(email: string, password: string) {
        this.logger.log('Login attempt', { email });
        
        const user = await this.userRepo.findByEmail(email);
        
        if (!user) {
            this.logger.warn('Login failed: User not found', undefined, { email });
            throw new UnauthorizedException('Invalid credentials');
        }

        if (!user.password) {
            this.logger.error('User password not found in database', undefined, 'LoginUseCase', { userId: user.id });
            throw new Error('User password not found in database');
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            this.logger.warn('Login failed: Invalid password', undefined, { email });
            throw new UnauthorizedException('Invalid credentials');
        }

        const payload = { sub: user.id, email: user.email };
        const token = await this.jwtService.signAsync(payload);

        this.logger.log('Login successful', { email, userId: user.id });

        return { access_token: token };
    }

}
