import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe, ClassSerializerInterceptor } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { DomainExceptionFilter } from './common/infrastructure/filters/domain-exception.filter';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configurar Helmet para seguridad HTTP
  app.use(helmet());

  // Configurar CORS
  app.enableCors({
    origin: process.env.CORS_ORIGIN || '*', // En producción, especificar dominios permitidos
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // Configurar prefijo global de API
  app.setGlobalPrefix('api');

  // Configurar Exception Filter global
  app.useGlobalFilters(new DomainExceptionFilter());

  // Configurar ValidationPipe global
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Elimina propiedades no definidas en el DTO
      forbidNonWhitelisted: true, // Lanza error si hay propiedades no permitidas
      transform: true, // Transforma tipos automáticamente
      transformOptions: {
        enableImplicitConversion: true, // Conversión implícita de tipos
      },
    }),
  );

  // Configurar ClassSerializerInterceptor global
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  // Configuración de Swagger
  const config = new DocumentBuilder()
    .setTitle('API NestJS DDD')
    .setDescription('API REST con arquitectura DDD, autenticación JWT y mejores prácticas')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth', // Este es el nombre que se usará en los controladores
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
