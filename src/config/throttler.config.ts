import { registerAs } from '@nestjs/config';

export interface ThrottlerConfig {
  ttl: number;  // Time to live (en segundos)
  limit: number; // Número máximo de requests
}

export default registerAs('throttler', (): ThrottlerConfig => ({
  ttl: parseInt(process.env.THROTTLE_TTL || '60', 10), // 60 segundos por defecto
  limit: parseInt(process.env.THROTTLE_LIMIT || '10', 10), // 10 requests por defecto
}));
