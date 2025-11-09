import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreateUserUseCase } from 'src/user/application/use-cases/create-user.usecase';
import { GetUsersUseCase } from 'src/user/application/use-cases/get-users.usecase';
import { UserController } from '../controllers/user.controller';
import { PostgresUserRepository } from '../persistence/postgres-user.repository';
import { UserEntity } from '../persistence/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  controllers: [UserController],
  providers: [
    {
      provide: 'UserRepository',
      useClass: PostgresUserRepository,
    },
    {
      provide: CreateUserUseCase,
      useFactory: (repo: PostgresUserRepository) => new CreateUserUseCase(repo),
      inject: ['UserRepository'],
    },
    {
      provide: GetUsersUseCase,
      useFactory: (repo: PostgresUserRepository) => new GetUsersUseCase(repo),
      inject: ['UserRepository'],
    },
  ],
  exports: ['UserRepository', CreateUserUseCase],
})
export class UserModule { }
