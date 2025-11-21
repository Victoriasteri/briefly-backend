import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty({ example: 'uuid' })
  id: string;

  @ApiProperty({ example: 'user@example.com' })
  email: string;

  @ApiProperty({ example: {}, required: false })
  user_metadata?: Record<string, any>;

  @ApiProperty({ example: '2025-01-21T12:00:00.000Z' })
  created_at: string;

  @ApiProperty({ example: '2025-01-21T12:00:00.000Z', required: false })
  updated_at?: string;
}

export class SignUpResponseDto {
  @ApiProperty({ type: UserResponseDto })
  user: UserResponseDto;

  @ApiProperty({ example: 'User created successfully' })
  message: string;
}

export class SignInResponseDto {
  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' })
  access_token: string;

  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' })
  refresh_token: string;

  @ApiProperty({ type: UserResponseDto })
  user: UserResponseDto;
}

export class RefreshTokenResponseDto {
  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' })
  access_token: string;

  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' })
  refresh_token: string;

  @ApiProperty({ type: UserResponseDto })
  user: UserResponseDto;
}
