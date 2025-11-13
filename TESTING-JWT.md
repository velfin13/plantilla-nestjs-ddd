# Guía de Testing con JWT

## 1. Registrar un usuario

```bash
curl -X 'POST' \
  'http://localhost:3000/api/auth/register' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
  "name": "Juan",
  "lastname": "Pérez",
  "phone": "+573001234567",
  "email": "juan.perez@example.com",
  "password": "SecurePass123"
}'
```

## 2. Hacer login y obtener token

```bash
curl -X 'POST' \
  'http://localhost:3000/api/auth/login' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
  "email": "juan.perez@example.com",
  "password": "SecurePass123"
}'
```

**Respuesta:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

## 3. Usar el token para acceder a endpoints protegidos

### ❌ Sin token (Error 401):
```bash
curl -X 'GET' \
  'http://localhost:3000/api/Users?page=1&limit=10' \
  -H 'accept: application/json'
```

**Respuesta:**
```json
{
  "statusCode": 401,
  "message": "Unauthorized"
}
```

### ✅ Con token (Éxito 200):
```bash
curl -X 'GET' \
  'http://localhost:3000/api/Users?page=1&limit=10' \
  -H 'accept: application/json' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
```

**Respuesta:**
```json
{
  "data": [
    {
      "id": "1576e16d-17c7-45c4-bbe5-807d60bca74a",
      "name": "Juan",
      "lastname": "Pérez",
      "phone": "+573001234567",
      "email": "juan.perez@example.com",
      "active": true
    }
  ],
  "meta": {
    "total": 1,
    "page": 1,
    "limit": 10,
    "totalPages": 1
  }
}
```

## 4. Probar con Swagger

1. Ve a: `http://localhost:3000/api/docs`
2. Haz clic en el botón **"Authorize"** 🔓 (arriba a la derecha)
3. Ingresa el token en el formato: `Bearer tu_token_aqui`
4. Haz clic en **"Authorize"**
5. Ahora puedes probar todos los endpoints desde Swagger

## Endpoints Protegidos 🔒

Todos estos endpoints ahora requieren JWT:

- `GET /api/Users` - Listar usuarios
- `POST /api/Users` - Crear usuario
- `GET /api/tasks` - Listar tareas
- `POST /api/tasks` - Crear tarea
- `PATCH /api/tasks/toggle` - Cambiar estado tarea

## Endpoints Públicos 🌐

Estos NO requieren autenticación:

- `POST /api/auth/register` - Registro
- `POST /api/auth/login` - Login
- `GET /api/health` - Health check

## Variables de Entorno

Asegúrate de tener configurado en `.env`:

```bash
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRES_IN=1d
```

## Ejemplo Completo con Variables

```bash
# 1. Login y guardar token
TOKEN=$(curl -s -X 'POST' \
  'http://localhost:3000/api/auth/login' \
  -H 'Content-Type: application/json' \
  -d '{
    "email": "juan.perez@example.com",
    "password": "SecurePass123"
  }' | jq -r '.access_token')

# 2. Usar el token
curl -X 'GET' \
  'http://localhost:3000/api/Users' \
  -H 'accept: application/json' \
  -H "Authorization: Bearer $TOKEN"
```

## Troubleshooting

### Error 401 Unauthorized
- Verifica que el token sea válido
- Verifica que el formato sea: `Bearer token`
- Verifica que el token no haya expirado

### Error 403 Forbidden
- El usuario no tiene permisos (cuando implementes roles)

### Error 400 Bad Request
- Datos de entrada inválidos
- Falta el password en el login
- Email con formato incorrecto
