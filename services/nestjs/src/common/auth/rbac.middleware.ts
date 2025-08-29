import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { SessionService } from './session.service';
import { AuthenticatedRequest } from './permissions.guard';

/**
 * Enhanced request interface with RBAC context
 */
export interface RBACRequest extends AuthenticatedRequest {
  rbac?: {
    sessionId?: string;
    permissions: string[];
    features: Record<string, boolean>;
    canAccess: (permission: string) => boolean;
    hasFeature: (feature: string) => boolean;
    getDepartmentScope: () => string | null;
    getTenantScope: () => string;
  };
}

/**
 * RBAC Middleware
 * 
 * Enhances authenticated requests with RBAC context:
 * - Validates session and tracks activity
 * - Adds permission checking utilities to request
 * - Provides feature access helpers
 * - Tracks permission checks for audit
 */
@Injectable()
export class RBACMiddleware implements NestMiddleware {
  constructor(private readonly sessionService: SessionService) {}

  async use(req: RBACRequest, res: Response, next: NextFunction) {
    // Only process authenticated requests
    if (!req.user) {
      return next();
    }

    const user = req.user;
    const sessionToken = this.extractSessionToken(req);

    // Validate session if token exists
    let sessionContext = null;
    if (sessionToken) {
      sessionContext = await this.sessionService.validateSession(sessionToken);
      
      // Track API activity
      if (sessionContext) {
        await this.sessionService.trackAPIActivity(
          sessionContext.sessionId,
          req.path,
          this.getClientIP(req),
          req.get('User-Agent'),
          {
            method: req.method,
            query: req.query,
            body: this.sanitizeRequestBody(req.body),
          }
        );
      }
    }

    // Get user permissions and features
    const { getRolePermissions, hasFeatureAccess, FeaturePermissions } = await import('./permissions');
    const userPermissions = getRolePermissions(user.role);
    const permissionStrings = userPermissions.map(p => p.toString());

    // Calculate feature access
    const features: Record<string, boolean> = {};
    Object.keys(FeaturePermissions).forEach(feature => {
      features[feature] = hasFeatureAccess(user.role, feature as keyof typeof FeaturePermissions);
    });

    // Add RBAC context to request
    req.rbac = {
      sessionId: sessionContext?.sessionId,
      permissions: permissionStrings,
      features,
      
      // Permission checking utility
      canAccess: (permission: string) => {
        const hasPermission = permissionStrings.includes(permission);
        
        // Track permission check for audit
        if (sessionContext) {
          this.sessionService.trackPermissionCheck(
            sessionContext.sessionId,
            permission,
            hasPermission,
            req.path
          );
        }
        
        return hasPermission;
      },

      // Feature access utility
      hasFeature: (feature: string) => {
        return features[feature] || false;
      },

      // Department scope utility
      getDepartmentScope: () => {
        return user.departmentId;
      },

      // Tenant scope utility
      getTenantScope: () => {
        return user.tenantId;
      },
    };

    // Set headers for client-side RBAC
    this.setRBACHeaders(res, user, permissionStrings, features);

    next();
  }

  /**
   * Extract session token from request
   */
  private extractSessionToken(req: Request): string | null {
    const authHeader = req.get('Authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      return authHeader.substring(7);
    }
    return null;
  }

  /**
   * Get client IP address
   */
  private getClientIP(req: Request): string {
    return (req.get('X-Forwarded-For') || 
            req.get('X-Real-IP') || 
            req.connection.remoteAddress || 
            'unknown').split(',')[0].trim();
  }

  /**
   * Sanitize request body for logging (remove sensitive data)
   */
  private sanitizeRequestBody(body: any): any {
    if (!body || typeof body !== 'object') {
      return body;
    }

    const sensitiveFields = ['password', 'token', 'secret', 'key', 'authorization'];
    const sanitized = { ...body };

    Object.keys(sanitized).forEach(key => {
      if (sensitiveFields.some(field => key.toLowerCase().includes(field))) {
        sanitized[key] = '[REDACTED]';
      }
    });

    return sanitized;
  }

  /**
   * Set RBAC headers for client consumption
   */
  private setRBACHeaders(
    res: Response, 
    user: any, 
    permissions: string[], 
    features: Record<string, boolean>
  ): void {
    // Set user context headers (for debugging/monitoring)
    res.setHeader('X-User-Role', user.role);
    res.setHeader('X-User-Tenant', user.tenantId);
    
    if (user.departmentId) {
      res.setHeader('X-User-Department', user.departmentId);
    }

    // Set permission summary header
    res.setHeader('X-User-Permissions-Count', permissions.length.toString());
    
    // Set feature access summary
    const enabledFeatures = Object.entries(features)
      .filter(([_, enabled]) => enabled)
      .map(([feature, _]) => feature);
    
    res.setHeader('X-User-Features-Count', enabledFeatures.length.toString());
  }
}

/**
 * RBAC Context decorator for extracting RBAC info in controllers
 */
export const RBACContext = () => {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    const originalMethod = descriptor.value;

    descriptor.value = function (...args: any[]) {
      const req = args.find(arg => arg && arg.rbac) as RBACRequest;
      
      if (req && req.rbac) {
        // Add RBAC context as method parameter
        args.push(req.rbac);
      }

      return originalMethod.apply(this, args);
    };

    return descriptor;
  };
};

/**
 * Utility function to check permissions in controllers
 */
export function checkPermission(req: RBACRequest, permission: string): boolean {
  return req.rbac?.canAccess(permission) || false;
}

/**
 * Utility function to check feature access in controllers
 */
export function checkFeature(req: RBACRequest, feature: string): boolean {
  return req.rbac?.hasFeature(feature) || false;
}

/**
 * Utility function to get department scope
 */
export function getDepartmentScope(req: RBACRequest): string | null {
  return req.rbac?.getDepartmentScope() || null;
}

/**
 * Utility function to get tenant scope
 */
export function getTenantScope(req: RBACRequest): string {
  return req.rbac?.getTenantScope() || req.user?.tenantId || '';
}