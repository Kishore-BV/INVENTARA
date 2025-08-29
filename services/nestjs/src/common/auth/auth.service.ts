import { Injectable, UnauthorizedException, BadRequestException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../database/prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtPayload } from './jwt.strategy';
import { Role } from './permissions';

/**
 * User registration DTO
 */
export interface CreateUserDto {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: Role;
  departmentId?: string;
  phone?: string;
}

/**
 * User login DTO
 */
export interface LoginDto {
  email: string;
  password: string;
  tenantId?: string; // Optional for multi-tenant login
}

/**
 * Login response interface
 */
export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: Role;
    tenantId: string;
    departmentId?: string | null;
  };
  expiresIn: number;
}

/**
 * User profile interface
 */
export interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string | null;
  role: Role;
  tenantId: string;
  departmentId?: string | null;
  departmentName?: string | null;
  isActive: boolean;
  lastLoginAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Password change DTO
 */
export interface ChangePasswordDto {
  currentPassword: string;
  newPassword: string;
}

/**
 * Authentication Service
 * 
 * Handles:
 * - User authentication and authorization
 * - JWT token generation and validation
 * - Password management
 * - User session management
 * - RBAC context setup
 */
@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Authenticate user with email and password
   */
  async login(loginDto: LoginDto): Promise<LoginResponse> {
    const { email, password, tenantId } = loginDto;

    // Find user by email and optional tenant
    const user = await this.prisma.user.findFirst({
      where: {
        email: email.toLowerCase(),
        isActive: true,
        ...(tenantId && { tenantId }),
      },
      include: {
        department: {
          select: {
            id: true,
            name: true,
            code: true,
          },
        },
      },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Verify password
    const passwordValid = await bcrypt.compare(password, user.passwordHash);
    if (!passwordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Update last login timestamp
    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    // Generate tokens
    const { accessToken, refreshToken } = await this.generateTokens(user);

    // Create user session
    await this.createUserSession(user.id, accessToken);

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role as Role,
        tenantId: user.tenantId,
        departmentId: user.departmentId,
      },
      expiresIn: this.getTokenExpiresIn(),
    };
  }

  /**
   * Register a new user (Admin only operation)
   */
  async register(createUserDto: CreateUserDto, creatorTenantId: string): Promise<UserProfile> {
    const { email, password, firstName, lastName, role, departmentId, phone } = createUserDto;

    // Check if user already exists
    const existingUser = await this.prisma.user.findFirst({
      where: {
        email: email.toLowerCase(),
        tenantId: creatorTenantId,
      },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Validate department exists if provided
    if (departmentId) {
      const department = await this.prisma.department.findFirst({
        where: {
          id: departmentId,
          tenantId: creatorTenantId,
        },
      });

      if (!department) {
        throw new BadRequestException('Invalid department specified');
      }
    }

    // Hash password
    const saltRounds = this.configService.get<number>('BCRYPT_SALT_ROUNDS') || 12;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Create user
    const user = await this.prisma.user.create({
      data: {
        email: email.toLowerCase(),
        passwordHash,
        firstName,
        lastName,
        phone,
        role: role as any, // Prisma enum conversion
        tenantId: creatorTenantId,
        departmentId,
        isActive: true,
      },
      include: {
        department: {
          select: {
            name: true,
          },
        },
      },
    });

    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      role: user.role as Role,
      tenantId: user.tenantId,
      departmentId: user.departmentId,
      departmentName: user.department?.name || null,
      isActive: user.isActive,
      lastLoginAt: user.lastLoginAt,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  /**
   * Validate user by ID (used by JWT strategy)
   */
  async validateUserById(userId: string): Promise<UserProfile | null> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        department: {
          select: {
            name: true,
          },
        },
      },
    });

    if (!user) {
      return null;
    }

    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      role: user.role as Role,
      tenantId: user.tenantId,
      departmentId: user.departmentId,
      departmentName: user.department?.name || null,
      isActive: user.isActive,
      lastLoginAt: user.lastLoginAt,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  /**
   * Refresh access token using refresh token
   */
  async refreshToken(refreshToken: string): Promise<{ accessToken: string; expiresIn: number }> {
    try {
      const payload = this.jwtService.verify(refreshToken) as JwtPayload;
      const user = await this.validateUserById(payload.sub);

      if (!user || !user.isActive) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const accessToken = await this.generateAccessToken(user);

      return {
        accessToken,
        expiresIn: this.getTokenExpiresIn(),
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  /**
   * Change user password
   */
  async changePassword(userId: string, changePasswordDto: ChangePasswordDto): Promise<void> {
    const { currentPassword, newPassword } = changePasswordDto;

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // Verify current password
    const currentPasswordValid = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!currentPasswordValid) {
      throw new UnauthorizedException('Current password is incorrect');
    }

    // Hash new password
    const saltRounds = this.configService.get<number>('BCRYPT_SALT_ROUNDS') || 12;
    const newPasswordHash = await bcrypt.hash(newPassword, saltRounds);

    // Update password
    await this.prisma.user.update({
      where: { id: userId },
      data: { passwordHash: newPasswordHash },
    });

    // Revoke all existing sessions for security
    await this.revokeAllUserSessions(userId);
  }

  /**
   * Logout user by revoking session
   */
  async logout(userId: string, sessionToken: string): Promise<void> {
    await this.prisma.userSession.updateMany({
      where: {
        userId,
        sessionToken,
        isActive: true,
      },
      data: {
        isActive: false,
        revokedAt: new Date(),
      },
    });
  }

  /**
   * Get user profile
   */
  async getProfile(userId: string): Promise<UserProfile> {
    const user = await this.validateUserById(userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return user;
  }

  /**
   * Update user profile
   */
  async updateProfile(
    userId: string,
    updateData: Partial<Pick<UserProfile, 'firstName' | 'lastName' | 'phone'>>
  ): Promise<UserProfile> {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: updateData,
      include: {
        department: {
          select: {
            name: true,
          },
        },
      },
    });

    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      role: user.role as Role,
      tenantId: user.tenantId,
      departmentId: user.departmentId,
      departmentName: user.department?.name || null,
      isActive: user.isActive,
      lastLoginAt: user.lastLoginAt,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  /**
   * Generate JWT access and refresh tokens
   */
  private async generateTokens(user: any): Promise<{ accessToken: string; refreshToken: string }> {
    // Import permissions dynamically to avoid circular dependency
    const { getRolePermissions } = await import('./permissions');
    const userPermissions = getRolePermissions(user.role);
    
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      tenantId: user.tenantId,
      departmentId: user.departmentId,
      departmentName: user.department?.name || null,
      role: user.role,
      permissions: userPermissions.map(p => p.toString()),
    };

    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRES_IN') || '7d',
    });

    return { accessToken, refreshToken };
  }

  /**
   * Generate access token only
   */
  private async generateAccessToken(user: UserProfile): Promise<string> {
    // Import permissions dynamically to avoid circular dependency
    const { getRolePermissions } = await import('./permissions');
    const userPermissions = getRolePermissions(user.role);
    
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      tenantId: user.tenantId,
      departmentId: user.departmentId,
      departmentName: user.departmentName,
      role: user.role,
      permissions: userPermissions.map(p => p.toString()),
    };

    return this.jwtService.sign(payload);
  }

  /**
   * Create user session record
   */
  private async createUserSession(userId: string, sessionToken: string): Promise<void> {
    const expiresAt = new Date();
    expiresAt.setTime(expiresAt.getTime() + this.getTokenExpiresIn() * 1000);

    await this.prisma.userSession.create({
      data: {
        userId,
        sessionToken,
        expiresAt,
        isActive: true,
      },
    });
  }

  /**
   * Revoke all user sessions
   */
  private async revokeAllUserSessions(userId: string): Promise<void> {
    await this.prisma.userSession.updateMany({
      where: {
        userId,
        isActive: true,
      },
      data: {
        isActive: false,
        revokedAt: new Date(),
      },
    });
  }

  /**
   * Get token expiration time in seconds
   */
  private getTokenExpiresIn(): number {
    const expiresIn = this.configService.get<string>('JWT_EXPIRES_IN') || '24h';
    
    // Convert time string to seconds
    if (expiresIn.endsWith('h')) {
      return parseInt(expiresIn) * 3600;
    } else if (expiresIn.endsWith('m')) {
      return parseInt(expiresIn) * 60;
    } else if (expiresIn.endsWith('d')) {
      return parseInt(expiresIn) * 86400;
    }
    
    return parseInt(expiresIn); // Assume seconds if no unit
  }
}