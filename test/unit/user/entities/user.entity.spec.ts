import { User } from '../../../../src/user/domain/entities/user.entity';
import { ValidationException } from '../../../../src/common/domain/exceptions';

describe('User Entity', () => {
  const validUserData = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    name: 'John',
    lastname: 'Doe',
    email: 'john.doe@example.com',
    phone: '+1234567890',
    password: 'hashedPassword',
  };

  describe('Builder', () => {
    it('should create a valid user with all required fields', () => {
      const user = new User.Builder()
        .setId(validUserData.id)
        .setName(validUserData.name)
        .setLastname(validUserData.lastname)
        .setEmail(validUserData.email)
        .setPhone(validUserData.phone)
        .setPassword(validUserData.password)
        .build();

      expect(user.id).toBe(validUserData.id);
      expect(user.name).toBe(validUserData.name);
      expect(user.lastname).toBe(validUserData.lastname);
      expect(user.email).toBe(validUserData.email);
      expect(user.phone).toBe(validUserData.phone);
      expect(user.active).toBe(true);
    });

    it('should set active to false when specified', () => {
      const user = new User.Builder()
        .setId(validUserData.id)
        .setName(validUserData.name)
        .setLastname(validUserData.lastname)
        .setEmail(validUserData.email)
        .setPhone(validUserData.phone)
        .setPassword(validUserData.password)
        .setActive(false)
        .build();

      expect(user.active).toBe(false);
    });

    it('should set timestamps when provided', () => {
      const now = new Date();
      const user = new User.Builder()
        .setId(validUserData.id)
        .setName(validUserData.name)
        .setLastname(validUserData.lastname)
        .setEmail(validUserData.email)
        .setPhone(validUserData.phone)
        .setPassword(validUserData.password)
        .setCreatedAt(now)
        .setUpdatedAt(now)
        .build();

      expect(user.createdAt).toBe(now);
      expect(user.updatedAt).toBe(now);
    });

    it('should throw error for missing id', () => {
      expect(() => {
        new User.Builder()
          .setName(validUserData.name)
          .setLastname(validUserData.lastname)
          .setEmail(validUserData.email)
          .setPhone(validUserData.phone)
          .setPassword(validUserData.password)
          .build();
      }).toThrow('Faltan campos obligatorios');
    });

    it('should throw error for missing name', () => {
      expect(() => {
        new User.Builder()
          .setId(validUserData.id)
          .setLastname(validUserData.lastname)
          .setEmail(validUserData.email)
          .setPhone(validUserData.phone)
          .setPassword(validUserData.password)
          .build();
      }).toThrow('Faltan campos obligatorios');
    });

    it('should throw error for missing email', () => {
      expect(() => {
        new User.Builder()
          .setId(validUserData.id)
          .setName(validUserData.name)
          .setLastname(validUserData.lastname)
          .setPhone(validUserData.phone)
          .setPassword(validUserData.password)
          .build();
      }).toThrow('Faltan campos obligatorios');
    });
  });

  describe('Business Rules Validation', () => {
    it('should throw error for invalid email', () => {
      expect(() => {
        new User.Builder()
          .setId(validUserData.id)
          .setName(validUserData.name)
          .setLastname(validUserData.lastname)
          .setEmail('invalid-email')
          .setPhone(validUserData.phone)
          .setPassword(validUserData.password)
          .build();
      }).toThrow(ValidationException);
    });

    it('should throw error for invalid phone', () => {
      expect(() => {
        new User.Builder()
          .setId(validUserData.id)
          .setName(validUserData.name)
          .setLastname(validUserData.lastname)
          .setEmail(validUserData.email)
          .setPhone('invalid')
          .setPassword(validUserData.password)
          .build();
      }).toThrow(ValidationException);
    });

    it('should throw error for name too short', () => {
      expect(() => {
        new User.Builder()
          .setId(validUserData.id)
          .setName('J')
          .setLastname(validUserData.lastname)
          .setEmail(validUserData.email)
          .setPhone(validUserData.phone)
          .setPassword(validUserData.password)
          .build();
      }).toThrow(ValidationException);
      expect(() => {
        new User.Builder()
          .setId(validUserData.id)
          .setName('J')
          .setLastname(validUserData.lastname)
          .setEmail(validUserData.email)
          .setPhone(validUserData.phone)
          .setPassword(validUserData.password)
          .build();
      }).toThrow('Name must be at least 2 characters long');
    });

    it('should throw error for lastname too short', () => {
      expect(() => {
        new User.Builder()
          .setId(validUserData.id)
          .setName(validUserData.name)
          .setLastname('D')
          .setEmail(validUserData.email)
          .setPhone(validUserData.phone)
          .setPassword(validUserData.password)
          .build();
      }).toThrow(ValidationException);
      expect(() => {
        new User.Builder()
          .setId(validUserData.id)
          .setName(validUserData.name)
          .setLastname('D')
          .setEmail(validUserData.email)
          .setPhone(validUserData.phone)
          .setPassword(validUserData.password)
          .build();
      }).toThrow('Lastname must be at least 2 characters long');
    });

    it('should trim and validate name', () => {
      expect(() => {
        new User.Builder()
          .setId(validUserData.id)
          .setName('  ')
          .setLastname(validUserData.lastname)
          .setEmail(validUserData.email)
          .setPhone(validUserData.phone)
          .setPassword(validUserData.password)
          .build();
      }).toThrow(ValidationException);
    });
  });

  describe('Properties', () => {
    it('should allow modifying name', () => {
      const user = new User.Builder()
        .setId(validUserData.id)
        .setName(validUserData.name)
        .setLastname(validUserData.lastname)
        .setEmail(validUserData.email)
        .setPhone(validUserData.phone)
        .setPassword(validUserData.password)
        .build();

      user.name = 'Jane';
      expect(user.name).toBe('Jane');
    });

    it('should allow modifying active status', () => {
      const user = new User.Builder()
        .setId(validUserData.id)
        .setName(validUserData.name)
        .setLastname(validUserData.lastname)
        .setEmail(validUserData.email)
        .setPhone(validUserData.phone)
        .setPassword(validUserData.password)
        .build();

      user.active = false;
      expect(user.active).toBe(false);
    });
  });
});
