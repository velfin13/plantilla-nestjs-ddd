import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type { UserRepository } from 'src/user/domain/repositories/user.repository';
import * as bcrypt from 'bcrypt';

@Injectable()
export class LoginUseCase {
    constructor(
        private readonly userRepo: UserRepository,
        private readonly jwtService: JwtService,
    ) { }

    async execute(email: string, password: string) {
        const user = await this.userRepo.findByEmail(email);
        
        if (!user) throw new UnauthorizedException('Invalid credentials');

        if (!user.password) {
            throw new Error('User password not found in database');
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) throw new UnauthorizedException('Invalid credentials');

        const payload = { sub: user.id, email: user.email };
        const token = await this.jwtService.signAsync(payload);

        return { access_token: token };
    }

}
