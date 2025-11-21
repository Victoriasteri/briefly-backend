import { AuthService } from './auth.service';
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    signUp(signUpDto: SignUpDto): Promise<{
        user: import("@supabase/auth-js").User;
        message: string;
    }>;
    signIn(signInDto: SignInDto): Promise<{
        access_token: string;
        refresh_token: string;
        user: import("@supabase/auth-js").User;
    }>;
    signOut(req: any): Promise<{
        message: string;
    }>;
    getMe(req: any): Promise<import("@supabase/auth-js").User>;
    refreshToken(refreshTokenDto: RefreshTokenDto): Promise<{
        access_token: string;
        refresh_token: string;
        user: import("@supabase/auth-js").User | null;
    }>;
}
