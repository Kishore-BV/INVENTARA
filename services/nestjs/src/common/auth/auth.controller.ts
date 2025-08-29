import {
  Controller,
  Post,
  Get,
  Put,
  Body,
  Request,
  UseGuards,
  HttpStatus,
  HttpCode,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength, IsEnum, IsOptional, IsUUID } from 'class-validator';

import { AuthService, CreateUserDto, LoginDto, ChangePasswordDto } from './auth.service';
import { PermissionsGuard, AuthenticatedRequest } from './permissions.guard';
import { RequirePermissions, CanManageUsers } from './require-permissions.decorator';
import { Permission, Role } from './permissions';

/**
 * DTOs for API validation
 */
class LoginRequestDto implements LoginDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'password123' })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ example: 'tenant-uuid', required: false })
  @IsOptional()
  @IsUUID()
  tenantId?: string;
}

class CreateUserRequestDto implements CreateUserDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'password123' })
  @IsString()
  @MinLength(8)
  password: string;

  @ApiProperty({ example: 'John' })
  @IsString()
  firstName: string;

  @ApiProperty({ example: 'Doe' })
  @IsString()
  lastName: string;

  @ApiProperty({ enum: ['ADMIN', 'HOD', 'EMPLOYEE'] })
  @IsEnum(['ADMIN', 'HOD', 'EMPLOYEE'])
  role: Role;

  @ApiProperty({ example: 'dept-uuid', required: false })
  @IsOptional()
  @IsUUID()
  departmentId?: string;

  @ApiProperty({ example: '+1234567890', required: false })
  @IsOptional()
  @IsString()
  phone?: string;
}

class ChangePasswordRequestDto implements ChangePasswordDto {
  @ApiProperty({ example: 'currentPassword123' })
  @IsString()
  currentPassword: string;

  @ApiProperty({ example: 'newPassword123' })
  @IsString()
  @MinLength(8)
  newPassword: string;
}

class RefreshTokenRequestDto {
  @ApiProperty({ example: 'refresh_token_here' })
  @IsString()
  refreshToken: string;
}

class UpdateProfileRequestDto {
  @ApiProperty({ example: 'John', required: false })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiProperty({ example: 'Doe', required: false })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiProperty({ example: '+1234567890', required: false })
  @IsOptional()
  @IsString()
  phone?: string;
}

/**
 * Authentication Controller
 * 
 * Handles:
 * - User login/logout
 * - User registration (Admin only)
 * - Password management
 * - Profile management
 * - Token refresh
 */
