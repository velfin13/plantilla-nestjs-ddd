import { Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from '../controllers/auth.controller';
import { JwtStrategy } from '../jwt.strategy';
import { LoginUseCase } from '../../application/use-cases/login.usecase';
import { UserModule } from 'src/user/infrastructure/modules/user.module';
import { CreateUserUseCase } from 'src/user/application/use-cases/create-user.usecase';
import { LoggerModule } from 'src/common/infrastructure/logger/logger.module';

@Module({
    imports: [
        PassportModule,
        JwtModule.register({
            secret: process.env.JWT_SECRET || 'secret-key',
            signOptions: { expiresIn: '1h' },
        }),
        UserModule,
        LoggerModule,
    ],
    controllers: [AuthController],
    providers: [
        {
            provide: CreateUserUseCase,
            useFactory: (userRepo, logger) => new CreateUserUseCase(userRepo, logger),
            inject: ['UserRepository', 'LoggerService'],
        },
        {
            provide: LoginUseCase,
            useFactory: (userRepo, jwtService, logger) => new LoginUseCase(userRepo, jwtService, logger),
            inject: ['UserRepository', JwtService, 'LoggerService'],
        },
        JwtStrategy,
    ],
})
export class AuthModule { }
