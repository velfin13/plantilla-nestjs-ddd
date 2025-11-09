import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ToggleTaskDto {
    @ApiProperty({ description: 'ID de la tarea a cambiar estado', example: 'uuid-task' })
    @IsString()
    @IsNotEmpty()
    taskId: string;
}
