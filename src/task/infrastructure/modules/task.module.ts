import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreateTaskUseCase, GetTasksUseCase } from 'src/task/application/use-cases';
import { TaskController } from '../controllers/task.controller';
import { PostgresTaskRepository } from '../persistence/postgres-task.repository';
import { TaskEntity } from '../persistence/task.entity';
import { ToggleTaskUseCase } from 'src/task/application/use-cases/toggle-task.usecase';
import { GetTaskByIdUseCase } from 'src/task/application/use-cases/get-task-by-id.usecase';
import { UpdateTaskUseCase } from 'src/task/application/use-cases/update-task.usecase';
import { DeleteTaskUseCase } from 'src/task/application/use-cases/delete-task.usecase';

@Module({
  imports: [TypeOrmModule.forFeature([TaskEntity])],
  controllers: [TaskController],
  providers: [
    {
      provide: 'TaskRepository',
      useClass: PostgresTaskRepository,
    },
    {
      provide: CreateTaskUseCase,
      useFactory: (repo: PostgresTaskRepository) => new CreateTaskUseCase(repo),
      inject: ['TaskRepository'],
    },
    {
      provide: GetTasksUseCase,
      useFactory: (repo: PostgresTaskRepository) => new GetTasksUseCase(repo),
      inject: ['TaskRepository'],
    },
    {
      provide: ToggleTaskUseCase,
      useFactory: (repo: PostgresTaskRepository) => new ToggleTaskUseCase(repo),
      inject: ['TaskRepository'],
    },
    {
      provide: GetTaskByIdUseCase,
      useFactory: (repo: PostgresTaskRepository) => new GetTaskByIdUseCase(repo),
      inject: ['TaskRepository'],
    },
    {
      provide: UpdateTaskUseCase,
      useFactory: (repo: PostgresTaskRepository) => new UpdateTaskUseCase(repo),
      inject: ['TaskRepository'],
    },
    {
      provide: DeleteTaskUseCase,
      useFactory: (repo: PostgresTaskRepository) => new DeleteTaskUseCase(repo),
      inject: ['TaskRepository'],
    },
  ],
})
export class TaskModule { }
