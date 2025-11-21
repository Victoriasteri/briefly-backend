import { IsOptional, IsString, IsObject } from 'class-validator';

export class UpdateUserDto {
  /**
   * User first name
   * @example John
   */
  @IsOptional()
  @IsString()
  firstName?: string;

  /**
   * User last name
   * @example Doe
   */
  @IsOptional()
  @IsString()
  lastName?: string;

  /**
   * Additional user metadata
   * @example { bio: 'Software developer' }
   */
  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}
