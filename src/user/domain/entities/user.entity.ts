import { Email } from '../value-objects/email.vo';
import { Phone } from '../value-objects/phone.vo';
import { ValidationException } from '../../../common/domain/exceptions';

export class User {
  readonly id: string;
  name: string;
  lastname: string;
  phone: string;
  email: string;
  password: string;
  active: boolean;
  readonly createdAt?: Date;
  readonly updatedAt?: Date;

  private constructor(builder: any) {
    this.validateBusinessRules(builder);
    this.id = builder.id;
    this.name = builder.name;
    this.lastname = builder.lastname;
    this.phone = builder.phone;
    this.email = builder.email;
    this.password = builder.password;
    this.active = builder.active ?? true;
    this.createdAt = builder.createdAt;
    this.updatedAt = builder.updatedAt;
  }

  private validateBusinessRules(builder: any): void {
    try {
      new Email(builder.email);
    } catch (error) {
      throw error;
    }

    try {
      new Phone(builder.phone);
    } catch (error) {
      throw error;
    }

    if (!builder.name || builder.name.trim().length < 2) {
      throw new ValidationException('Name must be at least 2 characters long');
    }

    if (!builder.lastname || builder.lastname.trim().length < 2) {
      throw new ValidationException('Lastname must be at least 2 characters long');
    }
  }

  static Builder = class {
    id: string;
    name: string;
    lastname: string;
    phone: string;
    email: string;
    password: string;
    active?: boolean;
    createdAt?: Date;
    updatedAt?: Date;

    setId(id: string) { this.id = id; return this; }
    setName(name: string) { this.name = name; return this; }
    setLastname(lastname: string) { this.lastname = lastname; return this; }
    setPhone(phone: string) { this.phone = phone; return this; }
    setEmail(email: string) { this.email = email; return this; }
    setPassword(password: string) { this.password = password; return this; }
    setActive(active: boolean) { this.active = active; return this; }
    setCreatedAt(createdAt: Date) { this.createdAt = createdAt; return this; }
    setUpdatedAt(updatedAt: Date) { this.updatedAt = updatedAt; return this; }

    build(): User {
      if (!this.id || !this.name || !this.lastname || !this.phone || !this.email) {
        throw new Error('Faltan campos obligatorios');
      }
      if (!this.password) {
        this.password = '';
      }
      return new User(this);
    }
  }
}
