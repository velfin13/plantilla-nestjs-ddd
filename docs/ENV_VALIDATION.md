# Validación de Variables de Entorno

Este proyecto usa **class-validator** para validar las variables de entorno en tiempo de arranque.

## Variables Requeridas

Las siguientes variables **DEBEN** estar definidas o la aplicación no arrancará:

### Base de Datos
- `DB_HOST` - Hostname de PostgreSQL
- `DB_PORT` - Puerto (1-65535)
- `DB_USERNAME` - Usuario de base de datos
- `DB_PASSWORD` - Contraseña
- `DB_NAME` - Nombre de la base de datos

### JWT
- `JWT_SECRET` - Secret key para JWT

## Variables Opcionales (con defaults)

- `NODE_ENV` - development/production/test (default: development)
- `PORT` - Puerto de la app (default: 3000)
- `API_PREFIX` - Prefijo de rutas (default: 'api')
- `CORS_ORIGIN` - Origen CORS (default: '*')
- `DB_TYPE` - Tipo de DB (default: 'postgres')
- `DB_LOGGING` - Habilitar logs SQL (default: false)
- `JWT_EXPIRES_IN` - Expiración token (default: '1d')
- `THROTTLE_TTL` - Rate limit TTL (default: 60)
- `THROTTLE_LIMIT` - Max requests (default: 10)

## Validaciones Aplicadas

### Números
- `PORT`: 1-65535
- `DB_PORT`: 1-65535
- `THROTTLE_TTL`: ≥ 1
- `THROTTLE_LIMIT`: ≥ 1

### Enums
- `NODE_ENV`: development | production | test

### Tipos
- Conversión automática de strings a números/booleans
- Validación de tipos con class-validator

## Comportamiento

Si alguna variable requerida falta o es inválida:
- ❌ La aplicación **NO arrancará**
- 🚨 Se mostrará un error detallado indicando qué variables fallan
- 📋 Se listarán todas las validaciones fallidas

## Ejemplo de Error

```
Config validation error:
DB_HOST: DB_HOST should not be empty, DB_HOST must be a string
JWT_SECRET: JWT_SECRET should not be empty, JWT_SECRET must be a string
PORT: PORT must not be greater than 65535
```

## Testing

Para probar la validación, intenta arrancar la app sin una variable requerida:

```bash
unset DB_HOST
npm run start:dev
```

Verás un error de validación antes de que NestJS intente conectar.
