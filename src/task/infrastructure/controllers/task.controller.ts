import { Body, Controller, Get, Patch, Post, Query, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiQuery, ApiResponse, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { ToggleTaskUseCase } from 'src/task/application/use-cases/toggle-task.usecase';
import { CreateTaskUseCase } from '../../application/use-cases/create-task.usecase';
import { GetTasksUseCase } from '../../application/use-cases/get-tasks.usecase';
import { Task } from '../../domain/entities/task.entity';
import { CreateTaskDto } from '../dto/create-task.dto';
import { ToggleTaskDto } from '../dto/toggle-task.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { PaginatedResponseDto } from 'src/common/dto/paginated-response.dto';
import { JwtAuthGuard } from 'src/auth/infrastructure/guards/jwt-auth.guard';

@ApiTags('Tasks')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('tasks')
export class TaskController {
  constructor(
    private readonly createTaskUseCase: CreateTaskUseCase,
    private readonly getTasksUseCase: GetTasksUseCase,
    private readonly toggleTaskUseCase: ToggleTaskUseCase,
  ) { }

  @Post()
  @ApiOperation({ summary: 'Crear una nueva tarea' })
  @ApiBody({ type: CreateTaskDto })
  @ApiResponse({ status: 201, description: 'Tarea creada correctamente', type: Task })
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async create(@Body() createTaskDto: CreateTaskDto) {
    return this.createTaskUseCase.execute(createTaskDto);
  }

  @Patch('toggle')
  async toggle(@Body() dto: ToggleTaskDto) {
    return this.toggleTaskUseCase.execute(dto.taskId);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todas las tareas' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Lista de tareas', type: [Task] })
  async findAll(@Query() paginationDto: PaginationDto) {
    if (paginationDto.page && paginationDto.limit) {
      const { data, total } = await this.getTasksUseCase.executePaginated(
        paginationDto.page,
        paginationDto.limit,
      );
      return new PaginatedResponseDto(data, total, paginationDto.page, paginationDto.limit);
    }
    return this.getTasksUseCase.execute();
  }
}
