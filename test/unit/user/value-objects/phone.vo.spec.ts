import { Phone } from '../../../../src/user/domain/value-objects/phone.vo';
import { ValidationException } from '../../../../src/common/domain/exceptions';

describe('Phone Value Object', () => {
  describe('constructor', () => {
    it('should create a valid phone with country code', () => {
      const phone = new Phone('+1234567890');
      expect(phone.getValue()).toBe('+1234567890');
    });

    it('should create a valid phone without country code', () => {
      const phone = new Phone('1234567890');
      expect(phone.getValue()).toBe('1234567890');
    });

    it('should trim whitespace', () => {
      const phone = new Phone('  +1234567890  ');
      expect(phone.getValue()).toBe('+1234567890');
    });

    it('should accept international format', () => {
      const phone = new Phone('+51987654321');
      expect(phone.getValue()).toBe('+51987654321');
    });

    it('should throw error for empty phone', () => {
      expect(() => new Phone('')).toThrow(ValidationException);
      expect(() => new Phone('')).toThrow('Phone is required');
    });

    it('should throw error for invalid phone format', () => {
      expect(() => new Phone('invalid')).toThrow(ValidationException);
      expect(() => new Phone('invalid')).toThrow('Invalid phone format');
    });

    it('should throw error for phone starting with 0', () => {
      expect(() => new Phone('0123456789')).toThrow(ValidationException);
    });

    it('should throw error for phone with only +', () => {
      expect(() => new Phone('+')).toThrow(ValidationException);
    });
  });

  describe('equals', () => {
    it('should return true for equal phones', () => {
      const phone1 = new Phone('+1234567890');
      const phone2 = new Phone('+1234567890');
      expect(phone1.equals(phone2)).toBe(true);
    });

    it('should return false for different phones', () => {
      const phone1 = new Phone('+1234567890');
      const phone2 = new Phone('+9876543210');
      expect(phone1.equals(phone2)).toBe(false);
    });
  });

  describe('toString', () => {
    it('should return phone as string', () => {
      const phone = new Phone('+1234567890');
      expect(phone.toString()).toBe('+1234567890');
    });
  });
});
