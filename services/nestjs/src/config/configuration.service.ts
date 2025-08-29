import { Injectable } from '@nestjs/common';
import { ConfigService as NestConfigService } from '@nestjs/config';
import { IsString, IsNumber, IsBoolean, IsEnum, IsOptional, validateSync } from 'class-validator';
import { Transform, plainToClass } from 'class-transformer';

export enum Environment {
  DEVELOPMENT = 'development',
  STAGING = 'staging',
  PRODUCTION = 'production',
}

export enum StorageType {
  LOCAL = 'local',
  S3 = 's3',
  GCS = 'gcs',
}

export enum QueueProvider {
  BULLMQ = 'bullmq',
  SQS = 'sqs',
  REDIS = 'redis',
}

export enum PdfEngine {
  PUPPETEER = 'puppeteer',
  PLAYWRIGHT = 'playwright',
  WKHTMLTOPDF = 'wkhtmltopdf',
}

export class EnvironmentVariables {
  @IsEnum(Environment)
  NODE_ENV: Environment;

  @IsNumber()
  @Transform(({ value }) => parseInt(value, 10))
  PORT: number;

  @IsString()
  HOST: string;

  // Database
  @IsString()
  DATABASE_URL: string;

  @IsString()
  @IsOptional()
  DATABASE_SCHEMA?: string;

  // GSP Configuration
  @IsString()
  GSP_BASE_URL: string;

  @IsString()
  GSP_APP_KEY: string;

  @IsString()
  GSP_APP_SECRET: string;

  @IsString()
  @IsOptional()
  GSP_AUTH_TOKEN?: string;

  @IsString()
  @IsOptional()
  GSP_CLIENT_ID?: string;

  @IsString()
  @IsOptional()
  GSP_CLIENT_SECRET?: string;

  @IsString()
  @IsOptional()
  GSP_API_VERSION?: string;

  // E-Invoice Configuration
  @IsString()
  @IsOptional()
  IRP_BASE_URL?: string;

  @IsString()
  @IsOptional()
  IRP_VERSION?: string;

  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  @IsOptional()
  EINVOICE_ENABLED?: boolean;

  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  @IsOptional()
  EINVOICE_AUTO_GENERATE?: boolean;

  @IsNumber()
  @Transform(({ value }) => parseInt(value, 10))
  @IsOptional()
  EINVOICE_TIMEOUT_MS?: number;

  @IsNumber()
  @Transform(({ value }) => parseInt(value, 10))
  @IsOptional()
  EINVOICE_MAX_RETRIES?: number;

  @IsNumber()
  @Transform(({ value }) => parseInt(value, 10))
  @IsOptional()
  EINVOICE_RETRY_DELAY_MS?: number;

  // E-Waybill Configuration
  @IsString()
  @IsOptional()
  EWB_BASE_URL?: string;

  @IsString()
  @IsOptional()
  EWB_VERSION?: string;

  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  @IsOptional()
  EWAYBILL_ENABLED?: boolean;

  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  @IsOptional()
  EWAYBILL_AUTO_GENERATE?: boolean;

  @IsNumber()
  @Transform(({ value }) => parseInt(value, 10))
  @IsOptional()
  EWAYBILL_TIMEOUT_MS?: number;

  @IsNumber()
  @Transform(({ value }) => parseInt(value, 10))
  @IsOptional()
  EWAYBILL_MAX_RETRIES?: number;

  @IsNumber()
  @Transform(({ value }) => parseInt(value, 10))
  @IsOptional()
  EWAYBILL_RETRY_DELAY_MS?: number;

  // Security
  @IsString()
  JWT_SECRET: string;

  @IsString()
  @IsOptional()
  JWT_EXPIRATION?: string;

  @IsString()
  @IsOptional()
  JWT_REFRESH_EXPIRATION?: string;

  @IsString()
  @IsOptional()
  ENCRYPTION_KEY?: string;

  @IsString()
  @IsOptional()
  ENCRYPTION_ALGORITHM?: string;

