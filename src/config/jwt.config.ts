import { registerAs } from '@nestjs/config';
import { JwtConfig } from './config.interface';

export default registerAs('jwt', (): JwtConfig => ({
  secret: process.env.JWT_SECRET || 'your-secret-key-change-in-production',
  expiresIn: process.env.JWT_EXPIRES_IN || '1d',
}));
