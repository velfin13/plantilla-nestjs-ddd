import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, Length } from 'class-validator';

export class UpdateTaskDto {
  @ApiPropertyOptional({ description: 'Título de la tarea', example: 'Aprender Clean Architecture' })
  @IsString()
  @IsOptional()
  @Length(3, 200)
  title?: string;
}
