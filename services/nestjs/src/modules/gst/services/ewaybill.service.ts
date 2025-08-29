import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid';

import { GspClientService } from '../../../common/http/gsp-client.service';
import { GenerateEwbDto } from '../dto/generate-ewb.dto';
import { CancelEwbDto } from '../dto/cancel-ewb.dto';

export interface EwbSubmission {
  submissionId: string;
  tenantId: string;
  invoiceId?: string;
  status: 'QUEUED' | 'SUBMITTED' | 'SUCCESS' | 'FAILED' | 'CANCELLED';
  idempotencyKey: string;
  requestPayload?: any;
  responsePayload?: any;
  ewbNumber?: string;
  ewbDate?: string;
  validUpto?: string;
  errorMessage?: string;
  createdAt: Date;
  updatedAt: Date;
  retryCount: number;
  nextRetryAt?: Date;
}

@Injectable()
export class EWaybillService {
  private readonly logger = new Logger(EWaybillService.name);
  
  // In-memory storage for demo purposes
  // In production, replace with database (Prisma/TypeORM)
  private submissions: Map<string, EwbSubmission> = new Map();

  constructor(
    private readonly configService: ConfigService,
    private readonly gspClient: GspClientService,
  ) {}

  /**
   * Enqueue e-waybill generation for async processing
   */
  async enqueueGenerate(
    generateEwbDto: GenerateEwbDto,
    tenantId: string,
  ): Promise<{ submissionId: string; status: string }> {
    const submissionId = `ewb_${uuidv4()}`;
    const idempotencyKey = generateEwbDto.idempotencyKey || `idem_ewb_${uuidv4()}`;

    // Check for existing submission with same idempotency key
    const existingSubmission = Array.from(this.submissions.values()).find(
      (sub) => sub.idempotencyKey === idempotencyKey && sub.tenantId === tenantId,
    );

    if (existingSubmission) {
      this.logger.log(`Returning existing e-waybill submission for idempotency key: ${idempotencyKey}`);
      return {
        submissionId: existingSubmission.submissionId,
        status: existingSubmission.status,
      };
    }

    const submission: EwbSubmission = {
      submissionId,
      tenantId,
      invoiceId: generateEwbDto.invoiceId,
      status: 'QUEUED',
      idempotencyKey,
      requestPayload: generateEwbDto,
      createdAt: new Date(),
      updatedAt: new Date(),
      retryCount: 0,
    };

    this.submissions.set(submissionId, submission);

    // In production, add to job queue (BullMQ, Redis, etc.)
    // For demo, we'll process immediately in background
    setImmediate(() => {
      this.processGenerate(submissionId).catch((error) => {
        this.logger.error(`Failed to process e-waybill generation: ${error.message}`, error.stack);
      });
    });

    this.logger.log(`E-waybill generation queued with submission ID: ${submissionId}`);
    return { submissionId, status: 'QUEUED' };
  }

  /**
   * Process e-waybill generation (background job)
   */
  async processGenerate(submissionId: string): Promise<void> {
    const submission = this.submissions.get(submissionId);
    if (!submission) {
      this.logger.error(`E-waybill submission not found: ${submissionId}`);
      return;
    }

    try {
      submission.status = 'SUBMITTED';
      submission.updatedAt = new Date();
      this.submissions.set(submissionId, submission);

      this.logger.log(`Processing e-waybill generation for submission: ${submissionId}`);

      // Map internal data to e-waybill format
      const ewbPayload = this.mapToEwbFormat(submission.requestPayload);

      // Call GSP e-waybill endpoint
      const response = await this.gspClient.postWithRetry(
        '/ewaybill/generate',
        ewbPayload,
        {
          headers: {
            'Content-Type': 'application/json',
            'x-gstin': submission.requestPayload.gstin,
            'x-tenant-id': submission.tenantId,
          },
        },
      );

      if (response.status === 'success' && response.data) {
        submission.status = 'SUCCESS';
        submission.ewbNumber = response.data.ewayBillNo;
        submission.ewbDate = response.data.ewayBillDate;
        submission.validUpto = response.data.validUpto;
        submission.responsePayload = response.data;

        this.logger.log(`E-waybill generation successful for submission: ${submissionId}`);
      } else {
        throw new Error(response.message || 'E-waybill generation failed');
      }
    } catch (error) {
      submission.status = 'FAILED';
      submission.errorMessage = error.message;
      submission.retryCount += 1;

      // Schedule retry if within limits
      if (submission.retryCount < 3) {
        const retryDelay = Math.pow(2, submission.retryCount) * 60000; // Exponential backoff
        submission.nextRetryAt = new Date(Date.now() + retryDelay);
        submission.status = 'QUEUED'; // Reset to queued for retry

        this.logger.warn(
          `E-waybill generation failed for submission: ${submissionId}, scheduling retry #${submission.retryCount}`,
        );

        // Schedule retry
        setTimeout(() => {
          this.processGenerate(submissionId).catch((retryError) => {
            this.logger.error(`E-waybill retry failed for submission: ${submissionId}`, retryError.stack);
          });
        }, retryDelay);
      } else {
        this.logger.error(
          `E-waybill generation permanently failed for submission: ${submissionId}`,
          error.stack,
        );
      }
    } finally {
      submission.updatedAt = new Date();
      this.submissions.set(submissionId, submission);
    }
  }

