import { Exclude } from 'class-transformer';

export class UserResponse {
  id: string;
  name: string;
  lastname: string;
  phone: string;
  email: string;
  active: boolean;

  @Exclude()
  password: string;

  constructor(partial: Partial<UserResponse>) {
    Object.assign(this, partial);
  }
}
