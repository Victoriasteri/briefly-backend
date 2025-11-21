import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { UserService } from '../user/user.service';
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';

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

    return {
      user: data.user,
      message: 'User created successfully',
    };
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

    return {
      access_token: data.session.access_token,
      refresh_token: data.session.refresh_token,
      user: data.user,
    };
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

    return user;
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

    return {
      access_token: data.session.access_token,
      refresh_token: data.session.refresh_token,
      user: data.user,
    };
  }
}