  /**
   * Get submission status
   */
  async getSubmissionStatus(submissionId: string, tenantId: string): Promise<EwbSubmission | null> {
    const submission = this.submissions.get(submissionId);
    
    if (!submission || submission.tenantId !== tenantId) {
      return null;
    }

    return submission;
  }

  /**
   * Cancel e-waybill
   */
  async cancelEwaybill(
    cancelEwbDto: CancelEwbDto,
    tenantId: string,
  ): Promise<{ submissionId: string; status: string }> {
    const submissionId = `ewb_cancel_${uuidv4()}`;

    try {
      const cancelPayload = {
        ewbNo: cancelEwbDto.ewbNumber,
        cancelRsnCode: cancelEwbDto.cancelReasonCode,
        cancelRmrk: cancelEwbDto.cancelRemarks,
      };

      const response = await this.gspClient.postWithRetry(
        '/ewaybill/cancel',
        cancelPayload,
        {
          headers: {
            'Content-Type': 'application/json',
            'x-gstin': cancelEwbDto.gstin,
            'x-tenant-id': tenantId,
          },
        },
      );

      if (response.status === 'success') {
        this.logger.log(`E-waybill cancellation successful: ${cancelEwbDto.ewbNumber}`);
        return { submissionId, status: 'SUCCESS' };
      } else {
        throw new Error(response.message || 'E-waybill cancellation failed');
      }
    } catch (error) {
      this.logger.error(`E-waybill cancellation failed: ${error.message}`, error.stack);
      return { submissionId, status: 'FAILED' };
    }
  }

  /**
   * Update transporter details for existing e-waybill
   */
  async updateTransporter(
    ewbNumber: string,
    transporterDetails: any,
    tenantId: string,
  ): Promise<{ submissionId: string; status: string }> {
    const submissionId = `ewb_update_${uuidv4()}`;

    try {
      const updatePayload = {
        ewbNo: ewbNumber,
        fromPlace: transporterDetails.fromPlace,
        fromState: transporterDetails.fromState,
        reasonCode: transporterDetails.reasonCode,
        reasonRem: transporterDetails.reasonRemarks,
        transDocNo: transporterDetails.transportDocNumber,
        transDocDt: this.formatDate(transporterDetails.transportDocDate),
        transMode: transporterDetails.transportMode,
        vehNo: transporterDetails.vehicleNumber,
        vehType: transporterDetails.vehicleType,
      };

      const response = await this.gspClient.postWithRetry(
        '/ewaybill/updateTransporter',
        updatePayload,
        {
          headers: {
            'Content-Type': 'application/json',
            'x-tenant-id': tenantId,
          },
        },
      );

      if (response.status === 'success') {
        this.logger.log(`E-waybill transporter update successful: ${ewbNumber}`);
        return { submissionId, status: 'SUCCESS' };
      } else {
        throw new Error(response.message || 'E-waybill transporter update failed');
      }
    } catch (error) {
      this.logger.error(`E-waybill transporter update failed: ${error.message}`, error.stack);
      return { submissionId, status: 'FAILED' };
    }
  }

