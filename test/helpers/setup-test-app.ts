import { INestApplication, ValidationPipe, ClassSerializerInterceptor } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { DomainExceptionFilter } from '../../src/common/infrastructure/filters/domain-exception.filter';

export function setupTestApp(app: INestApplication): void {
  // Configurar prefijo global de API
  app.setGlobalPrefix('api');

  // Configurar Exception Filter global
  app.useGlobalFilters(new DomainExceptionFilter());

  // Configurar ValidationPipe global
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Configurar ClassSerializerInterceptor global
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  
  // Deshabilitar throttler en tests
  process.env.THROTTLE_TTL = '999999';
  process.env.THROTTLE_LIMIT = '999999';
}
