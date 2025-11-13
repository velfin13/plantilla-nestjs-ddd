import { ValidationException } from '../../../common/domain/exceptions';
import * as bcrypt from 'bcrypt';

export class Password {
  private readonly value: string;

  private constructor(value: string) {
    this.value = value;
  }

  static create(plainPassword: string): Password {
    this.validate(plainPassword);
    return new Password(plainPassword);
  }

  static fromHash(hashedPassword: string): Password {
    return new Password(hashedPassword);
  }

  private static validate(password: string): void {
    if (!password) {
      throw new ValidationException('Password is required');
    }

    if (password.length < 8) {
      throw new ValidationException('Password must be at least 8 characters long');
    }

    if (!/(?=.*[a-z])/.test(password)) {
      throw new ValidationException('Password must contain at least one lowercase letter');
    }

    if (!/(?=.*[A-Z])/.test(password)) {
      throw new ValidationException('Password must contain at least one uppercase letter');
    }

    if (!/(?=.*\d)/.test(password)) {
      throw new ValidationException('Password must contain at least one number');
    }
  }

  async hash(): Promise<string> {
    return bcrypt.hash(this.value, 10);
  }

  async compare(plainPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, this.value);
  }

  getValue(): string {
    return this.value;
  }
}
