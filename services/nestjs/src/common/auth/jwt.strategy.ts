import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthenticatedUser } from './permissions.guard';

/**
 * JWT Token Payload interface
 */
export interface JwtPayload {
  sub: string; // User ID
  email: string;
  tenantId: string;
  departmentId?: string | null;
  role: 'ADMIN' | 'HOD' | 'EMPLOYEE';
  permissions?: string[]; // User permissions for quick access
  departmentName?: string | null; // Department name for display
  iat?: number; // Issued at
  exp?: number; // Expires at
  iss?: string; // Issuer
  aud?: string; // Audience
}

/**
 * JWT Strategy for Passport authentication
 * 
 * This strategy:
 * 1. Validates JWT tokens
 * 2. Extracts user context with RBAC information
 * 3. Verifies user is active and valid
 * 4. Sets up request.user with complete auth context
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET') || 'fallback-secret-key',
      issuer: configService.get<string>('JWT_ISSUER') || 'inventara-ierp',
      audience: configService.get<string>('JWT_AUDIENCE') || 'inventara-users',
    });
  }

  /**
   * Validate JWT payload and return user context
   */
  async validate(payload: JwtPayload): Promise<AuthenticatedUser> {
    const { sub: userId, email, tenantId, departmentId, role, permissions } = payload;

    // Validate payload structure
    if (!userId || !email || !tenantId || !role) {
      throw new UnauthorizedException('Invalid token payload');
    }

    // Get complete user information and validate active status
    const user = await this.authService.validateUserById(userId);

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('User account is inactive');
    }

    // Validate tenant membership
    if (user.tenantId !== tenantId) {
      throw new UnauthorizedException('Invalid tenant context');
    }

    // Validate department membership (if specified)
    if (departmentId && user.departmentId !== departmentId) {
      throw new UnauthorizedException('Invalid department context');
    }

    // Validate role consistency
    if (user.role !== role) {
      throw new UnauthorizedException('Role mismatch in token');
    }

    // Get current permissions for the user's role
    const { getRolePermissions } = await import('./permissions');
    const userPermissions = getRolePermissions(user.role);

    // Return authenticated user context with RBAC information
    return {
      id: user.id,
      tenantId: user.tenantId,
      departmentId: user.departmentId,
      departmentName: user.departmentName,
      role: user.role,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      isActive: user.isActive,
      permissions: userPermissions.map(p => p.toString()),
    };
  }
}