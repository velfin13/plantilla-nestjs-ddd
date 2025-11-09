import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTaskDto {
  @ApiProperty({ description: 'Título de la tarea', example: 'Aprender Clean Architecture' })
  @IsString()
  @IsNotEmpty()
  title: string;
}
