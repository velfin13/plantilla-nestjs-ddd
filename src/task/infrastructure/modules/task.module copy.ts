// para in memory

import { Module } from '@nestjs/common';
import { CreateTaskUseCase } from '../../application/use-cases/create-task.usecase';
import { GetTasksUseCase } from '../../application/use-cases/get-tasks.usecase';
import { TaskController } from '../controllers/task.controller';
import { InMemoryTaskRepository } from '../persistence/in-memory-task.repository';

@Module({
  controllers: [TaskController],
  providers: [
    {
      provide: 'TaskRepository',
      useClass: InMemoryTaskRepository,
    },
    {
      provide: CreateTaskUseCase,
      useFactory: (repo: InMemoryTaskRepository) => new CreateTaskUseCase(repo),
      inject: ['TaskRepository'],
    },
    {
      provide: GetTasksUseCase,
      useFactory: (repo: InMemoryTaskRepository) => new GetTasksUseCase(repo),
      inject: ['TaskRepository'],
    },
  ],
})
export class TaskModule { }
