import { Module, Global } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { PermissionsGuard, ResourceOwnerGuard, DepartmentMemberGuard, ActiveUserGuard, TenantMemberGuard } from './permissions.guard';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { AuthController } from './auth.controller';

/**
 * Global Auth Module - Provides authentication and authorization services
 * 
 * This module:
 * - Configures JWT authentication
 * - Registers RBAC guards and decorators
 * - Provides auth services globally
 * - Sets up role-based permission checking
 */
@Global()
@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET') || 'fallback-secret-key',
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRES_IN') || '24h',
          issuer: configService.get<string>('JWT_ISSUER') || 'inventara-ierp',
          audience: configService.get<string>('JWT_AUDIENCE') || 'inventara-users',
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    PermissionsGuard,
    ResourceOwnerGuard, 
    DepartmentMemberGuard,
    ActiveUserGuard,
    TenantMemberGuard,
  ],
  exports: [
    AuthService,
    JwtModule,
    PassportModule,
    PermissionsGuard,
    ResourceOwnerGuard,
    DepartmentMemberGuard,
    ActiveUserGuard,
    TenantMemberGuard,
  ],
})
export class AuthModule {}

/**
 * Auth configuration interface
 */
export interface AuthConfig {
  jwtSecret: string;
  jwtExpiresIn: string;
  jwtIssuer: string;
  jwtAudience: string;
  bcryptSaltRounds: number;
  sessionTimeout: number;
  maxLoginAttempts: number;
  lockoutDuration: number;
  passwordResetExpiry: number;
  refreshTokenExpiry: string;
}