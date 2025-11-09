export class User {
  readonly id: string;
  name: string;
  lastname: string;
  phone: string;
  email: string;
  password: string;
  active: boolean;

  private constructor(builder: any) {
    this.id = builder.id;
    this.name = builder.name;
    this.lastname = builder.lastname;
    this.phone = builder.phone;
    this.email = builder.email;
    this.password = builder.password;
    this.active = builder.active ?? true;
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
