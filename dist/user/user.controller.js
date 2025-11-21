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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const user_service_1 = require("./user.service");
const update_user_dto_1 = require("./dto/update-user.dto");
const auth_guard_1 = require("../auth/auth.guard");
let UserController = class UserController {
    userService;
    constructor(userService) {
        this.userService = userService;
    }
    async getMe(req) {
        const supabaseUser = req.user;
        const localUser = await this.userService.findBySupabaseUserId(supabaseUser.id);
        if (!localUser) {
            return this.userService.create({
                supabaseUserId: supabaseUser.id,
                email: supabaseUser.email,
                firstName: supabaseUser.user_metadata?.firstName,
                lastName: supabaseUser.user_metadata?.lastName,
                metadata: supabaseUser.user_metadata,
            });
        }
        return localUser;
    }
    async findOne(id) {
        return this.userService.findById(id);
    }
    async updateMe(req, updateUserDto) {
        const supabaseUser = req.user;
        const localUser = await this.userService.findBySupabaseUserId(supabaseUser.id);
        if (!localUser) {
            throw new Error('Local user not found');
        }
        return this.userService.update(localUser.id, updateUserDto);
    }
    async findAll() {
        return this.userService.findAll();
    }
    async remove(id) {
        return this.userService.remove(id);
    }
};
exports.UserController = UserController;
__decorate([
    (0, common_1.Get)('me'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Get current user profile' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Current user information',
        schema: {
            example: {
                id: 'uuid',
                supabaseUserId: 'supabase-uuid',
                email: 'user@example.com',
                firstName: 'John',
                lastName: 'Doe',
                metadata: {},
                createdAt: '2025-01-21T12:00:00.000Z',
                updatedAt: '2025-01-21T12:00:00.000Z',
            },
        },
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getMe", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Get user by ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'User UUID', example: 'uuid' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'User information',
        schema: {
            example: {
                id: 'uuid',
                supabaseUserId: 'supabase-uuid',
                email: 'user@example.com',
                firstName: 'John',
                lastName: 'Doe',
                metadata: {},
                createdAt: '2025-01-21T12:00:00.000Z',
                updatedAt: '2025-01-21T12:00:00.000Z',
            },
        },
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'User not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)('me'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Update current user profile' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'User successfully updated',
        schema: {
            example: {
                id: 'uuid',
                supabaseUserId: 'supabase-uuid',
                email: 'user@example.com',
                firstName: 'John',
                lastName: 'Doe',
                metadata: {},
                createdAt: '2025-01-21T12:00:00.000Z',
                updatedAt: '2025-01-21T12:00:00.000Z',
            },
        },
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, update_user_dto_1.UpdateUserDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "updateMe", null);
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Get all users' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'List of all users',
        schema: {
            example: [
                {
                    id: 'uuid',
                    supabaseUserId: 'supabase-uuid',
                    email: 'user@example.com',
                    firstName: 'John',
                    lastName: 'Doe',
                },
            ],
        },
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UserController.prototype, "findAll", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Delete user by ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'User UUID', example: 'uuid' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'User successfully deleted',
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'User not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "remove", null);
exports.UserController = UserController = __decorate([
    (0, swagger_1.ApiTags)('users'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, common_1.Controller)('users'),
    __metadata("design:paramtypes", [user_service_1.UserService])
], UserController);
//# sourceMappingURL=user.controller.js.map