import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { ConfigService } from '@nestjs/config';

/**
 * Enhanced Prisma Service with RBAC Integration
 * 
 * This service:
 * - Manages database connections
 * - Provides transaction support
 * - Integrates with Row-Level Security (RLS)
 * - Supports multi-tenant operations
 * - Handles connection pooling and cleanup
 */
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor(private readonly configService: ConfigService) {
    super({
      datasources: {
        db: {
          url: configService.get<string>('DATABASE_URL'),
        },
      },
      log: [
        {
          emit: 'event',
          level: 'query',
        },
        {
          emit: 'event',
          level: 'error',
        },
        {
          emit: 'event',
          level: 'info',
        },
        {
          emit: 'event',
          level: 'warn',
        },
      ],
    });

    // Log queries in development
    if (configService.get<string>('NODE_ENV') === 'development') {
      this.$on('query', (e) => {
        console.log('Query: ' + e.query);
        console.log('Params: ' + e.params);
        console.log('Duration: ' + e.duration + 'ms');
      });
    }

    // Log errors
    this.$on('error', (e) => {
      console.error('Prisma error:', e);
    });
  }

  /**
   * Initialize database connection
   */
  async onModuleInit() {
    await this.$connect();
    
    // Enable required PostgreSQL extensions
    await this.enableExtensions();
    
    console.log('✅ Database connected successfully');
  }

  /**
   * Cleanup database connection
   */
  async onModuleDestroy() {
    await this.$disconnect();
    console.log('🔌 Database disconnected');
  }

  /**
   * Enable required PostgreSQL extensions
   */
  private async enableExtensions() {
    try {
      // Enable UUID extension for primary keys
      await this.$executeRaw`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
      
      // Enable RLS (Row Level Security)
      await this.$executeRaw`-- RLS is enabled per table in schema.sql`;
      
      console.log('✅ PostgreSQL extensions enabled');
    } catch (error) {
      console.warn('⚠️ Some extensions might already be enabled:', error.message);
    }
  }

  /**
   * Set session context for RLS (Row-Level Security)
   * This must be called at the start of each request to ensure proper data isolation
   */
  async setSessionContext(context: {
    tenantId: string;
    userId?: string;
    role?: string;
    departmentId?: string | null;
  }): Promise<void> {
    try {
      await this.$executeRaw`
        SELECT set_config('app.tenant_id', ${context.tenantId}, true),
               set_config('app.user_id', ${context.userId || ''}, true),
               set_config('app.role', ${context.role || ''}, true),
               set_config('app.department_id', ${context.departmentId || ''}, true)
      `;
    } catch (error) {
      console.error('Failed to set session context:', error);
      throw new Error('Database session context setup failed');
    }
  }

  /**
   * Execute a transaction with proper RLS context
   */
  async executeInTransaction<T>(
    context: {
      tenantId: string;
      userId?: string;
      role?: string;
      departmentId?: string | null;
    },
    operation: (tx: PrismaClient) => Promise<T>
  ): Promise<T> {
    return this.$transaction(async (tx) => {
      // Set session context for this transaction
      await tx.$executeRaw`
        SELECT set_config('app.tenant_id', ${context.tenantId}, true),
               set_config('app.user_id', ${context.userId || ''}, true),
               set_config('app.role', ${context.role || ''}, true),
               set_config('app.department_id', ${context.departmentId || ''}, true)
      `;
      
      // Execute the operation within the transaction
      return operation(tx);
    });
  }

  /**
   * Clear session context (useful for cleanup)
   */
  async clearSessionContext(): Promise<void> {
    try {
      await this.$executeRaw`
        SELECT set_config('app.tenant_id', '', true),
               set_config('app.user_id', '', true),
               set_config('app.role', '', true),
               set_config('app.department_id', '', true)
      `;
    } catch (error) {
      console.warn('Failed to clear session context:', error);
    }
  }

  /**
   * Health check for database connection
   */
  async healthCheck(): Promise<{ status: string; timestamp: Date; version?: string }> {
    try {
      const result = await this.$queryRaw<Array<{ version: string }>>`SELECT version()`;
      
      return {
        status: 'healthy',
        timestamp: new Date(),
        version: result[0]?.version || 'unknown',
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        timestamp: new Date(),
      };
    }
  }

  /**
   * Get database statistics (for monitoring)
   */
  async getDatabaseStats(): Promise<{
    connectionCount: number;
    activeTransactions: number;
    databaseSize: string;
  }> {
    try {
      const [connectionResult, transactionResult, sizeResult] = await Promise.all([
        this.$queryRaw<Array<{ count: bigint }>>`
          SELECT count(*) as count FROM pg_stat_activity WHERE state = 'active'
        `,
        this.$queryRaw<Array<{ count: bigint }>>`
          SELECT count(*) as count FROM pg_stat_activity WHERE state IN ('idle in transaction', 'active')
        `,
        this.$queryRaw<Array<{ size: string }>>`
          SELECT pg_size_pretty(pg_database_size(current_database())) as size
        `,
      ]);

      return {
        connectionCount: Number(connectionResult[0]?.count || 0),
        activeTransactions: Number(transactionResult[0]?.count || 0),
        databaseSize: sizeResult[0]?.size || 'unknown',
      };
    } catch (error) {
      console.error('Failed to get database stats:', error);
      return {
        connectionCount: 0,
        activeTransactions: 0,
        databaseSize: 'unknown',
      };
    }
  }

  /**
   * Validate tenant exists and is active
   */
  async validateTenant(tenantId: string): Promise<boolean> {
    try {
      const tenant = await this.tenant.findUnique({
        where: { id: tenantId },
        select: { id: true, status: true },
      });
      
      return tenant?.status === 'active';
    } catch (error) {
      console.error('Failed to validate tenant:', error);
      return false;
    }
  }

  /**
   * Get tenant information
   */
  async getTenantInfo(tenantId: string) {
    return this.tenant.findUnique({
      where: { id: tenantId },
      select: {
        id: true,
        name: true,
        gstin: true,
        stateCode: true,
        plan: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  /**
   * Soft delete helper - marks records as inactive instead of deleting
   */
  async softDelete(
    model: string,
    where: any,
    context: {
      tenantId: string;
      userId: string;
      role: string;
      departmentId?: string | null;
    }
  ): Promise<any> {
    await this.setSessionContext(context);
    
    // Use bracket notation to access dynamic model
    const modelClient = (this as any)[model];
    
    if (!modelClient) {
      throw new Error(`Model ${model} not found`);
    }
    
    return modelClient.updateMany({
      where: {
        ...where,
        tenantId: context.tenantId,
      },
      data: {
        status: 'inactive',
        updatedAt: new Date(),
      },
    });
  }

  /**
   * Bulk operations with RLS context
   */
  async bulkOperation<T>(
    context: {
      tenantId: string;
      userId: string;
      role: string;
      departmentId?: string | null;
    },
    operations: Array<() => Promise<T>>
  ): Promise<T[]> {
    return this.executeInTransaction(context, async () => {
      const results: T[] = [];
      
      for (const operation of operations) {
        const result = await operation();
        results.push(result);
      }
      
      return results;
    });
  }

  /**
   * Search across multiple models with RLS
   */
  async globalSearch(
    context: {
      tenantId: string;
      userId: string;
      role: string;
      departmentId?: string | null;
    },
    searchTerm: string,
    models: string[] = ['supplier', 'customer', 'item', 'requisition', 'purchaseOrder']
  ) {
    await this.setSessionContext(context);
    
    const results: any = {};
    
    for (const model of models) {
      try {
        const modelClient = (this as any)[model];
        if (modelClient) {
          // Basic text search - would be enhanced with proper full-text search
          const searchResults = await modelClient.findMany({
            where: {
              tenantId: context.tenantId,
              OR: [
                { name: { contains: searchTerm, mode: 'insensitive' } },
                { description: { contains: searchTerm, mode: 'insensitive' } },
                { code: { contains: searchTerm, mode: 'insensitive' } },
              ].filter(Boolean),
            },
            take: 10,
          });
          
          results[model] = searchResults;
        }
      } catch (error) {
        console.warn(`Search failed for model ${model}:`, error.message);
        results[model] = [];
      }
    }
    
    return results;
  }
}