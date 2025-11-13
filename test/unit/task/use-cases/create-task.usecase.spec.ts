import { CreateTaskUseCase } from '../../../../src/task/application/use-cases/create-task.usecase';
import { Task } from '../../../../src/task/domain/entities/task.entity';
import { createMockRepository } from '../../../helpers/test-helpers';

describe('CreateTaskUseCase', () => {
  let useCase: CreateTaskUseCase;
  let mockTaskRepo: ReturnType<typeof createMockRepository>;

  beforeEach(() => {
    mockTaskRepo = createMockRepository();
    useCase = new CreateTaskUseCase(mockTaskRepo as any);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const validDto = {
    title: 'Test Task',
  };

  describe('execute', () => {
    it('should create a new task successfully', async () => {
      mockTaskRepo.save.mockResolvedValue(undefined);

      const task = await useCase.execute(validDto);

      expect(task).toBeInstanceOf(Task);
      expect(task.title).toBe(validDto.title);
      expect(task.completed).toBe(false);
      expect(mockTaskRepo.save).toHaveBeenCalledWith(expect.any(Task));
    });

    it('should generate a UUID for new task', async () => {
      mockTaskRepo.save.mockResolvedValue(undefined);

      const task = await useCase.execute(validDto);

      expect(task.id).toBeDefined();
      expect(task.id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/);
    });

    it('should create task with completed as false by default', async () => {
      mockTaskRepo.save.mockResolvedValue(undefined);

      const task = await useCase.execute(validDto);

      expect(task.completed).toBe(false);
    });

    it('should pass the task entity to repository', async () => {
      mockTaskRepo.save.mockResolvedValue(undefined);

      const task = await useCase.execute(validDto);

      expect(mockTaskRepo.save).toHaveBeenCalledWith(task);
      expect(mockTaskRepo.save).toHaveBeenCalledTimes(1);
    });
  });
});