  /**
   * Extend validity of e-waybill
   */
  async extendValidity(
    ewbNumber: string,
    extensionDetails: any,
    tenantId: string,
  ): Promise<{ submissionId: string; status: string }> {
    const submissionId = `ewb_extend_${uuidv4()}`;

    try {
      const extendPayload = {
        ewbNo: ewbNumber,
        vehicleNo: extensionDetails.vehicleNumber,
        fromPlace: extensionDetails.fromPlace,
        fromState: extensionDetails.fromStateCode,
        reasonCode: extensionDetails.reasonCode,
        reasonRem: extensionDetails.reasonRemarks,
        transDocNo: extensionDetails.transportDocNumber,
        transDocDt: this.formatDate(extensionDetails.transportDocDate),
        extnRsnCode: extensionDetails.extensionReasonCode,
        extnRem: extensionDetails.extensionRemarks,
        consignmentStatus: extensionDetails.consignmentStatus,
        transitType: extensionDetails.transitType,
        addressLine1: extensionDetails.addressLine1,
        addressLine2: extensionDetails.addressLine2,
        addressLine3: extensionDetails.addressLine3,
        pincode: extensionDetails.pincode,
        remainingDistance: extensionDetails.remainingDistance,
      };

      const response = await this.gspClient.postWithRetry(
        '/ewaybill/extendValidity',
        extendPayload,
        {
          headers: {
            'Content-Type': 'application/json',
            'x-tenant-id': tenantId,
          },
        },
      );

      if (response.status === 'success') {
        this.logger.log(`E-waybill validity extension successful: ${ewbNumber}`);
        return { submissionId, status: 'SUCCESS' };
      } else {
        throw new Error(response.message || 'E-waybill validity extension failed');
      }
    } catch (error) {
      this.logger.error(`E-waybill validity extension failed: ${error.message}`, error.stack);
      return { submissionId, status: 'FAILED' };
    }
  }

  /**
   * Map internal data to e-waybill JSON format
   */
  private mapToEwbFormat(ewbData: any): any {
    return {
      supplyType: ewbData.supplyType, // 'O' for Outward, 'I' for Inward
      subSupplyType: ewbData.subSupplyType, // 1-Supply, 2-Import, 3-Export, etc.
      subSupplyDesc: ewbData.subSupplyDescription,
      docType: ewbData.documentType, // 'INV', 'BIL', 'BOE', 'CHL', 'CNT', 'OTH'
      docNo: ewbData.documentNumber,
      docDt: this.formatDate(ewbData.documentDate),
      fromGstin: ewbData.fromGstin,
      fromTrdName: ewbData.fromTradeName,
      fromAddr1: ewbData.fromAddress.line1,
      fromAddr2: ewbData.fromAddress.line2,
      fromPlace: ewbData.fromAddress.city,
      fromPincode: parseInt(ewbData.fromAddress.pincode),
      fromStateCode: parseInt(ewbData.fromStateCode),
      toGstin: ewbData.toGstin,
      toTrdName: ewbData.toTradeName,
      toAddr1: ewbData.toAddress.line1,
      toAddr2: ewbData.toAddress.line2,
      toPlace: ewbData.toAddress.city,
      toPincode: parseInt(ewbData.toAddress.pincode),
      toStateCode: parseInt(ewbData.toStateCode),
      totalValue: ewbData.totalValue,
      cgstValue: ewbData.cgstValue || 0,
      sgstValue: ewbData.sgstValue || 0,
      igstValue: ewbData.igstValue || 0,
      cessValue: ewbData.cessValue || 0,
      cessNonAdvolValue: ewbData.cessNonAdvolValue || 0,
      otherValue: ewbData.otherValue || 0,
      totInvValue: ewbData.totalInvoiceValue,
      transMode: ewbData.transportMode, // 1-Road, 2-Rail, 3-Air, 4-Ship
      transDistance: ewbData.transportDistance,
      transporterName: ewbData.transporterName,
      transporterId: ewbData.transporterId,
      transDocNo: ewbData.transportDocNumber,
      transDocDt: this.formatDate(ewbData.transportDocDate),
      vehicleNo: ewbData.vehicleNumber,
      vehicleType: ewbData.vehicleType, // 'R' for Regular, 'O' for ODC
      itemList: ewbData.items.map((item: any) => ({
        productName: item.productName,
        productDesc: item.productDescription,
        hsnCode: item.hsnCode,
        quantity: item.quantity,
        qtyUnit: item.quantityUnit,
        cgstRate: item.cgstRate || 0,
        sgstRate: item.sgstRate || 0,
        igstRate: item.igstRate || 0,
        cessRate: item.cessRate || 0,
        cessNonAdvolRate: item.cessNonAdvolRate || 0,
        taxableAmount: item.taxableAmount,
      })),
    };
  }

  /**
   * Format date to DD/MM/YYYY format required by e-waybill API
   */
  private formatDate(dateString: string): string {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }
}