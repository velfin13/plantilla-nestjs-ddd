import { Password } from '../../../../src/user/domain/value-objects/password.vo';
import { ValidationException } from '../../../../src/common/domain/exceptions';

describe('Password Value Object', () => {
  describe('create', () => {
    it('should create a valid password', () => {
      const password = Password.create('Test1234');
      expect(password.getValue()).toBe('Test1234');
    });

    it('should throw error for empty password', () => {
      expect(() => Password.create('')).toThrow(ValidationException);
      expect(() => Password.create('')).toThrow('Password is required');
    });

    it('should throw error for password too short', () => {
      expect(() => Password.create('Test12')).toThrow(ValidationException);
      expect(() => Password.create('Test12')).toThrow('Password must be at least 8 characters long');
    });

    it('should throw error for password without lowercase', () => {
      expect(() => Password.create('TEST1234')).toThrow(ValidationException);
      expect(() => Password.create('TEST1234')).toThrow('Password must contain at least one lowercase letter');
    });

    it('should throw error for password without uppercase', () => {
      expect(() => Password.create('test1234')).toThrow(ValidationException);
      expect(() => Password.create('test1234')).toThrow('Password must contain at least one uppercase letter');
    });

    it('should throw error for password without number', () => {
      expect(() => Password.create('TestTest')).toThrow(ValidationException);
      expect(() => Password.create('TestTest')).toThrow('Password must contain at least one number');
    });

    it('should accept valid complex password', () => {
      const password = Password.create('MyP@ssw0rd123');
      expect(password.getValue()).toBe('MyP@ssw0rd123');
    });
  });

  describe('fromHash', () => {
    it('should create password from hash without validation', () => {
      const hashedValue = '$2b$10$abcdefghijklmnopqrstuvwxyz';
      const password = Password.fromHash(hashedValue);
      expect(password.getValue()).toBe(hashedValue);
    });
  });

  describe('hash', () => {
    it('should hash a password', async () => {
      const password = Password.create('Test1234');
      const hashed = await password.hash();
      
      expect(hashed).toBeDefined();
      expect(hashed).not.toBe('Test1234');
      expect(hashed.startsWith('$2b$')).toBe(true);
    });

    it('should generate different hashes for same password', async () => {
      const password1 = Password.create('Test1234');
      const password2 = Password.create('Test1234');
      
      const hash1 = await password1.hash();
      const hash2 = await password2.hash();
      
      expect(hash1).not.toBe(hash2);
    });
  });

  describe('compare', () => {
    it('should return true for matching password', async () => {
      const plainPassword = 'Test1234';
      const password = Password.create(plainPassword);
      const hashed = await password.hash();
      
      const hashedPassword = Password.fromHash(hashed);
      const isMatch = await hashedPassword.compare(plainPassword);
      
      expect(isMatch).toBe(true);
    });

    it('should return false for non-matching password', async () => {
      const password = Password.create('Test1234');
      const hashed = await password.hash();
      
      const hashedPassword = Password.fromHash(hashed);
      const isMatch = await hashedPassword.compare('Wrong1234');
      
      expect(isMatch).toBe(false);
    });
  });

  describe('getValue', () => {
    it('should return password value', () => {
      const password = Password.create('Test1234');
      expect(password.getValue()).toBe('Test1234');
    });
  });
});
