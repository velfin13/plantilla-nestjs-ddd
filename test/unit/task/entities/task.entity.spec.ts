import { Task } from '../../../../src/task/domain/entities/task.entity';
import { ValidationException } from '../../../../src/common/domain/exceptions';

describe('Task Entity', () => {
  const validId = '123e4567-e89b-12d3-a456-426614174001';
  const validTitle = 'Test Task';

  describe('constructor', () => {
    it('should create a valid task with required fields', () => {
      const task = new Task(validId, validTitle);

      expect(task.id).toBe(validId);
      expect(task.title).toBe(validTitle);
      expect(task.completed).toBe(false);
    });

    it('should create a task with completed status', () => {
      const task = new Task(validId, validTitle, true);

      expect(task.completed).toBe(true);
    });

    it('should trim title whitespace', () => {
      const task = new Task(validId, '  Test Task  ');

      expect(task.title).toBe('Test Task');
    });

    it('should set timestamps when provided', () => {
      const now = new Date();
      const task = new Task(validId, validTitle, false, now, now);

      expect(task.createdAt).toBe(now);
      expect(task.updatedAt).toBe(now);
    });

    it('should throw error for empty title', () => {
      expect(() => new Task(validId, '')).toThrow(ValidationException);
      expect(() => new Task(validId, '')).toThrow('Task title cannot be empty');
    });

    it('should throw error for whitespace-only title', () => {
      expect(() => new Task(validId, '   ')).toThrow(ValidationException);
      expect(() => new Task(validId, '   ')).toThrow('Task title cannot be empty');
    });

    it('should throw error for title too short', () => {
      expect(() => new Task(validId, 'AB')).toThrow(ValidationException);
      expect(() => new Task(validId, 'AB')).toThrow('Task title must be at least 3 characters long');
    });

    it('should throw error for title too long', () => {
      const longTitle = 'A'.repeat(201);
      expect(() => new Task(validId, longTitle)).toThrow(ValidationException);
      expect(() => new Task(validId, longTitle)).toThrow('Task title cannot exceed 200 characters');
    });

    it('should accept title at minimum length', () => {
      const task = new Task(validId, 'ABC');
      expect(task.title).toBe('ABC');
    });

    it('should accept title at maximum length', () => {
      const maxTitle = 'A'.repeat(200);
      const task = new Task(validId, maxTitle);
      expect(task.title).toBe(maxTitle);
    });
  });

  describe('toggle', () => {
    it('should toggle completed from false to true', () => {
      const task = new Task(validId, validTitle, false);
      
      task.toggle();
      
      expect(task.completed).toBe(true);
    });

    it('should toggle completed from true to false', () => {
      const task = new Task(validId, validTitle, true);
      
      task.toggle();
      
      expect(task.completed).toBe(false);
    });

    it('should toggle multiple times', () => {
      const task = new Task(validId, validTitle);
      
      task.toggle();
      expect(task.completed).toBe(true);
      
      task.toggle();
      expect(task.completed).toBe(false);
      
      task.toggle();
      expect(task.completed).toBe(true);
    });
  });

  describe('updateTitle', () => {
    it('should update title with valid value', () => {
      const task = new Task(validId, validTitle);
      const newTitle = 'Updated Task';
      
      task.updateTitle(newTitle);
      
      expect(task.title).toBe(newTitle);
    });

    it('should trim title when updating', () => {
      const task = new Task(validId, validTitle);
      
      task.updateTitle('  Updated Task  ');
      
      expect(task.title).toBe('Updated Task');
    });

    it('should throw error when updating to empty title', () => {
      const task = new Task(validId, validTitle);
      
      expect(() => task.updateTitle('')).toThrow(ValidationException);
      expect(() => task.updateTitle('')).toThrow('Task title cannot be empty');
    });

    it('should throw error when updating to too short title', () => {
      const task = new Task(validId, validTitle);
      
      expect(() => task.updateTitle('AB')).toThrow(ValidationException);
      expect(() => task.updateTitle('AB')).toThrow('Task title must be at least 3 characters long');
    });

    it('should throw error when updating to too long title', () => {
      const task = new Task(validId, validTitle);
      const longTitle = 'A'.repeat(201);
      
      expect(() => task.updateTitle(longTitle)).toThrow(ValidationException);
      expect(() => task.updateTitle(longTitle)).toThrow('Task title cannot exceed 200 characters');
    });

    it('should not modify title if validation fails', () => {
      const task = new Task(validId, validTitle);
      
      try {
        task.updateTitle('');
      } catch (error) {
        // Expected error
      }
      
      expect(task.title).toBe(validTitle);
    });
  });

  describe('Properties', () => {
    it('should allow direct modification of completed', () => {
      const task = new Task(validId, validTitle);

      task.completed = true;
      expect(task.completed).toBe(true);
    });
  });
});
