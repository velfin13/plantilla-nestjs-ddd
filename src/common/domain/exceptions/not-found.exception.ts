import { DomainException } from './domain.exception';

export class NotFoundException extends DomainException {
  constructor(entity: string, id: string | number) {
    super(`${entity} with id ${id} not found`);
  }
}
