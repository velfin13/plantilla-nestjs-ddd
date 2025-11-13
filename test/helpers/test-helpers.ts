import { Test, TestingModule } from '@nestjs/testing';

/**
 * Crea un módulo de testing con los providers especificados
 */
export async function createTestingModule(providers: any[]): Promise<TestingModule> {
  return Test.createTestingModule({
    providers,
  }).compile();
}

/**
 * Mock de repositorio genérico
 */
export const createMockRepository = () => ({
  findAll: jest.fn(),
  findById: jest.fn(),
  findByEmail: jest.fn(),
  save: jest.fn(),
  delete: jest.fn(),
});

/**
 * Mock de LoggerService
 */
export const createMockLogger = () => ({
  log: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  debug: jest.fn(),
  verbose: jest.fn(),
  setContext: jest.fn(),
});

/**
 * Mock de JwtService
 */
export const createMockJwtService = () => ({
  sign: jest.fn(),
  signAsync: jest.fn(),
  verify: jest.fn(),
});

/**
 * Datos de prueba para User
 */
export const mockUserData = {
  id: '123e4567-e89b-12d3-a456-426614174000',
  name: 'John',
  lastname: 'Doe',
  email: 'john.doe@example.com',
  phone: '+1234567890',
  password: 'hashedPassword123',
  active: true,
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
};

/**
 * Datos de prueba para Task
 */
export const mockTaskData = {
  id: '123e4567-e89b-12d3-a456-426614174001',
  title: 'Test Task',
  completed: false,
  userId: '123e4567-e89b-12d3-a456-426614174000',
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
};

/**
 * Espera a que todas las promesas pendientes se resuelvan
 */
export const flushPromises = () => new Promise(resolve => setImmediate(resolve));
