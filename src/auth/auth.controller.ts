import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import {
  SignUpResponseDto,
  SignInResponseDto,
  RefreshTokenResponseDto,
  UserResponseDto,
} from './dto/auth-response.dto';
import { AuthGuard } from './auth.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({
    status: 201,
    description: 'User successfully created',
    type: SignUpResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Bad request - validation error' })
  async signUp(@Body() signUpDto: SignUpDto): Promise<SignUpResponseDto> {
    return this.authService.signUp(signUpDto);
  }

  @Post('signin')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Sign in user' })
  @ApiResponse({
    status: 200,
    description: 'User successfully signed in',
    type: SignInResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async signIn(@Body() signInDto: SignInDto): Promise<SignInResponseDto> {
    return this.authService.signIn(signInDto);
  }

  @Post('signout')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Sign out user' })
  @ApiResponse({
    status: 200,
    description: 'User successfully signed out',
    schema: {
      example: {
        message: 'Signed out successfully',
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async signOut(@Request() req) {
    return this.authService.signOut(req.user.accessToken);
  }

  @Get('me')
  @UseGuards(AuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get current authenticated user' })
  @ApiResponse({
    status: 200,
    description: 'Current user information',
    type: UserResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getMe(@Request() req): Promise<UserResponseDto> {
    return this.authService.getUser(req.user.accessToken);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh access token' })
  @ApiResponse({
    status: 200,
    description: 'Token successfully refreshed',
    type: RefreshTokenResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Invalid refresh token' })
  async refreshToken(
    @Body() refreshTokenDto: RefreshTokenDto,
  ): Promise<RefreshTokenResponseDto> {
    return this.authService.refreshToken(refreshTokenDto.refresh_token);
  }
}
