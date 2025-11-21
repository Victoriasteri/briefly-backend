import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { UserService } from '../user/user.service';
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';
import {
  SignUpResponseDto,
  SignInResponseDto,
  RefreshTokenResponseDto,
  UserResponseDto,
} from './dto/auth-response.dto';

@Injectable()
export class AuthService {
  constructor(
    private supabaseService: SupabaseService,
    private userService: UserService,
  ) {}

  async signUp(signUpDto: SignUpDto) {
    const { email, password, metadata } = signUpDto;

    const { data, error } = await this.supabaseService
      .getClient()
      .auth.admin.createUser({
        email,
        password,
        email_confirm: true, // Auto-confirm email for development
        user_metadata: metadata || {},
      });

    if (error) {
      throw new BadRequestException(error.message);
    }

    // Create local user record
    try {
      await this.userService.create({
        supabaseUserId: data.user.id,
        email: data.user.email!,
        firstName: metadata?.firstName,
        lastName: metadata?.lastName,
        metadata: metadata || {},
      });
    } catch (localUserError) {
      // If local user creation fails, log but don't fail the signup
      // The user can still be created in Supabase
      console.error('Failed to create local user:', localUserError);
    }

    // Sanitize user object - remove any sensitive data
    const sanitizedUser = this.sanitizeUser(data.user);

    return {
      user: sanitizedUser,
      message: 'User created successfully',
    } as SignUpResponseDto;
  }

  async signIn(signInDto: SignInDto) {
    const { email, password } = signInDto;

    // Use anon key client for sign in (client-side operation)
    const { data, error } = await this.supabaseService
      .getClientForAuth()
      .auth.signInWithPassword({
        email,
        password,
      });

    if (error) {
      throw new UnauthorizedException(error.message);
    }

    if (!data.session) {
      throw new UnauthorizedException('No session returned');
    }

    // Sanitize user object - remove any sensitive data
    const sanitizedUser = this.sanitizeUser(data.user);

    return {
      access_token: data.session.access_token,
      refresh_token: data.session.refresh_token,
      user: sanitizedUser,
    } as SignInResponseDto;
  }

  async signOut(accessToken: string) {
    const client = this.supabaseService.getClientWithAuth(accessToken);

    const { error } = await client.auth.signOut();

    if (error) {
      throw new UnauthorizedException(error.message);
    }

    return {
      message: 'Signed out successfully',
    };
  }

  async getUser(accessToken: string) {
    const client = this.supabaseService.getClientWithAuth(accessToken);

    const {
      data: { user },
      error,
    } = await client.auth.getUser();

    if (error || !user) {
      throw new UnauthorizedException('Invalid or expired token');
    }

    // Sanitize user object - remove any sensitive data
    return this.sanitizeUser(user);
  }

  async refreshToken(refreshToken: string) {
    // Use anon key client for refresh token (client-side operation)
    const { data, error } = await this.supabaseService
      .getClientForAuth()
      .auth.refreshSession({
        refresh_token: refreshToken,
      });

    if (error) {
      throw new UnauthorizedException(error.message);
    }

    if (!data.session) {
      throw new UnauthorizedException('No session returned');
    }

    // Sanitize user object - remove any sensitive data
    const sanitizedUser = this.sanitizeUser(data.user);

    return {
      access_token: data.session.access_token,
      refresh_token: data.session.refresh_token,
      user: sanitizedUser,
    } as RefreshTokenResponseDto;
  }

  /**
   * Sanitize user object to remove sensitive data like passwords
   * Supabase doesn't return passwords, but we ensure no sensitive data leaks
   */
  private sanitizeUser(user: any): UserResponseDto {
    // Create a clean user object with only safe fields
    const sanitized: any = {
      id: user.id,
      email: user.email,
      created_at: user.created_at,
    };

    // Only include optional fields if they exist
    if (user.user_metadata) {
      sanitized.user_metadata = user.user_metadata;
    }
    if (user.updated_at) {
      sanitized.updated_at = user.updated_at;
    }
    if (user.app_metadata) {
      sanitized.app_metadata = user.app_metadata;
    }
    if (user.aud) {
      sanitized.aud = user.aud;
    }
    if (user.confirmed_at) {
      sanitized.confirmed_at = user.confirmed_at;
    }
    if (user.last_sign_in_at) {
      sanitized.last_sign_in_at = user.last_sign_in_at;
    }

    // Explicitly exclude any password-related fields
    delete sanitized.password;
    delete sanitized.encrypted_password;
    delete sanitized.password_hash;
    delete sanitized.raw_user_meta_data?.password;
    delete sanitized.raw_app_meta_data?.password;

    return sanitized as UserResponseDto;
  }
}
