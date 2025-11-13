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

## 🗃️ Migraciones de Base de Datos

Este proyecto usa TypeORM migrations para gestionar el schema de la base de datos.

### Configuración

1. Asegúrate de tener las variables de entorno correctas en `.env`
2. `synchronize` está deshabilitado - usa siempre migrations

### Comandos

```bash
# Generar migración automática (detecta cambios en entidades)
npm run migration:generate -- src/migrations/MigrationName

# Crear migración vacía (para cambios manuales)
npm run migration:create -- src/migrations/MigrationName

# Ejecutar migraciones pendientes
npm run migration:run

# Revertir última migración
npm run migration:revert

# Ver estado de migraciones
npm run migration:show
```

### Flujo de Trabajo

1. **Modificas una entidad** (ej: agregas un campo)
2. **Generas la migración**: `npm run migration:generate -- src/migrations/AddFieldToUser`
3. **Revisas el archivo** generado en `src/migrations/`
4. **Ejecutas la migración**: `npm run migration:run`

### Importante

- **Nunca** uses `synchronize: true` en producción
- **Siempre revisa** las migraciones generadas antes de ejecutarlas
- **Commitea** los archivos de migración al repositorio
- Las migraciones se ejecutan en orden cronológico (timestamp en el nombre)



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

⚠️ **Este proyecto valida las variables de entorno en tiempo de arranque** usando class-validator.

Ver `.env.example` para todas las variables disponibles. Las variables **REQUERIDAS** son:

**Base de Datos:**
- `DB_HOST` - Hostname de PostgreSQL (REQUERIDO)
- `DB_PORT` - Puerto de base de datos (REQUERIDO)
- `DB_USERNAME` - Usuario (REQUERIDO)
- `DB_PASSWORD` - Contraseña (REQUERIDO)
- `DB_NAME` - Nombre de la base de datos (REQUERIDO)

**JWT:**
- `JWT_SECRET` - Secret key para tokens (REQUERIDO)

**Opcionales (con defaults):**
- `NODE_ENV`: development/production/test (default: development)
- `PORT`: Puerto de la aplicación (default: 3000)
- `DB_LOGGING`: Habilitar logs de SQL (default: false)
- `JWT_EXPIRES_IN`: Expiración del token (default: 1d)
- `THROTTLE_TTL`: Ventana de tiempo para rate limiting en segundos (default: 60)
- `THROTTLE_LIMIT`: Máximo de requests por ventana (default: 10)
- `CORS_ORIGIN`: Orígenes permitidos (default: *)

📖 Ver documentación completa en [`docs/ENV_VALIDATION.md`](docs/ENV_VALIDATION.md)

### TypeORM

**Importante**: Este proyecto usa **migraciones** para gestionar el schema de la base de datos.

`synchronize: false` está configurado para evitar cambios automáticos en producción. Ver sección "Migraciones de Base de Datos" para más detalles.

## 📖 Próximas Mejoras Sugeridas

- [ ] Implementar CQRS con `@nestjs/cqrs`
- [ ] Agregar Redis para caché
- [ ] Domain Events con Event Bus
- [ ] Agregar tests unitarios y e2e (0% cobertura actual)
- [ ] CI/CD pipeline (GitHub Actions)
- [ ] Métricas con Prometheus
- [ ] Soft deletes en entidades
- [ ] Validación de variables de entorno con class-validator

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
