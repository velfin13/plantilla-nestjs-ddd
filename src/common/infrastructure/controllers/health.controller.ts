import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { HealthCheck, HealthCheckService, TypeOrmHealthIndicator, MemoryHealthIndicator, DiskHealthIndicator } from '@nestjs/terminus';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private db: TypeOrmHealthIndicator,
    private memory: MemoryHealthIndicator,
    private disk: DiskHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  @ApiOperation({ summary: 'Health check endpoint - Verifica estado del servicio, BD, memoria y disco' })
  @ApiResponse({ 
    status: 200, 
    description: 'Service is healthy',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', example: 'ok' },
        info: {
          type: 'object',
          example: {
            database: { status: 'up' },
            memory_heap: { status: 'up' },
            memory_rss: { status: 'up' },
            storage: { status: 'up' }
          }
        },
        error: { type: 'object' },
        details: {
          type: 'object',
          example: {
            database: { status: 'up' },
            memory_heap: { status: 'up' },
            memory_rss: { status: 'up' },
            storage: { status: 'up' }
          }
        }
      },
    },
  })
  @ApiResponse({ 
    status: 503, 
    description: 'Service is unhealthy',
  })
  check() {
    return this.health.check([
      // Verifica conexión a la base de datos
      () => this.db.pingCheck('database'),
      
      // Verifica uso de memoria heap (máximo 150MB)
      () => this.memory.checkHeap('memory_heap', 150 * 1024 * 1024),
      
      // Verifica uso de memoria RSS (máximo 300MB)
      () => this.memory.checkRSS('memory_rss', 300 * 1024 * 1024),
      
      // Verifica espacio en disco (mínimo 50% libre)
      () => this.disk.checkStorage('storage', { 
        path: '/', 
        thresholdPercent: 0.5 
      }),
    ]);
  }

  @Get('liveness')
  @HealthCheck()
  @ApiOperation({ summary: 'Liveness probe - Verifica si la app está viva' })
  @ApiResponse({ status: 200, description: 'App is alive' })
  checkLiveness() {
    return this.health.check([]);
  }

  @Get('readiness')
  @HealthCheck()
  @ApiOperation({ summary: 'Readiness probe - Verifica si la app está lista para recibir tráfico' })
  @ApiResponse({ status: 200, description: 'App is ready' })
  @ApiResponse({ status: 503, description: 'App is not ready' })
  checkReadiness() {
    return this.health.check([
      () => this.db.pingCheck('database'),
    ]);
  }
}
