import { Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from '../controllers/auth.controller';
import { JwtStrategy } from '../jwt.strategy';
import { LoginUseCase } from '../../application/use-cases/login.usecase';
import { UserModule } from 'src/user/infrastructure/modules/user.module';
import { CreateUserUseCase } from 'src/user/application/use-cases/create-user.usecase';

@Module({
    imports: [
        PassportModule,
        JwtModule.register({
            secret: process.env.JWT_SECRET || 'secret-key',
            signOptions: { expiresIn: '1h' },
        }),
        UserModule,
    ],
    controllers: [AuthController],
    providers: [
        {
            provide: CreateUserUseCase,
            useFactory: (userRepo) => new CreateUserUseCase(userRepo),
            inject: ['UserRepository'],
        },
        {
            provide: LoginUseCase,
            useFactory: (userRepo, jwtService) => new LoginUseCase(userRepo, jwtService),
            inject: ['UserRepository', JwtService],
        },
        JwtStrategy,
    ],
})
export class AuthModule { }
