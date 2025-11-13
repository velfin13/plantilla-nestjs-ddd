import { ValidationException } from '../../../common/domain/exceptions';

export class Phone {
  private readonly value: string;

  constructor(phone: string) {
    this.validate(phone);
    this.value = phone.trim();
  }

  private validate(phone: string): void {
    if (!phone) {
      throw new ValidationException('Phone is required');
    }

    // Acepta formatos: +51999999999, 999999999, etc.
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    if (!phoneRegex.test(phone.replace(/[\s-]/g, ''))) {
      throw new ValidationException('Invalid phone format');
    }
  }

  getValue(): string {
    return this.value;
  }

  equals(other: Phone): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}
