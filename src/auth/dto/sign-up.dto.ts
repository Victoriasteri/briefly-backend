import {
  IsEmail,
  IsString,
  MinLength,
  IsOptional,
  IsObject,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class SignUpDto {
  @ApiProperty({
    description: 'User email address',
    example: 'user@example.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'User password (minimum 6 characters)',
    example: 'password123',
    minLength: 6,
  })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiPropertyOptional({
    description: 'Additional user metadata',
    example: { firstName: 'John', lastName: 'Doe' },
  })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}
