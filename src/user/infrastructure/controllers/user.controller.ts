import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { CreateUserUseCase } from 'src/user/application/use-cases/create-user.usecase';
import { CreateUserDto } from '../dto/create-user.dto';
import { GetUsersUseCase } from 'src/user/application/use-cases/get-users.usecase';
import { UserMapper } from 'src/user/application/mappers/user.mapper';
import { UserResponse } from '../dto/user-response.dto';
import { TransformInterceptor } from 'src/common/infrastructure/interceptors/transform.interceptor';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { PaginatedResponseDto } from 'src/common/dto/paginated-response.dto';
import { JwtAuthGuard } from 'src/auth/infrastructure/guards/jwt-auth.guard';
import { GetUserByIdUseCase } from 'src/user/application/use-cases/get-user-by-id.usecase';
import { UpdateUserUseCase } from 'src/user/application/use-cases/update-user.usecase';
import { DeleteUserUseCase } from 'src/user/application/use-cases/delete-user.usecase';
import { UpdateUserDto } from '../dto/update-user.dto';


@ApiTags('Users')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('Users')
@UseInterceptors(TransformInterceptor)
export class UserController {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly getUsersUseCase: GetUsersUseCase,
    private readonly getUserByIdUseCase: GetUserByIdUseCase,
    private readonly updateUserUseCase: UpdateUserUseCase,
    private readonly deleteUserUseCase: DeleteUserUseCase,
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

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un usuario por ID' })
  @ApiParam({ name: 'id', description: 'ID del usuario', example: 'uuid-here' })
  @ApiResponse({ status: 200, description: 'Usuario encontrado', type: UserResponse })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  async findOne(@Param('id') id: string) {
    const user = await this.getUserByIdUseCase.execute(id);
    return new UserResponse(UserMapper.toResponse(user));
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un usuario' })
  @ApiParam({ name: 'id', description: 'ID del usuario', example: 'uuid-here' })
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({ status: 200, description: 'Usuario actualizado correctamente', type: UserResponse })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    const user = await this.updateUserUseCase.execute(id, dto);
    return new UserResponse(UserMapper.toResponse(user));
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un usuario' })
  @ApiParam({ name: 'id', description: 'ID del usuario', example: 'uuid-here' })
  @ApiResponse({ status: 200, description: 'Usuario eliminado correctamente' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  async remove(@Param('id') id: string) {
    await this.deleteUserUseCase.execute(id);
    return { message: 'Usuario eliminado correctamente' };
  }
}
