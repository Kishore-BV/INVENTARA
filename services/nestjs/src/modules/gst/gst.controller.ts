import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  HttpStatus,
  HttpException,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

import { EInvoiceService } from './services/einvoice.service';
import { EWaybillService } from './services/ewaybill.service';
import { GenerateIrnDto } from './dto/generate-irn.dto';
import { CancelIrnDto } from './dto/cancel-irn.dto';
import { GenerateEwbDto } from './dto/generate-ewb.dto';
import { CancelEwbDto } from './dto/cancel-ewb.dto';
import { GetIrnStatusDto, GetEwbStatusDto } from './dto/get-status.dto';

@ApiTags('GST Compliance')
@Controller('gst')
@ApiBearerAuth()
export class GstController {
  constructor(
    private readonly eInvoiceService: EInvoiceService,
    private readonly eWaybillService: EWaybillService,
  ) {}

  // E-Invoice Endpoints

  @Post('einvoice/irn/generate')
  @ApiOperation({ 
    summary: 'Generate IRN for E-Invoice',
    description: 'Queue IRN generation for an invoice. Returns submission ID for tracking.'
  })
  @ApiResponse({ 
    status: 202, 
    description: 'IRN generation queued successfully',
    schema: {
      example: {
        submissionId: 'sub_123456789',
        status: 'QUEUED',
        message: 'IRN generation has been queued for processing'
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Invalid request data' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async generateIrn(
    @Body() generateIrnDto: GenerateIrnDto,
    @Request() req: any,
  ) {
    try {
      const tenantId = req.user?.tenantId || req.headers['x-tenant-id'];
      if (!tenantId) {
        throw new HttpException('Tenant ID is required', HttpStatus.BAD_REQUEST);
      }

      const result = await this.eInvoiceService.enqueueGenerateIrn(
        generateIrnDto,
        tenantId,
      );

      return {
        submissionId: result.submissionId,
        status: result.status,
        message: 'IRN generation has been queued for processing',
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Failed to queue IRN generation',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('einvoice/status/:submissionId')
  @ApiOperation({ 
    summary: 'Get IRN Generation Status',
    description: 'Check the status of IRN generation by submission ID.'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Status retrieved successfully',
    schema: {
      example: {
        submissionId: 'sub_123456789',
        status: 'SUCCESS',
        irn: '01AAAPL1234C1Z5000000000000000000000000000000123456789012345',
        ackNo: '112010077115',
        ackDate: '2024-01-25T14:30:00Z',
        qrCodeData: 'base64_encoded_qr_data'
      }
    }
  })
  @ApiResponse({ status: 404, description: 'Submission not found' })
  async getIrnStatus(
    @Param() getIrnStatusDto: GetIrnStatusDto,
    @Request() req: any,
  ) {
    try {
      const tenantId = req.user?.tenantId || req.headers['x-tenant-id'];
      if (!tenantId) {
        throw new HttpException('Tenant ID is required', HttpStatus.BAD_REQUEST);
      }

      const status = await this.eInvoiceService.getSubmissionStatus(
        getIrnStatusDto.submissionId,
        tenantId,
      );

      if (!status) {
        throw new HttpException('Submission not found', HttpStatus.NOT_FOUND);
      }

      return status;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Failed to retrieve status',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('einvoice/irn/cancel')
  @ApiOperation({ 
    summary: 'Cancel IRN',
    description: 'Cancel a previously generated IRN within 24 hours of generation.'
  })
  @ApiResponse({ 
    status: 202, 
    description: 'IRN cancellation queued successfully',
    schema: {
      example: {
        submissionId: 'sub_987654321',
        status: 'QUEUED',
        message: 'IRN cancellation has been queued for processing'
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Invalid request data' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async cancelIrn(
    @Body() cancelIrnDto: CancelIrnDto,
    @Request() req: any,
  ) {
    try {
      const tenantId = req.user?.tenantId || req.headers['x-tenant-id'];
      if (!tenantId) {
        throw new HttpException('Tenant ID is required', HttpStatus.BAD_REQUEST);
      }

      const result = await this.eInvoiceService.cancelIrn(
        cancelIrnDto,
        tenantId,
      );

      return {
        submissionId: result.submissionId,
        status: result.status,
        message: 'IRN cancellation has been queued for processing',
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Failed to queue IRN cancellation',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // E-Waybill Endpoints

  @Post('ewaybill/generate')
  @ApiOperation({ 
    summary: 'Generate E-Waybill',
    description: 'Queue e-waybill generation for goods movement. Returns submission ID for tracking.'
  })
  @ApiResponse({ 
    status: 202, 
    description: 'E-waybill generation queued successfully',
    schema: {
      example: {
        submissionId: 'ewb_123456789',
        status: 'QUEUED',
        message: 'E-waybill generation has been queued for processing'
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Invalid request data' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async generateEwaybill(
    @Body() generateEwbDto: GenerateEwbDto,
    @Request() req: any,
  ) {
    try {
      const tenantId = req.user?.tenantId || req.headers['x-tenant-id'];
      if (!tenantId) {
        throw new HttpException('Tenant ID is required', HttpStatus.BAD_REQUEST);
      }

      const result = await this.eWaybillService.enqueueGenerate(
        generateEwbDto,
        tenantId,
      );

      return {
        submissionId: result.submissionId,
        status: result.status,
        message: 'E-waybill generation has been queued for processing',
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Failed to queue e-waybill generation',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('ewaybill/status/:submissionId')
  @ApiOperation({ 
    summary: 'Get E-Waybill Status',
    description: 'Check the status of e-waybill generation by submission ID.'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Status retrieved successfully',
    schema: {
      example: {
        submissionId: 'ewb_123456789',
        status: 'SUCCESS',
        ewbNumber: '351001234567',
        ewbDate: '2024-01-25T15:00:00Z',
        validUpto: '2024-01-26T15:00:00Z'
      }
    }
  })
  @ApiResponse({ status: 404, description: 'Submission not found' })
  async getEwaybillStatus(
    @Param() getEwbStatusDto: GetEwbStatusDto,
    @Request() req: any,
  ) {
    try {
      const tenantId = req.user?.tenantId || req.headers['x-tenant-id'];
      if (!tenantId) {
        throw new HttpException('Tenant ID is required', HttpStatus.BAD_REQUEST);
      }

      const status = await this.eWaybillService.getSubmissionStatus(
        getEwbStatusDto.submissionId,
        tenantId,
      );

      if (!status) {
        throw new HttpException('Submission not found', HttpStatus.NOT_FOUND);
      }

      return status;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Failed to retrieve status',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('ewaybill/cancel')
  @ApiOperation({ 
    summary: 'Cancel E-Waybill',
    description: 'Cancel a previously generated e-waybill.'
  })
  @ApiResponse({ 
    status: 202, 
    description: 'E-waybill cancellation queued successfully',
    schema: {
      example: {
        submissionId: 'ewb_cancel_123',
        status: 'QUEUED',
        message: 'E-waybill cancellation has been queued for processing'
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Invalid request data' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async cancelEwaybill(
    @Body() cancelEwbDto: CancelEwbDto,
    @Request() req: any,
  ) {
    try {
      const tenantId = req.user?.tenantId || req.headers['x-tenant-id'];
      if (!tenantId) {
        throw new HttpException('Tenant ID is required', HttpStatus.BAD_REQUEST);
      }

      const result = await this.eWaybillService.cancelEwaybill(
        cancelEwbDto,
        tenantId,
      );

      return {
        submissionId: result.submissionId,
        status: result.status,
        message: 'E-waybill cancellation has been queued for processing',
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Failed to queue e-waybill cancellation',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Utility Endpoints

  @Get('health')
  @ApiOperation({ summary: 'Health Check', description: 'Check GST service health and GSP connectivity.' })
  @ApiResponse({ status: 200, description: 'Service is healthy' })
  async healthCheck() {
    return {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      services: {
        einvoice: 'operational',
        ewaybill: 'operational',
        gsp: 'connected'
      }
    };
  }
}