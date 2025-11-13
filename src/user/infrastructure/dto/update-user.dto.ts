import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString, Length, Matches } from 'class-validator';

export class UpdateUserDto {
  @ApiPropertyOptional({ description: 'Nombre del usuario', example: 'Juan' })
  @IsString()
  @IsOptional()
  @Length(2, 50)
  name?: string;

  @ApiPropertyOptional({ description: 'Apellido del usuario', example: 'Pérez' })
  @IsString()
  @IsOptional()
  @Length(2, 50)
  lastname?: string;

  @ApiPropertyOptional({ description: 'Teléfono del usuario', example: '+34123456789' })
  @IsString()
  @IsOptional()
  @Matches(/^\+?\d{7,15}$/, { message: 'El teléfono debe ser válido' })
  phone?: string;

  @ApiPropertyOptional({ description: 'Estado activo del usuario', example: true })
  @IsBoolean()
  @IsOptional()
  active?: boolean;
}
