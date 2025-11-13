import { Body, Controller, Get, Post, Query, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateUserUseCase } from 'src/user/application/use-cases/create-user.usecase';
import { CreateUserDto } from '../dto/create-user.dto';
import { GetUsersUseCase } from 'src/user/application/use-cases/get-users.usecase';
import { UserMapper } from 'src/user/application/mappers/user.mapper';
import { UserResponse } from '../dto/user-response.dto';
import { TransformInterceptor } from 'src/common/infrastructure/interceptors/transform.interceptor';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { PaginatedResponseDto } from 'src/common/dto/paginated-response.dto';


@ApiTags('Users')
@Controller('Users')
@UseInterceptors(TransformInterceptor)
export class UserController {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly getUsersUseCase: GetUsersUseCase,
  ) { }

  @Get()
  @ApiOperation({ summary: 'Obtener todas los usuarios' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Lista de usuarios', type: [UserResponse] })
  async findAll(@Query() paginationDto: PaginationDto) {
    if (paginationDto.page && paginationDto.limit) {
      const { data, total } = await this.getUsersUseCase.executePaginated(
        paginationDto.page,
        paginationDto.limit,
      );
      const mappedUsers = data.map(user => new UserResponse(UserMapper.toResponse(user)));
      return new PaginatedResponseDto(mappedUsers, total, paginationDto.page, paginationDto.limit);
    }
    const users = await this.getUsersUseCase.execute();
    return users.map(user => new UserResponse(UserMapper.toResponse(user)));
  }

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo usuario' })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({ status: 201, description: 'Usuario creado correctamente', type: UserResponse })
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async create(@Body() dto: CreateUserDto) {
    const user = await this.createUserUseCase.execute(dto);
    return new UserResponse(UserMapper.toResponse(user));
  }


}
