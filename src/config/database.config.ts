import { registerAs } from '@nestjs/config';
import { DatabaseConfig } from './config.interface';

export default registerAs('database', (): DatabaseConfig => ({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USERNAME || 'user',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'db',
  synchronize: false,
}));
