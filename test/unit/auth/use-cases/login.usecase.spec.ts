import { UnauthorizedException } from '@nestjs/common';
import { LoginUseCase } from '../../../../src/auth/application/use-cases/login.usecase';
import { User } from '../../../../src/user/domain/entities/user.entity';
import { createMockRepository, createMockJwtService, createMockLogger } from '../../../helpers/test-helpers';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt');

describe('LoginUseCase', () => {
  let useCase: LoginUseCase;
  let mockUserRepo: ReturnType<typeof createMockRepository>;
  let mockJwtService: ReturnType<typeof createMockJwtService>;
  let mockLogger: ReturnType<typeof createMockLogger>;

  beforeEach(() => {
    mockUserRepo = createMockRepository();
    mockJwtService = createMockJwtService();
    mockLogger = createMockLogger();
    useCase = new LoginUseCase(mockUserRepo as any, mockJwtService as any, mockLogger as any);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const validEmail = 'john.doe@example.com';
  const validPassword = 'Test1234';
  const hashedPassword = '$2b$10$abcdefghijklmnopqrstuvwxyz';

  const mockUser = new User.Builder()
    .setId('123e4567-e89b-12d3-a456-426614174000')
    .setName('John')
    .setLastname('Doe')
    .setEmail(validEmail)
    .setPhone('+1234567890')
    .setPassword(hashedPassword)
    .build();

  describe('execute', () => {
    it('should login successfully with valid credentials', async () => {
      mockUserRepo.findByEmail.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      mockJwtService.signAsync.mockResolvedValue('mock-jwt-token');

      const result = await useCase.execute(validEmail, validPassword);

      expect(result).toEqual({ access_token: 'mock-jwt-token' });
      expect(mockUserRepo.findByEmail).toHaveBeenCalledWith(validEmail);
      expect(bcrypt.compare).toHaveBeenCalledWith(validPassword, hashedPassword);
      expect(mockJwtService.signAsync).toHaveBeenCalledWith({
        sub: mockUser.id,
        email: mockUser.email,
      });
      expect(mockLogger.log).toHaveBeenCalledWith('Login attempt', { email: validEmail });
      expect(mockLogger.log).toHaveBeenCalledWith('Login successful', { email: validEmail, userId: mockUser.id });
    });

    it('should throw UnauthorizedException when user not found', async () => {
      mockUserRepo.findByEmail.mockResolvedValue(null);

      await expect(useCase.execute(validEmail, validPassword)).rejects.toThrow(UnauthorizedException);
      await expect(useCase.execute(validEmail, validPassword)).rejects.toThrow('Invalid credentials');
      expect(bcrypt.compare).not.toHaveBeenCalled();
      expect(mockJwtService.signAsync).not.toHaveBeenCalled();
      expect(mockLogger.warn).toHaveBeenCalledWith('Login failed: User not found', undefined, { email: validEmail });
    });

    it('should throw UnauthorizedException when password is incorrect', async () => {
      mockUserRepo.findByEmail.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(useCase.execute(validEmail, 'WrongPassword')).rejects.toThrow(UnauthorizedException);
      await expect(useCase.execute(validEmail, 'WrongPassword')).rejects.toThrow('Invalid credentials');
      expect(mockJwtService.signAsync).not.toHaveBeenCalled();
      expect(mockLogger.warn).toHaveBeenCalledWith('Login failed: Invalid password', undefined, { email: validEmail });
    });

    it('should throw error when user has no password', async () => {
      const userWithoutPassword = new User.Builder()
        .setId('123e4567-e89b-12d3-a456-426614174000')
        .setName('John')
        .setLastname('Doe')
        .setEmail(validEmail)
        .setPhone('+1234567890')
        .setPassword('')
        .build();

      userWithoutPassword.password = '';
      mockUserRepo.findByEmail.mockResolvedValue(userWithoutPassword);

      await expect(useCase.execute(validEmail, validPassword)).rejects.toThrow('User password not found in database');
      expect(mockLogger.error).toHaveBeenCalled();
    });

    it('should generate correct JWT payload', async () => {
      mockUserRepo.findByEmail.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      mockJwtService.signAsync.mockResolvedValue('mock-token');

      await useCase.execute(validEmail, validPassword);

      expect(mockJwtService.signAsync).toHaveBeenCalledWith({
        sub: mockUser.id,
        email: mockUser.email,
      });
    });
  });
});