  // Redis Configuration
  @IsString()
  @IsOptional()
  REDIS_HOST?: string;

  @IsNumber()
  @Transform(({ value }) => parseInt(value, 10))
  @IsOptional()
  REDIS_PORT?: number;

  @IsString()
  @IsOptional()
  REDIS_PASSWORD?: string;

  @IsNumber()
  @Transform(({ value }) => parseInt(value, 10))
  @IsOptional()
  REDIS_DB?: number;

  @IsNumber()
  @Transform(({ value }) => parseInt(value, 10))
  @IsOptional()
  REDIS_CACHE_TTL?: number;

  // Queue Configuration
  @IsEnum(QueueProvider)
  @IsOptional()
  QUEUE_PROVIDER?: QueueProvider;

  @IsNumber()
  @Transform(({ value }) => parseInt(value, 10))
  @IsOptional()
  QUEUE_CONCURRENCY?: number;

  @IsNumber()
  @Transform(({ value }) => parseInt(value, 10))
  @IsOptional()
  QUEUE_MAX_RETRY_ATTEMPTS?: number;

  @IsNumber()
  @Transform(({ value }) => parseInt(value, 10))
  @IsOptional()
  QUEUE_RETRY_DELAY_MS?: number;

  // Logging
  @IsString()
  @IsOptional()
  LOG_LEVEL?: string;

  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  @IsOptional()
  LOG_FILE_ENABLED?: boolean;

  @IsString()
  @IsOptional()
  LOG_FILE_PATH?: string;

  // Storage
  @IsEnum(StorageType)
  @IsOptional()
  STORAGE_TYPE?: StorageType;

  @IsString()
  @IsOptional()
  STORAGE_PATH?: string;

  // AWS S3
  @IsString()
  @IsOptional()
  AWS_ACCESS_KEY_ID?: string;

  @IsString()
  @IsOptional()
  AWS_SECRET_ACCESS_KEY?: string;

  @IsString()
  @IsOptional()
  AWS_REGION?: string;

  @IsString()
  @IsOptional()
  S3_BUCKET_NAME?: string;

  // PDF Generation
  @IsEnum(PdfEngine)
  @IsOptional()
  PDF_ENGINE?: PdfEngine;

  @IsNumber()
  @Transform(({ value }) => parseInt(value, 10))
  @IsOptional()
  PDF_TIMEOUT_MS?: number;

  @IsNumber()
  @Transform(({ value }) => parseInt(value, 10))
  @IsOptional()
  PDF_CONCURRENT_LIMIT?: number;

  // Multi-tenancy
  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  @IsOptional()
  MULTI_TENANT_ENABLED?: boolean;

  @IsString()
  @IsOptional()
  DEFAULT_TENANT_ID?: string;

  @IsString()
  @IsOptional()
  TENANT_ISOLATION_LEVEL?: string;

  // Feature Flags
  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  @IsOptional()
  FEATURE_BULK_OPERATIONS?: boolean;

  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  @IsOptional()
  FEATURE_ADVANCED_ANALYTICS?: boolean;

  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  @IsOptional()
  FEATURE_CUSTOM_TEMPLATES?: boolean;

  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  @IsOptional()
  FEATURE_API_WEBHOOKS?: boolean;

  // Development
  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  @IsOptional()
  DEBUG_MODE?: boolean;

  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  @IsOptional()
  SWAGGER_ENABLED?: boolean;

  @IsString()
  @IsOptional()
  SWAGGER_PATH?: string;

  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  @IsOptional()
  CORS_ENABLED?: boolean;

  @IsString()
  @IsOptional()
  CORS_ORIGIN?: string;
}

@Injectable()
export class ConfigurationService {
  private readonly envConfig: EnvironmentVariables;

