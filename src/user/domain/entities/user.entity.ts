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

  private constructor(builder: any) {
    this.validateBusinessRules(builder);
    this.id = builder.id;
    this.name = builder.name;
    this.lastname = builder.lastname;
    this.phone = builder.phone;
    this.email = builder.email;
    this.password = builder.password;
    this.active = builder.active ?? true;
  }

  private validateBusinessRules(builder: any): void {
    // Validar email usando Value Object
    try {
      new Email(builder.email);
    } catch (error) {
      throw error;
    }

    // Validar phone usando Value Object
    try {
      new Phone(builder.phone);
    } catch (error) {
      throw error;
    }

    // Validaciones adicionales de negocio
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

    setId(id: string) { this.id = id; return this; }
    setName(name: string) { this.name = name; return this; }
    setLastname(lastname: string) { this.lastname = lastname; return this; }
    setPhone(phone: string) { this.phone = phone; return this; }
    setEmail(email: string) { this.email = email; return this; }
    setPassword(password: string) { this.password = password; return this; }
    setActive(active: boolean) { this.active = active; return this; }

    build(): User {
      if (!this.id || !this.name || !this.lastname || !this.phone || !this.email || !this.password) {
        throw new Error('Faltan campos obligatorios');
      }
      return new User(this);
    }
  }
}
