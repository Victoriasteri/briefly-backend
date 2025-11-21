import { IsEmail, IsString } from 'class-validator';

export class SignInDto {
  /**
   * User email address
   * @example user@example.com
   */
  @IsEmail()
  email: string;

  /**
   * User password
   * @example password123
   */
  @IsString()
  password: string;
}
