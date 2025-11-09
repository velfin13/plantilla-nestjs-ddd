import { Body, Controller, Get, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateUserUseCase } from 'src/user/application/use-cases/create-user.usecase';
import { User } from 'src/user/domain/entities/user.entity';
import { CreateUserDto } from '../dto/create-user.dto';
import { GetUsersUseCase } from 'src/user/application/use-cases/get-users.usecase';


@ApiTags('Users')
@Controller('Users')
export class UserController {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly getUsersUseCase: GetUsersUseCase,
  ) { }

  @Get()
  @ApiOperation({ summary: 'Obtener todas los usuarios' })
  @ApiResponse({ status: 200, description: 'Lista de usuarios', type: [User] })
  async findAll() {
    return this.getUsersUseCase.execute();
  }

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo usuario' })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({ status: 201, description: 'Usuerio creado correctamente', type: User })
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async create(@Body() dto: CreateUserDto) {
    return this.createUserUseCase.execute(dto);
  }


}
