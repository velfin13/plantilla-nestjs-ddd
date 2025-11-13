# Plantilla NestJS con DDD (Domain-Driven Design)

Plantilla de proyecto NestJS estructurada siguiendo principios de **Domain-Driven Design (DDD)** con autenticación JWT, TypeORM, PostgreSQL y mejores prácticas.

## 🏗️ Arquitectura

El proyecto está organizado en capas siguiendo DDD:

```
src/
├── common/                    # Código compartido
│   ├── domain/
│   │   └── exceptions/       # Excepciones de dominio
│   ├── dto/                  # DTOs compartidos (paginación)
│   ├── infrastructure/
│   │   ├── interceptors/     # Interceptores globales
│   │   └── logger/           # Sistema de logging
│   └── repositories/         # Repositorios base abstractos
│
├── config/                    # Configuración tipada
│   ├── app.config.ts
│   ├── database.config.ts
│   └── jwt.config.ts
│
├── [modulo]/                 # Cada módulo sigue esta estructura:
│   ├── application/
│   │   ├── mappers/          # Mappers Domain ↔ Infrastructure
│   │   └── use-cases/        # Casos de uso (lógica de aplicación)
│   ├── domain/
│   │   ├── entities/         # Entidades de dominio (lógica de negocio)
│   │   ├── repositories/     # Interfaces de repositorios
│   │   └── value-objects/    # Value Objects
│   └── infrastructure/
│       ├── controllers/      # Controladores HTTP
│       ├── dto/              # DTOs de entrada/salida
│       ├── modules/          # Módulos de NestJS
│       └── persistence/      # Implementaciones de repositorios
```

## ✨ Características

### Implementadas

- ✅ **Arquitectura DDD** con separación clara de capas
- ✅ **Excepciones de Dominio** personalizadas
- ✅ **Value Objects** para validaciones (Email, Phone, Password)
- ✅ **Mappers** entre capas (Domain ↔ Infrastructure)
- ✅ **Serialización** automática (excluye passwords de respuestas)
- ✅ **Validación** en entidades de dominio
- ✅ **Paginación** en endpoints GET
- ✅ **Configuración tipada** por ambiente
- ✅ **Logger Service** personalizado
- ✅ **Docker & Docker Compose** para desarrollo
- ✅ **Autenticación JWT** con Passport
- ✅ **TypeORM** con PostgreSQL
- ✅ **Swagger/OpenAPI** documentado

## 🚀 Inicio Rápido

### Prerrequisitos

- Node.js 20+
- Docker y Docker Compose (opcional)
- PostgreSQL (si no usas Docker)

### Instalación

1. **Clonar y configurar:**

```bash
# Copiar variables de entorno
cp .env.example .env

# Editar .env con tus valores
```

2. **Con Docker (Recomendado):**

```bash
# Levantar servicios
docker-compose up -d

# Ver logs
docker-compose logs -f app
```

3. **Sin Docker:**

```bash
# Instalar dependencias
npm install

# Asegúrate de tener PostgreSQL corriendo y configurado en .env

# Modo desarrollo
npm run start:dev

# Modo producción
npm run build
npm run start:prod
```

## 📚 API Endpoints

### Autenticación

- `POST /api/auth/register` - Registrar usuario
- `POST /api/auth/login` - Iniciar sesión (retorna JWT)

### Usuarios

- `GET /api/users?page=1&limit=10` - Listar usuarios (con paginación opcional)
- `POST /api/users` - Crear usuario

### Tareas

- `GET /api/tasks?page=1&limit=10` - Listar tareas (con paginación opcional)
- `POST /api/tasks` - Crear tarea
- `PATCH /api/tasks/toggle` - Alternar estado de tarea

### Swagger

Documentación interactiva disponible en: `http://localhost:3000/api`

## 🔐 Seguridad

- Passwords hasheados con bcrypt
- JWT para autenticación
- Validación de DTOs con class-validator
- Value Objects para validación de dominio
- Serialización automática (passwords excluidos)
- Variables de entorno para secretos

## 📝 Mejores Prácticas Implementadas

### Domain-Driven Design

1. **Entidades de Dominio**: Contienen lógica de negocio y validaciones
2. **Value Objects**: Encapsulan validaciones complejas (Email, Phone, Password)
3. **Repositorios**: Interfaces en dominio, implementaciones en infraestructura
4. **Use Cases**: Orquestan la lógica de aplicación
5. **Mappers**: Convierten entre capas sin acoplarlas

### Clean Code

- Separación de responsabilidades
- Inyección de dependencias
- Configuración tipada
- Manejo de errores consistente
- Logging estructurado

## 🧪 Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## 📦 Scripts Disponibles

```bash
npm run start          # Iniciar en modo normal
npm run start:dev      # Iniciar en modo desarrollo (watch)
npm run start:debug    # Iniciar con debugger
npm run start:prod     # Iniciar en modo producción

npm run build          # Compilar proyecto
npm run lint           # Ejecutar linter
npm run format         # Formatear código con Prettier
```

## 🐳 Docker

### Desarrollo

```bash
docker-compose up -d
```

### Producción

```bash
docker build --target production -t nestjs-ddd:prod .
docker run -p 3000:3000 --env-file .env nestjs-ddd:prod
```

## 🔧 Configuración

### Variables de Entorno

Ver `.env.example` para todas las variables disponibles:

- `NODE_ENV`: Ambiente (development/production)
- `PORT`: Puerto de la aplicación
- `DB_*`: Configuración de base de datos
- `JWT_SECRET`: Secreto para JWT
- `JWT_EXPIRES_IN`: Tiempo de expiración del token

### TypeORM

La sincronización automática está habilitada en desarrollo. En producción, usa migraciones:

```bash
npm run migration:generate -- -n MigrationName
npm run migration:run
```

## 📖 Próximas Mejoras Sugeridas

- [ ] Implementar CQRS con `@nestjs/cqrs`
- [ ] Agregar Redis para caché
- [ ] Implementar Rate Limiting
- [ ] Domain Events con Event Bus
- [ ] Agregar tests unitarios y e2e
- [ ] CI/CD pipeline
- [ ] Health checks y métricas
- [ ] Soft deletes en entidades

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.

## 👤 Autor

- GitHub: [@velfin13](https://github.com/velfin13)

## 🙏 Agradecimientos

- [NestJS](https://nestjs.com/)
- [TypeORM](https://typeorm.io/)
- Comunidad DDD
