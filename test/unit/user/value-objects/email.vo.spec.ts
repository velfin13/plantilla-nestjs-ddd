import { Email } from '../../../../src/user/domain/value-objects/email.vo';
import { ValidationException } from '../../../../src/common/domain/exceptions';

describe('Email Value Object', () => {
  describe('constructor', () => {
    it('should create a valid email', () => {
      const email = new Email('test@example.com');
      expect(email.getValue()).toBe('test@example.com');
    });

    it('should convert email to lowercase', () => {
      const email = new Email('Test@Example.COM');
      expect(email.getValue()).toBe('test@example.com');
    });

    it('should trim trailing whitespace', () => {
      const email = new Email('test@example.com   ');
      expect(email.getValue()).toBe('test@example.com');
    });

    it('should throw error for empty email', () => {
      expect(() => new Email('')).toThrow(ValidationException);
      expect(() => new Email('')).toThrow('Email is required');
    });

    it('should throw error for invalid email format', () => {
      expect(() => new Email('invalid-email')).toThrow(ValidationException);
      expect(() => new Email('invalid-email')).toThrow('Invalid email format');
    });

    it('should throw error for email without @', () => {
      expect(() => new Email('testexample.com')).toThrow(ValidationException);
    });

    it('should throw error for email without domain', () => {
      expect(() => new Email('test@')).toThrow(ValidationException);
    });

    it('should throw error for email without local part', () => {
      expect(() => new Email('@example.com')).toThrow(ValidationException);
    });
  });

  describe('equals', () => {
    it('should return true for equal emails', () => {
      const email1 = new Email('test@example.com');
      const email2 = new Email('test@example.com');
      expect(email1.equals(email2)).toBe(true);
    });

    it('should return true for equal emails with different cases', () => {
      const email1 = new Email('Test@Example.com');
      const email2 = new Email('test@example.com');
      expect(email1.equals(email2)).toBe(true);
    });

    it('should return false for different emails', () => {
      const email1 = new Email('test1@example.com');
      const email2 = new Email('test2@example.com');
      expect(email1.equals(email2)).toBe(false);
    });
  });

  describe('toString', () => {
    it('should return email as string', () => {
      const email = new Email('test@example.com');
      expect(email.toString()).toBe('test@example.com');
    });
  });
});
