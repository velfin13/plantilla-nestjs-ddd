import { Body, Controller, Post, UseInterceptors } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SkipThrottle, Throttle } from '@nestjs/throttler';
import { CreateUserUseCase } from 'src/user/application/use-cases/create-user.usecase';
import { LoginUseCase } from '../../application/use-cases/login.usecase';
import { LoginDto } from '../../dto/login.dto';
import { RegisterDto } from '../../dto/register.dto';
import { UserMapper } from 'src/user/application/mappers/user.mapper';
import { UserResponse } from 'src/user/infrastructure/dto/user-response.dto';
import { TransformInterceptor } from 'src/common/infrastructure/interceptors/transform.interceptor';

@ApiTags('Auth')
@Controller('auth')
@UseInterceptors(TransformInterceptor)
export class AuthController {
  constructor(
    private readonly registerUser: CreateUserUseCase,
    private readonly loginUser: LoginUseCase,
  ) { }

  @Post('register')
  @Throttle({ default: { limit: 3, ttl: 60000 } })
  @ApiOperation({ summary: 'Register a new user' })
  @ApiBody({ type: RegisterDto })
  @ApiResponse({ status: 201, description: 'User successfully registered', type: UserResponse })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 429, description: 'Too many requests' })
  async register(@Body() dto: RegisterDto) {
    const user = await this.registerUser.execute(dto);
    return new UserResponse(UserMapper.toResponse(user));
  }

  @Post('login')
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @ApiOperation({ summary: 'Authenticate user and return JWT token' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({ status: 200, description: 'User authenticated successfully' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  @ApiResponse({ status: 429, description: 'Too many requests' })
  async login(@Body() dto: LoginDto) {
    return this.loginUser.execute(dto.email, dto.password);
  }
}
