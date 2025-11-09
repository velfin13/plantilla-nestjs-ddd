import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskModule } from './task/infrastructure/modules/task.module';
import { TaskEntity } from './task/infrastructure/persistence/task.entity';
import { UserModule } from './user/infrastructure/modules/user.module';
import { UserEntity } from './user/infrastructure/persistence/user.entity';
import { AuthModule } from './auth/infrastructure/modules/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: config.get<'postgres'>('DB_TYPE', 'postgres'),
        host: config.get<string>('DB_HOST', 'localhost'),
        port: parseInt(config.get<string>('DB_PORT', '5432'), 10),
        username: config.get<string>('DB_USERNAME', 'user'),
        password: config.get<string>('DB_PASSWORD', 'password'),
        database: config.get<string>('DB_NAME', 'db'),
        entities: [TaskEntity, UserEntity],
        synchronize: true,
      }),
    }),
    TaskModule,
    AuthModule,
    UserModule
  ],
})
export class AppModule { }
