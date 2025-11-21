"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const supabase_service_1 = require("../supabase/supabase.service");
const user_service_1 = require("../user/user.service");
let AuthService = class AuthService {
    supabaseService;
    userService;
    constructor(supabaseService, userService) {
        this.supabaseService = supabaseService;
        this.userService = userService;
    }
    async signUp(signUpDto) {
        const { email, password, metadata } = signUpDto;
        const { data, error } = await this.supabaseService
            .getClient()
            .auth.admin.createUser({
            email,
            password,
            email_confirm: true,
            user_metadata: metadata || {},
        });
        if (error) {
            throw new common_1.BadRequestException(error.message);
        }
        try {
            await this.userService.create({
                supabaseUserId: data.user.id,
                email: data.user.email,
                firstName: metadata?.firstName,
                lastName: metadata?.lastName,
                metadata: metadata || {},
            });
        }
        catch (localUserError) {
            console.error('Failed to create local user:', localUserError);
        }
        return {
            user: data.user,
            message: 'User created successfully',
        };
    }
    async signIn(signInDto) {
        const { email, password } = signInDto;
        const { data, error } = await this.supabaseService
            .getClientForAuth()
            .auth.signInWithPassword({
            email,
            password,
        });
        if (error) {
            throw new common_1.UnauthorizedException(error.message);
        }
        if (!data.session) {
            throw new common_1.UnauthorizedException('No session returned');
        }
        return {
            access_token: data.session.access_token,
            refresh_token: data.session.refresh_token,
            user: data.user,
        };
    }
    async signOut(accessToken) {
        const client = this.supabaseService.getClientWithAuth(accessToken);
        const { error } = await client.auth.signOut();
        if (error) {
            throw new common_1.UnauthorizedException(error.message);
        }
        return {
            message: 'Signed out successfully',
        };
    }
    async getUser(accessToken) {
        const client = this.supabaseService.getClientWithAuth(accessToken);
        const { data: { user }, error, } = await client.auth.getUser();
        if (error || !user) {
            throw new common_1.UnauthorizedException('Invalid or expired token');
        }
        return user;
    }
    async refreshToken(refreshToken) {
        const { data, error } = await this.supabaseService
            .getClientForAuth()
            .auth.refreshSession({
            refresh_token: refreshToken,
        });
        if (error) {
            throw new common_1.UnauthorizedException(error.message);
        }
        if (!data.session) {
            throw new common_1.UnauthorizedException('No session returned');
        }
        return {
            access_token: data.session.access_token,
            refresh_token: data.session.refresh_token,
            user: data.user,
        };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [supabase_service_1.SupabaseService,
        user_service_1.UserService])
], AuthService);
//# sourceMappingURL=auth.service.js.map