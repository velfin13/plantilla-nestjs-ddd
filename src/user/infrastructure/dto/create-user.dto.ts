import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, Length, Matches } from 'class-validator';

export class CreateUserDto {

  @ApiProperty({ description: 'Nombre del usuario', example: 'Juan' })
  @IsString()
  @IsNotEmpty()
  @Length(2, 50)
  name: string;

  @ApiProperty({ description: 'Apellido del usuario', example: 'Pérez' })
  @IsString()
  @IsNotEmpty()
  @Length(2, 50)
  lastname: string;

  @ApiProperty({ description: 'Teléfono del usuario', example: '+34123456789' })
  @IsString()
  @IsNotEmpty()
  @Matches(/^\+?\d{7,15}$/, { message: 'El teléfono debe ser válido' })
  phone: string;

  @ApiProperty({ description: 'Correo electrónico del usuario', example: 'juan.perez@mail.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ description: 'Contraseña', example: 'Clave1.@' })
  @IsString()
  @IsNotEmpty()
  password: string;

}
