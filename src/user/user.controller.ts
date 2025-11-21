import {
  Controller,
  Get,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from '../auth/auth.guard';

@ApiTags('users')
@ApiBearerAuth('JWT-auth')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({
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
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getMe(@Request() req) {
    // Get user from Supabase token
    const supabaseUser = req.user;

    // Find local user by Supabase user ID
    const localUser = await this.userService.findBySupabaseUserId(
      supabaseUser.id,
    );

    if (!localUser) {
      // If local user doesn't exist, create it
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

  @Get(':id')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiParam({ name: 'id', description: 'User UUID', example: 'uuid' })
  @ApiResponse({
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
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async findOne(@Param('id') id: string) {
    return this.userService.findById(id);
  }

  @Put('me')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Update current user profile' })
  @ApiResponse({
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
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async updateMe(@Request() req, @Body() updateUserDto: UpdateUserDto) {
    const supabaseUser = req.user;
    const localUser = await this.userService.findBySupabaseUserId(
      supabaseUser.id,
    );

    if (!localUser) {
      throw new Error('Local user not found');
    }

    return this.userService.update(localUser.id, updateUserDto);
  }

  @Get()
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({
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
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async findAll() {
    return this.userService.findAll();
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Delete user by ID' })
  @ApiParam({ name: 'id', description: 'User UUID', example: 'uuid' })
  @ApiResponse({
    status: 200,
    description: 'User successfully deleted',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
