import { IsString } from 'class-validator';

export class RefreshTokenDto {
  /**
   * Refresh token to get new access token
   * @example eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   */
  @IsString()
  refresh_token: string;
}