@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * User login
   */
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ 
    summary: 'User login',
    description: 'Authenticate user with email and password. Returns JWT access token and user profile.'
  })
  @ApiBody({ type: LoginRequestDto })
  @ApiResponse({ 
    status: 200, 
    description: 'Login successful',
    schema: {
      example: {
        accessToken: 'jwt_token_here',
        refreshToken: 'refresh_token_here',
        user: {
          id: 'user-uuid',
          email: 'user@example.com',
          firstName: 'John',
          lastName: 'Doe',
          role: 'HOD',
          tenantId: 'tenant-uuid',
          departmentId: 'dept-uuid'
        },
        expiresIn: 86400
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(@Body(ValidationPipe) loginDto: LoginRequestDto) {
    return this.authService.login(loginDto);
  }

  /**
   * Register new user (Admin only)
   */
  @Post('register')
  @UseGuards(AuthGuard('jwt'), PermissionsGuard)
  @CanManageUsers()
  @ApiOperation({ 
    summary: 'Register new user',
    description: 'Create a new user account. Requires ADMIN role.'
  })
  @ApiBearerAuth()
  @ApiBody({ type: CreateUserRequestDto })
  @ApiResponse({ 
    status: 201, 
    description: 'User created successfully',
    schema: {
      example: {
        id: 'user-uuid',
        email: 'user@example.com',
        firstName: 'John',
        lastName: 'Doe',
        role: 'EMPLOYEE',
        tenantId: 'tenant-uuid',
        departmentId: 'dept-uuid',
        departmentName: 'Sales',
        isActive: true,
        createdAt: '2024-01-25T10:00:00Z'
      }
    }
  })
  @ApiResponse({ status: 403, description: 'Insufficient permissions' })
  @ApiResponse({ status: 409, description: 'User already exists' })
  async register(
    @Body(ValidationPipe) createUserDto: CreateUserRequestDto,
    @Request() req: AuthenticatedRequest,
  ) {
    return this.authService.register(createUserDto, req.user.tenantId);
  }

  /**
   * Get current user profile
   */
  @Get('profile')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ 
    summary: 'Get user profile',
    description: 'Get current authenticated user profile information.'
  })
  @ApiBearerAuth()
  @ApiResponse({ 
    status: 200, 
    description: 'Profile retrieved successfully',
    schema: {
      example: {
        id: 'user-uuid',
        email: 'user@example.com',
        firstName: 'John',
        lastName: 'Doe',
        phone: '+1234567890',
        role: 'HOD',
        tenantId: 'tenant-uuid',
        departmentId: 'dept-uuid',
        departmentName: 'Sales',
        isActive: true,
        lastLoginAt: '2024-01-25T09:30:00Z',
        createdAt: '2024-01-01T00:00:00Z'
      }
    }
  })
  async getProfile(@Request() req: AuthenticatedRequest) {
    return this.authService.getProfile(req.user.id);
  }

  /**
   * Update user profile
   */
  @Put('profile')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ 
    summary: 'Update user profile',
    description: 'Update current user profile information (name, phone).'
  })
  @ApiBearerAuth()
  @ApiBody({ type: UpdateProfileRequestDto })
  @ApiResponse({ status: 200, description: 'Profile updated successfully' })
  async updateProfile(
    @Body(ValidationPipe) updateProfileDto: UpdateProfileRequestDto,
    @Request() req: AuthenticatedRequest,
  ) {
    return this.authService.updateProfile(req.user.id, updateProfileDto);
  }

  /**
   * Change password
   */
  @Post('change-password')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ 
    summary: 'Change password',
    description: 'Change current user password. Requires current password for verification.'
  })
  @ApiBearerAuth()
  @ApiBody({ type: ChangePasswordRequestDto })
  @ApiResponse({ status: 200, description: 'Password changed successfully' })
  @ApiResponse({ status: 401, description: 'Current password is incorrect' })
  async changePassword(
    @Body(ValidationPipe) changePasswordDto: ChangePasswordRequestDto,
    @Request() req: AuthenticatedRequest,
  ) {
    await this.authService.changePassword(req.user.id, changePasswordDto);
    return { message: 'Password changed successfully' };
  }

  /**
   * Refresh access token
   */
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ 
    summary: 'Refresh access token',
    description: 'Get new access token using refresh token.'
  })
  @ApiBody({ type: RefreshTokenRequestDto })
  @ApiResponse({ 
    status: 200, 
    description: 'Token refreshed successfully',
    schema: {
      example: {
        accessToken: 'new_jwt_token_here',
        expiresIn: 86400
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Invalid refresh token' })
  async refreshToken(@Body(ValidationPipe) refreshTokenDto: RefreshTokenRequestDto) {
    return this.authService.refreshToken(refreshTokenDto.refreshToken);
  }

  /**
   * Logout user
   */
  @Post('logout')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ 
    summary: 'User logout',
    description: 'Logout current user and invalidate session.'
  })
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'Logout successful' })
  async logout(@Request() req: AuthenticatedRequest) {
    const sessionToken = req.headers.authorization?.replace('Bearer ', '') || '';
    await this.authService.logout(req.user.id, sessionToken);
    return { message: 'Logout successful' };
  }

  /**
   * Validate token (for internal use)
   */
  @Get('validate')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ 
    summary: 'Validate token',
    description: 'Validate current JWT token and return user context.'
  })
  @ApiBearerAuth()
  @ApiResponse({ 
    status: 200, 
    description: 'Token is valid',
    schema: {
      example: {
        valid: true,
        user: {
          id: 'user-uuid',
          email: 'user@example.com',
          role: 'HOD',
          tenantId: 'tenant-uuid',
          departmentId: 'dept-uuid'
        }
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Invalid or expired token' })
  async validateToken(@Request() req: AuthenticatedRequest) {
    return {
      valid: true,
      user: {
        id: req.user.id,
        email: req.user.email,
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        role: req.user.role,
        tenantId: req.user.tenantId,
        departmentId: req.user.departmentId,
      },
    };
  }

  /**
   * Get user permissions (for UI visibility)
   */
  @Get('permissions')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ 
    summary: 'Get user permissions',
    description: 'Get current user role-based permissions for UI visibility control.'
  })
  @ApiBearerAuth()
  @ApiResponse({ 
    status: 200, 
    description: 'Permissions retrieved successfully',
    schema: {
      example: {
        role: 'HOD',
        permissions: [
          'REQ_CREATE',
          'REQ_READ_DEPT',
          'REQ_APPROVE',
          'PO_CREATE',
          'SUPPLIERS_READ'
        ],
        features: {
          'ADMIN_CONSOLE': false,
          'PROCUREMENT_CREATE': true,
          'PROCUREMENT_APPROVE': true,
          'GST_CONSOLE': true
        }
      }
    }
  })
  async getUserPermissions(@Request() req: AuthenticatedRequest) {
    const { role } = req.user;
    
    // Import permissions dynamically to avoid circular dependency
    const { getRolePermissions, FeaturePermissions, hasFeatureAccess } = await import('./permissions');
    
    const permissions = getRolePermissions(role);
    const features: Record<string, boolean> = {};
    
    // Check feature access
    Object.keys(FeaturePermissions).forEach(feature => {
      features[feature] = hasFeatureAccess(role, feature as keyof typeof FeaturePermissions);
    });

    return {
      role,
      permissions,
      features,
    };
  }

  /**
   * Get user RBAC capabilities
   */
  @Get('capabilities')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ 
    summary: 'Get user RBAC capabilities',
    description: 'Get detailed role capabilities including approval limits and restrictions.'
  })
  @ApiBearerAuth()
  @ApiResponse({ 
    status: 200, 
    description: 'Capabilities retrieved successfully',
    schema: {
      example: {
        role: 'HOD',
        displayName: 'Head of Department',
        hierarchy: 50,
        capabilities: {
          canManageUsers: true,
          canApproveDocuments: true,
          canAccessGST: true,
          canViewReports: 'DEPARTMENT',
          canExportData: 'DEPARTMENT',
          maxApprovalAmount: 500000
        },
        approvalLimits: {
          requisitionLimit: 100000,
          purchaseOrderLimit: 500000,
          invoiceLimit: 500000,
          paymentLimit: 100000
        },
        restrictions: {
          maxDepartments: 1,
          allowCrossDepartmentAccess: false,
          requireMFA: false,
          sessionTimeout: 14400
        }
      }
    }
  })
  async getUserCapabilities(@Request() req: AuthenticatedRequest) {
    const { role, id: userId, tenantId, departmentId } = req.user;
    
    // Import RBAC config dynamically
    const { RBACConfigService } = await import('./rbac.config');
    const rbacConfig = new RBACConfigService(
      this.authService['configService'],
      this.authService['prisma']
    );
    
    const roleConfig = rbacConfig.getRoleConfig(role);
    const capabilities = rbacConfig.getRoleCapabilities(role);
    const approvalLimits = await rbacConfig.getEffectiveApprovalLimits(
      userId, 
      tenantId, 
      departmentId
    );
    
    return {
      role,
      displayName: roleConfig?.displayName,
      hierarchy: roleConfig?.hierarchy,
      capabilities,
      approvalLimits,
      restrictions: roleConfig?.restrictions,
    };
  }
}

// Re-export for convenience
export { ApiProperty } from '@nestjs/swagger';