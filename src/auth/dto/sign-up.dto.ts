import {
  IsEmail,
  IsString,
  MinLength,
  IsOptional,
  IsObject,
} from 'class-validator';

export class SignUpDto {
  /**
   * User email address
   * @example user@example.com
   */
  @IsEmail()
  email: string;

  /**
   * User password (minimum 6 characters)
   * @example password123
   */
  @IsString()
  @MinLength(6)
  password: string;

  /**
   * Additional user metadata
   * @example { firstName: 'John', lastName: 'Doe' }
   */
  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}
