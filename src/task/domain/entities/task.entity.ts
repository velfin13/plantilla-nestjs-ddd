import { ValidationException } from '../../../common/domain/exceptions';

export class Task {
    readonly id: string;
    title: string;
    completed: boolean;
    readonly createdAt?: Date;
    readonly updatedAt?: Date;

    constructor(id: string, title: string, completed: boolean = false, createdAt?: Date, updatedAt?: Date) {
        this.validateBusinessRules(title);
        this.id = id;
        this.title = title.trim();
        this.completed = completed;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    private validateBusinessRules(title: string): void {
        if (!title || title.trim().length === 0) {
            throw new ValidationException('Task title cannot be empty');
        }

        if (title.trim().length < 3) {
            throw new ValidationException('Task title must be at least 3 characters long');
        }

        if (title.length > 200) {
            throw new ValidationException('Task title cannot exceed 200 characters');
        }
    }

    toggle() {
        this.completed = !this.completed;
    }

    updateTitle(newTitle: string): void {
        this.validateBusinessRules(newTitle);
        this.title = newTitle.trim();
    }
}