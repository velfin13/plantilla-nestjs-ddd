import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreateUserUseCase } from 'src/user/application/use-cases/create-user.usecase';
import { GetUsersUseCase } from 'src/user/application/use-cases/get-users.usecase';
import { GetUserByIdUseCase } from 'src/user/application/use-cases/get-user-by-id.usecase';
import { UpdateUserUseCase } from 'src/user/application/use-cases/update-user.usecase';
import { DeleteUserUseCase } from 'src/user/application/use-cases/delete-user.usecase';
import { UserController } from '../controllers/user.controller';
import { PostgresUserRepository } from '../persistence/postgres-user.repository';
import { UserEntity } from '../persistence/user.entity';
import { LoggerModule } from 'src/common/infrastructure/logger/logger.module';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity]), LoggerModule],
  controllers: [UserController],
  providers: [
    {
      provide: 'UserRepository',
      useClass: PostgresUserRepository,
    },
    {
      provide: CreateUserUseCase,
      useFactory: (repo: PostgresUserRepository, logger) => new CreateUserUseCase(repo, logger),
      inject: ['UserRepository', 'LoggerService'],
    },
    {
      provide: GetUsersUseCase,
      useFactory: (repo: PostgresUserRepository) => new GetUsersUseCase(repo),
      inject: ['UserRepository'],
    },
    {
      provide: GetUserByIdUseCase,
      useFactory: (repo: PostgresUserRepository) => new GetUserByIdUseCase(repo),
      inject: ['UserRepository'],
    },
    {
      provide: UpdateUserUseCase,
      useFactory: (repo: PostgresUserRepository) => new UpdateUserUseCase(repo),
      inject: ['UserRepository'],
    },
    {
      provide: DeleteUserUseCase,
      useFactory: (repo: PostgresUserRepository, logger) => new DeleteUserUseCase(repo, logger),
      inject: ['UserRepository', 'LoggerService'],
    },
  ],
  exports: ['UserRepository', CreateUserUseCase],
})
export class UserModule { }
