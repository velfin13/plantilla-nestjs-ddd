import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskModule } from './task/infrastructure/modules/task.module';
import { TaskEntity } from './task/infrastructure/persistence/task.entity';
import { UserModule } from './user/infrastructure/modules/user.module';
import { UserEntity } from './user/infrastructure/persistence/user.entity';
import { AuthModule } from './auth/infrastructure/modules/auth.module';
import { appConfig, databaseConfig, jwtConfig } from './config';
import { DatabaseConfig } from './config/config.interface';
import { LoggerModule } from './common/infrastructure/logger/logger.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, databaseConfig, jwtConfig],
      envFilePath: ['.env.local', '.env'],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const dbConfig = config.get<DatabaseConfig>('database');
        return {
          ...dbConfig,
          entities: [TaskEntity, UserEntity],
        };
      },
    }),
    LoggerModule,
    TaskModule,
    AuthModule,
    UserModule
  ],
})
export class AppModule { }
