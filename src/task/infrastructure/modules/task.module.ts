import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreateTaskUseCase, GetTasksUseCase } from 'src/task/application/use-cases';
import { TaskController } from '../controllers/task.controller';
import { PostgresTaskRepository } from '../persistence/postgres-task.repository';
import { TaskEntity } from '../persistence/task.entity';
import { ToggleTaskUseCase } from 'src/task/application/use-cases/toggle-task.usecase';

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
  ],
})
export class TaskModule { }