  constructor(private readonly nestConfigService: NestConfigService) {
    const config = plainToClass(EnvironmentVariables, process.env, {
      enableImplicitConversion: true,
    });

    const errors = validateSync(config, {
      skipMissingProperties: false,
      whitelist: true,
      forbidNonWhitelisted: true,
    });

    if (errors.length > 0) {
      throw new Error(`Configuration validation failed: ${errors.toString()}`);
    }

    this.envConfig = config;
  }

  // Environment
  get environment(): Environment {
    return this.envConfig.NODE_ENV;
  }

  get isDevelopment(): boolean {
    return this.environment === Environment.DEVELOPMENT;
  }

  get isProduction(): boolean {
    return this.environment === Environment.PRODUCTION;
  }

  get isStaging(): boolean {
    return this.environment === Environment.STAGING;
  }

  // Server
  get port(): number {
    return this.envConfig.PORT;
  }

  get host(): string {
    return this.envConfig.HOST;
  }

  // Database
  get databaseUrl(): string {
    return this.envConfig.DATABASE_URL;
  }

  get databaseSchema(): string {
    return this.envConfig.DATABASE_SCHEMA || 'public';
  }

  // GSP Configuration
  get gspConfig() {
    return {
      baseUrl: this.envConfig.GSP_BASE_URL,
      appKey: this.envConfig.GSP_APP_KEY,
      appSecret: this.envConfig.GSP_APP_SECRET,
      authToken: this.envConfig.GSP_AUTH_TOKEN,
      clientId: this.envConfig.GSP_CLIENT_ID,
      clientSecret: this.envConfig.GSP_CLIENT_SECRET,
      apiVersion: this.envConfig.GSP_API_VERSION || '1.1',
    };
  }

  // E-Invoice Configuration
  get eInvoiceConfig() {
    return {
      enabled: this.envConfig.EINVOICE_ENABLED ?? true,
      autoGenerate: this.envConfig.EINVOICE_AUTO_GENERATE ?? false,
      timeout: this.envConfig.EINVOICE_TIMEOUT_MS ?? 30000,
      maxRetries: this.envConfig.EINVOICE_MAX_RETRIES ?? 3,
      retryDelay: this.envConfig.EINVOICE_RETRY_DELAY_MS ?? 1000,
      irpBaseUrl: this.envConfig.IRP_BASE_URL ?? 'https://api.einvoice.gov.in',
      irpVersion: this.envConfig.IRP_VERSION ?? '1.03',
    };
  }

  // E-Waybill Configuration
  get eWaybillConfig() {
    return {
      enabled: this.envConfig.EWAYBILL_ENABLED ?? true,
      autoGenerate: this.envConfig.EWAYBILL_AUTO_GENERATE ?? false,
      timeout: this.envConfig.EWAYBILL_TIMEOUT_MS ?? 30000,
      maxRetries: this.envConfig.EWAYBILL_MAX_RETRIES ?? 3,
      retryDelay: this.envConfig.EWAYBILL_RETRY_DELAY_MS ?? 1000,
      ewbBaseUrl: this.envConfig.EWB_BASE_URL ?? 'https://api.ewaybill.gov.in',
      ewbVersion: this.envConfig.EWB_VERSION ?? '1.03',
    };
  }

  // Security
  get jwtConfig() {
    return {
      secret: this.envConfig.JWT_SECRET,
      expiration: this.envConfig.JWT_EXPIRATION ?? '24h',
      refreshExpiration: this.envConfig.JWT_REFRESH_EXPIRATION ?? '7d',
    };
  }

  get encryptionConfig() {
    return {
      key: this.envConfig.ENCRYPTION_KEY,
      algorithm: this.envConfig.ENCRYPTION_ALGORITHM ?? 'aes-256-gcm',
    };
  }

  // Redis Configuration
  get redisConfig() {
    return {
      host: this.envConfig.REDIS_HOST ?? 'localhost',
      port: this.envConfig.REDIS_PORT ?? 6379,
      password: this.envConfig.REDIS_PASSWORD,
      db: this.envConfig.REDIS_DB ?? 0,
      cacheTtl: this.envConfig.REDIS_CACHE_TTL ?? 3600,
    };
  }

