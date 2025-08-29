import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { AxiosRequestConfig, AxiosResponse } from 'axios';
import { firstValueFrom } from 'rxjs';

export interface GspResponse {
  status: 'success' | 'error';
  data?: any;
  message?: string;
  errorCode?: string;
  timestamp: string;
}

export interface RetryConfig {
  maxRetries?: number;
  retryDelay?: number;
  backoffMultiplier?: number;
  retryOn?: number[];
}

@Injectable()
export class GspClientService {
  private readonly logger = new Logger(GspClientService.name);
  private readonly baseUrl: string;
  private readonly authToken: string;
  private readonly defaultRetryConfig: RetryConfig = {
    maxRetries: 3,
    retryDelay: 1000,
    backoffMultiplier: 2,
    retryOn: [500, 502, 503, 504, 408, 429],
  };

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.baseUrl = this.configService.get<string>('GSP_BASE_URL', 'https://api.gsp-staging.com');
    this.authToken = this.configService.get<string>('GSP_AUTH_TOKEN', '');
  }

  /**
   * POST request with retry logic
   */
  async postWithRetry(
    endpoint: string,
    data: any,
    config?: AxiosRequestConfig,
    retryConfig?: RetryConfig,
  ): Promise<GspResponse> {
    const finalConfig = { ...this.defaultRetryConfig, ...retryConfig };
    let lastError: any;

    for (let attempt = 0; attempt <= finalConfig.maxRetries; attempt++) {
      try {
        const response = await this.makeRequest('POST', endpoint, data, config);
        
        // If we get here, the request was successful
        this.logger.log(`GSP request successful on attempt ${attempt + 1}: ${endpoint}`);
        return this.formatSuccessResponse(response);
      } catch (error) {
        lastError = error;
        
        // Check if we should retry
        if (attempt < finalConfig.maxRetries && this.shouldRetry(error, finalConfig)) {
          const delay = this.calculateDelay(attempt, finalConfig);
          this.logger.warn(
            `GSP request failed on attempt ${attempt + 1}, retrying in ${delay}ms: ${endpoint}`,
            error.message,
          );
          
          await this.sleep(delay);
          continue;
        }
        
        // No more retries or shouldn't retry
        break;
      }
    }

    // All retries exhausted
    this.logger.error(`GSP request failed after ${finalConfig.maxRetries + 1} attempts: ${endpoint}`, lastError);
    return this.formatErrorResponse(lastError);
  }

  /**
   * GET request with retry logic
   */
  async getWithRetry(
    endpoint: string,
    config?: AxiosRequestConfig,
    retryConfig?: RetryConfig,
  ): Promise<GspResponse> {
    const finalConfig = { ...this.defaultRetryConfig, ...retryConfig };
    let lastError: any;

    for (let attempt = 0; attempt <= finalConfig.maxRetries; attempt++) {
      try {
        const response = await this.makeRequest('GET', endpoint, null, config);
        
        this.logger.log(`GSP GET request successful on attempt ${attempt + 1}: ${endpoint}`);
        return this.formatSuccessResponse(response);
      } catch (error) {
        lastError = error;
        
        if (attempt < finalConfig.maxRetries && this.shouldRetry(error, finalConfig)) {
          const delay = this.calculateDelay(attempt, finalConfig);
          this.logger.warn(
            `GSP GET request failed on attempt ${attempt + 1}, retrying in ${delay}ms: ${endpoint}`,
            error.message,
          );
          
          await this.sleep(delay);
          continue;
        }
        
        break;
      }
    }

    this.logger.error(`GSP GET request failed after ${finalConfig.maxRetries + 1} attempts: ${endpoint}`, lastError);
    return this.formatErrorResponse(lastError);
  }

  /**
   * Make the actual HTTP request
   */
  private async makeRequest(
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    endpoint: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const requestConfig: AxiosRequestConfig = {
      ...config,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.authToken}`,
        'User-Agent': 'Inventara-GST-Client/1.0',
        'X-Request-ID': this.generateRequestId(),
        ...config?.headers,
      },
      timeout: 30000, // 30 seconds
    };

    this.logger.debug(`Making ${method} request to: ${url}`);

    switch (method) {
      case 'GET':
        return firstValueFrom(this.httpService.get(url, requestConfig));
      case 'POST':
        return firstValueFrom(this.httpService.post(url, data, requestConfig));
      case 'PUT':
        return firstValueFrom(this.httpService.put(url, data, requestConfig));
      case 'DELETE':
        return firstValueFrom(this.httpService.delete(url, requestConfig));
      default:
        throw new Error(`Unsupported HTTP method: ${method}`);
    }
  }

  /**
   * Check if request should be retried
   */
  private shouldRetry(error: any, config: RetryConfig): boolean {
    // Network errors
    if (error.code === 'ECONNRESET' || error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
      return true;
    }

    // Timeout errors
    if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
      return true;
    }

    // HTTP status codes
    if (error.response?.status && config.retryOn?.includes(error.response.status)) {
      return true;
    }

    // GSP specific error codes that are retryable
    if (error.response?.data?.errorCode) {
      const retryableGspErrors = [
        'SYSTEM_BUSY',
        'TIMEOUT',
        'RATE_LIMIT_EXCEEDED',
        'SERVICE_UNAVAILABLE',
        'INTERNAL_ERROR',
      ];
      
      if (retryableGspErrors.includes(error.response.data.errorCode)) {
        return true;
      }
    }

    return false;
  }

  /**
   * Calculate delay with exponential backoff
   */
  private calculateDelay(attempt: number, config: RetryConfig): number {
    const baseDelay = config.retryDelay || 1000;
    const multiplier = config.backoffMultiplier || 2;
    
    // Add jitter to prevent thundering herd
    const jitter = Math.random() * 0.1 * baseDelay;
    
    return Math.floor(Math.pow(multiplier, attempt) * baseDelay + jitter);
  }

  /**
   * Sleep utility
   */
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Format successful response
   */
  private formatSuccessResponse(response: AxiosResponse): GspResponse {
    return {
      status: 'success',
      data: response.data,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Format error response
   */
  private formatErrorResponse(error: any): GspResponse {
    let message = 'Unknown error occurred';
    let errorCode = 'UNKNOWN_ERROR';

    if (error.response) {
      // HTTP error response
      message = error.response.data?.message || error.response.statusText || message;
      errorCode = error.response.data?.errorCode || `HTTP_${error.response.status}`;
    } else if (error.request) {
      // Network error
      message = 'Network error - unable to reach GSP server';
      errorCode = error.code || 'NETWORK_ERROR';
    } else {
      // Other error
      message = error.message || message;
      errorCode = error.code || 'CLIENT_ERROR';
    }

    return {
      status: 'error',
      message,
      errorCode,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Generate unique request ID for tracking
   */
  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Health check for GSP connectivity
   */
  async healthCheck(): Promise<GspResponse> {
    try {
      return await this.getWithRetry('/health', {}, { maxRetries: 1 });
    } catch (error) {
      return this.formatErrorResponse(error);
    }
  }

  /**
   * Authenticate with GSP (if required)
   */
  async authenticate(credentials: { username: string; password: string; gstin: string }): Promise<GspResponse> {
    try {
      const authPayload = {
        username: credentials.username,
        password: credentials.password,
        gstin: credentials.gstin,
        app_key: this.configService.get<string>('GSP_APP_KEY'),
      };

      return await this.postWithRetry('/auth/token', authPayload, {}, { maxRetries: 1 });
    } catch (error) {
      return this.formatErrorResponse(error);
    }
  }

  /**
   * Refresh auth token
   */
  async refreshToken(refreshToken: string): Promise<GspResponse> {
    try {
      const refreshPayload = {
        refresh_token: refreshToken,
        app_key: this.configService.get<string>('GSP_APP_KEY'),
      };

      return await this.postWithRetry('/auth/refresh', refreshPayload, {}, { maxRetries: 1 });
    } catch (error) {
      return this.formatErrorResponse(error);
    }
  }
}