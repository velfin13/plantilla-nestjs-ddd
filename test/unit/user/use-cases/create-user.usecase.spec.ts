import { BadRequestException } from '@nestjs/common';
import { CreateUserUseCase } from '../../../../src/user/application/use-cases/create-user.usecase';
import { User } from '../../../../src/user/domain/entities/user.entity';
import { createMockRepository, createMockLogger } from '../../../helpers/test-helpers';

describe('CreateUserUseCase', () => {
  let useCase: CreateUserUseCase;
  let mockUserRepo: ReturnType<typeof createMockRepository>;
  let mockLogger: ReturnType<typeof createMockLogger>;

  beforeEach(() => {
    mockUserRepo = createMockRepository();
    mockLogger = createMockLogger();
    useCase = new CreateUserUseCase(mockUserRepo as any, mockLogger as any);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const validDto = {
    name: 'John',
    lastname: 'Doe',
    email: 'john.doe@example.com',
    phone: '+1234567890',
    password: 'Test1234',
  };

  describe('execute', () => {
    it('should create a new user successfully', async () => {
      mockUserRepo.findByEmail.mockResolvedValue(null);
      mockUserRepo.save.mockResolvedValue(undefined);

      const user = await useCase.execute(validDto);

      expect(user).toBeInstanceOf(User);
      expect(user.name).toBe(validDto.name);
      expect(user.email).toBe(validDto.email);
      expect(user.active).toBe(true);
      expect(mockUserRepo.findByEmail).toHaveBeenCalledWith(validDto.email);
      expect(mockUserRepo.save).toHaveBeenCalledWith(expect.any(User));
      expect(mockLogger.log).toHaveBeenCalledWith('Creating new user', { email: validDto.email });
      expect(mockLogger.log).toHaveBeenCalledWith('User created successfully', expect.objectContaining({ email: validDto.email }));
    });

    it('should hash the password', async () => {
      mockUserRepo.findByEmail.mockResolvedValue(null);
      mockUserRepo.save.mockResolvedValue(undefined);

      const user = await useCase.execute(validDto);

      expect(user.password).not.toBe(validDto.password);
      expect(user.password.startsWith('$2b$')).toBe(true);
    });

    it('should generate a UUID for new user', async () => {
      mockUserRepo.findByEmail.mockResolvedValue(null);
      mockUserRepo.save.mockResolvedValue(undefined);

      const user = await useCase.execute(validDto);

      expect(user.id).toBeDefined();
      expect(user.id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/);
    });

    it('should throw BadRequestException if email already exists', async () => {
      const existingUser = new User.Builder()
        .setId('existing-id')
        .setName('Existing')
        .setLastname('User')
        .setEmail(validDto.email)
        .setPhone('+9876543210')
        .setPassword('hashedpass')
        .build();

      mockUserRepo.findByEmail.mockResolvedValue(existingUser);

      await expect(useCase.execute(validDto)).rejects.toThrow(BadRequestException);
      await expect(useCase.execute(validDto)).rejects.toThrow('Email already registered');
      expect(mockUserRepo.save).not.toHaveBeenCalled();
      expect(mockLogger.warn).toHaveBeenCalledWith(
        'User creation failed: Email already registered',
        undefined,
        { email: validDto.email }
      );
    });

    it('should call repository methods in correct order', async () => {
      mockUserRepo.findByEmail.mockResolvedValue(null);
      mockUserRepo.save.mockResolvedValue(undefined);

      await useCase.execute(validDto);

      const callOrder = mockUserRepo.findByEmail.mock.invocationCallOrder[0];
      const saveOrder = mockUserRepo.save.mock.invocationCallOrder[0];
      expect(callOrder).toBeLessThan(saveOrder);
    });
  });
});
