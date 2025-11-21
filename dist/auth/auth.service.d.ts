import { SupabaseService } from '../supabase/supabase.service';
import { UserService } from '../user/user.service';
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';
export declare class AuthService {
    private supabaseService;
    private userService;
    constructor(supabaseService: SupabaseService, userService: UserService);
    signUp(signUpDto: SignUpDto): Promise<{
        user: import("@supabase/auth-js").User;
        message: string;
    }>;
    signIn(signInDto: SignInDto): Promise<{
        access_token: string;
        refresh_token: string;
        user: import("@supabase/auth-js").User;
    }>;
    signOut(accessToken: string): Promise<{
        message: string;
    }>;
    getUser(accessToken: string): Promise<import("@supabase/auth-js").User>;
    refreshToken(refreshToken: string): Promise<{
        access_token: string;
        refresh_token: string;
        user: import("@supabase/auth-js").User | null;
    }>;
}
