import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { TaskModule } from './task/infrastructure/modules/task.module';
import { TaskEntity } from './task/infrastructure/persistence/task.entity';
import { UserModule } from './user/infrastructure/modules/user.module';
import { UserEntity } from './user/infrastructure/persistence/user.entity';
import { AuthModule } from './auth/infrastructure/modules/auth.module';
import { appConfig, databaseConfig, jwtConfig, throttlerConfig } from './config';
import { DatabaseConfig } from './config/config.interface';
import { LoggerModule } from './common/infrastructure/logger/logger.module';
import { HealthModule } from './common/infrastructure/modules/health.module';
import { LoggingInterceptor } from './common/infrastructure/interceptors/logging.interceptor';
import { validate } from './config/env.validation';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, databaseConfig, jwtConfig, throttlerConfig],
      envFilePath: ['.env.local', '.env'],
      validate,
      validationOptions: {
        allowUnknown: true,
        abortEarly: false,
      },
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
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        throttlers: [{
          ttl: config.get('throttler.ttl', 60) * 1000, // Convertir a milisegundos
          limit: config.get('throttler.limit', 10),
        }],
      }),
    }),
    LoggerModule,
    HealthModule,
    TaskModule,
    AuthModule,
    UserModule
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
  ],
})
export class AppModule { }