  // Queue Configuration
  get queueConfig() {
    return {
      provider: this.envConfig.QUEUE_PROVIDER ?? QueueProvider.BULLMQ,
      concurrency: this.envConfig.QUEUE_CONCURRENCY ?? 5,
      maxRetryAttempts: this.envConfig.QUEUE_MAX_RETRY_ATTEMPTS ?? 3,
      retryDelay: this.envConfig.QUEUE_RETRY_DELAY_MS ?? 60000,
    };
  }

  // Storage Configuration
  get storageConfig() {
    return {
      type: this.envConfig.STORAGE_TYPE ?? StorageType.LOCAL,
      path: this.envConfig.STORAGE_PATH ?? './uploads',
      aws: {
        accessKeyId: this.envConfig.AWS_ACCESS_KEY_ID,
        secretAccessKey: this.envConfig.AWS_SECRET_ACCESS_KEY,
        region: this.envConfig.AWS_REGION ?? 'us-east-1',
        bucketName: this.envConfig.S3_BUCKET_NAME,
      },
    };
  }

  // PDF Configuration
  get pdfConfig() {
    return {
      engine: this.envConfig.PDF_ENGINE ?? PdfEngine.PUPPETEER,
      timeout: this.envConfig.PDF_TIMEOUT_MS ?? 30000,
      concurrentLimit: this.envConfig.PDF_CONCURRENT_LIMIT ?? 5,
    };
  }

  // Multi-tenancy Configuration
  get multiTenantConfig() {
    return {
      enabled: this.envConfig.MULTI_TENANT_ENABLED ?? true,
      defaultTenantId: this.envConfig.DEFAULT_TENANT_ID ?? 'default',
      isolationLevel: this.envConfig.TENANT_ISOLATION_LEVEL ?? 'row',
    };
  }

  // Feature Flags
  get featureFlags() {
    return {
      bulkOperations: this.envConfig.FEATURE_BULK_OPERATIONS ?? true,
      advancedAnalytics: this.envConfig.FEATURE_ADVANCED_ANALYTICS ?? true,
      customTemplates: this.envConfig.FEATURE_CUSTOM_TEMPLATES ?? true,
      apiWebhooks: this.envConfig.FEATURE_API_WEBHOOKS ?? true,
    };
  }

  // Development Configuration
  get devConfig() {
    return {
      debugMode: this.envConfig.DEBUG_MODE ?? false,
      swaggerEnabled: this.envConfig.SWAGGER_ENABLED ?? this.isDevelopment,
      swaggerPath: this.envConfig.SWAGGER_PATH ?? '/api/docs',
      corsEnabled: this.envConfig.CORS_ENABLED ?? true,
      corsOrigin: this.envConfig.CORS_ORIGIN?.split(',') ?? ['http://localhost:3000'],
    };
  }

  // Helper method to get any configuration value
  get<T = any>(key: string, defaultValue?: T): T {
    return this.nestConfigService.get<T>(key, defaultValue);
  }

  // Helper method to check if a feature is enabled
  isFeatureEnabled(featureName: string): boolean {
    const value = this.get<string>(`FEATURE_${featureName.toUpperCase()}`);
    return value === 'true';
  }

  // Get all configuration as an object (for debugging)
  getAllConfig(): Record<string, any> {
    return {
      environment: this.environment,
      server: {
        port: this.port,
        host: this.host,
      },
      database: {
        url: this.databaseUrl,
        schema: this.databaseSchema,
      },
      gsp: this.gspConfig,
      eInvoice: this.eInvoiceConfig,
      eWaybill: this.eWaybillConfig,
      security: {
        jwt: this.jwtConfig,
        encryption: this.encryptionConfig,
      },
      redis: this.redisConfig,
      queue: this.queueConfig,
      storage: this.storageConfig,
      pdf: this.pdfConfig,
      multiTenant: this.multiTenantConfig,
      features: this.featureFlags,
      development: this.devConfig,
    };
  }
}