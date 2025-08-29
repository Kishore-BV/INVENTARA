import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid';

import { GspClientService } from '../../../common/http/gsp-client.service';
import { GenerateIrnDto } from '../dto/generate-irn.dto';
import { CancelIrnDto } from '../dto/cancel-irn.dto';

export interface IrnSubmission {
  submissionId: string;
  tenantId: string;
  invoiceId: string;
  status: 'QUEUED' | 'SUBMITTED' | 'SUCCESS' | 'FAILED' | 'CANCELLED';
  idempotencyKey: string;
  requestPayload?: any;
  responsePayload?: any;
  irn?: string;
  ackNo?: string;
  ackDate?: string;
  qrCodeData?: string;
  signedQr?: string;
  errorMessage?: string;
  createdAt: Date;
  updatedAt: Date;
  retryCount: number;
  nextRetryAt?: Date;
}

@Injectable()
export class EInvoiceService {
  private readonly logger = new Logger(EInvoiceService.name);
  
  // In-memory storage for demo purposes
  // In production, replace with database (Prisma/TypeORM)
  private submissions: Map<string, IrnSubmission> = new Map();

  constructor(
    private readonly configService: ConfigService,
    private readonly gspClient: GspClientService,
  ) {}

  /**
   * Enqueue IRN generation for async processing
   */
  async enqueueGenerateIrn(
    generateIrnDto: GenerateIrnDto,
    tenantId: string,
  ): Promise<{ submissionId: string; status: string }> {
    const submissionId = `irn_${uuidv4()}`;
    const idempotencyKey = generateIrnDto.idempotencyKey || `idem_${uuidv4()}`;

    // Check for existing submission with same idempotency key
    const existingSubmission = Array.from(this.submissions.values()).find(
      (sub) => sub.idempotencyKey === idempotencyKey && sub.tenantId === tenantId,
    );

    if (existingSubmission) {
      this.logger.log(`Returning existing submission for idempotency key: ${idempotencyKey}`);
      return {
        submissionId: existingSubmission.submissionId,
        status: existingSubmission.status,
      };
    }

    const submission: IrnSubmission = {
      submissionId,
      tenantId,
      invoiceId: generateIrnDto.invoiceId,
      status: 'QUEUED',
      idempotencyKey,
      requestPayload: generateIrnDto,
      createdAt: new Date(),
      updatedAt: new Date(),
      retryCount: 0,
    };

    this.submissions.set(submissionId, submission);

    // In production, add to job queue (BullMQ, Redis, etc.)
    // For demo, we'll process immediately in background
    setImmediate(() => {
      this.processGenerateIrn(submissionId).catch((error) => {
        this.logger.error(`Failed to process IRN generation: ${error.message}`, error.stack);
      });
    });

    this.logger.log(`IRN generation queued with submission ID: ${submissionId}`);
    return { submissionId, status: 'QUEUED' };
  }

  /**
   * Process IRN generation (background job)
   */
  async processGenerateIrn(submissionId: string): Promise<void> {
    const submission = this.submissions.get(submissionId);
    if (!submission) {
      this.logger.error(`Submission not found: ${submissionId}`);
      return;
    }

    try {
      submission.status = 'SUBMITTED';
      submission.updatedAt = new Date();
      this.submissions.set(submissionId, submission);

      this.logger.log(`Processing IRN generation for submission: ${submissionId}`);

      // Map internal invoice data to IRP 1.1 format
      const irpPayload = this.mapToIrpFormat(submission.requestPayload);

      // Call GSP/IRP endpoint
      const response = await this.gspClient.postWithRetry(
        '/einvoice/generate',
        irpPayload,
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
        submission.irn = response.data.Irn;
        submission.ackNo = response.data.AckNo;
        submission.ackDate = response.data.AckDt;
        submission.qrCodeData = response.data.QRCodeUrl;
        submission.signedQr = response.data.SignedQRCode;
        submission.responsePayload = response.data;

        this.logger.log(`IRN generation successful for submission: ${submissionId}`);
      } else {
        throw new Error(response.message || 'IRN generation failed');
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
          `IRN generation failed for submission: ${submissionId}, scheduling retry #${submission.retryCount}`,
        );

        // Schedule retry
        setTimeout(() => {
          this.processGenerateIrn(submissionId).catch((retryError) => {
            this.logger.error(`Retry failed for submission: ${submissionId}`, retryError.stack);
          });
        }, retryDelay);
      } else {
        this.logger.error(`IRN generation permanently failed for submission: ${submissionId}`, error.stack);
      }
    } finally {
      submission.updatedAt = new Date();
      this.submissions.set(submissionId, submission);
    }
  }

  /**
   * Get submission status
   */
  async getSubmissionStatus(submissionId: string, tenantId: string): Promise<IrnSubmission | null> {
    const submission = this.submissions.get(submissionId);
    
    if (!submission || submission.tenantId !== tenantId) {
      return null;
    }

    return submission;
  }

  /**
   * Cancel IRN
   */
  async cancelIrn(
    cancelIrnDto: CancelIrnDto,
    tenantId: string,
  ): Promise<{ submissionId: string; status: string }> {
    const submissionId = `irn_cancel_${uuidv4()}`;

    try {
      const cancelPayload = {
        Irn: cancelIrnDto.irn,
        CnlRsn: cancelIrnDto.cancelReason,
        CnlRem: cancelIrnDto.cancelRemarks,
      };

      const response = await this.gspClient.postWithRetry(
        '/einvoice/cancel',
        cancelPayload,
        {
          headers: {
            'Content-Type': 'application/json',
            'x-gstin': cancelIrnDto.gstin,
            'x-tenant-id': tenantId,
          },
        },
      );

      if (response.status === 'success') {
        this.logger.log(`IRN cancellation successful: ${cancelIrnDto.irn}`);
        return { submissionId, status: 'SUCCESS' };
      } else {
        throw new Error(response.message || 'IRN cancellation failed');
      }
    } catch (error) {
      this.logger.error(`IRN cancellation failed: ${error.message}`, error.stack);
      return { submissionId, status: 'FAILED' };
    }
  }

  /**
   * Map internal invoice format to IRP 1.1 JSON format
   */
  private mapToIrpFormat(invoiceData: any): any {
    // This is a simplified mapping - customize based on your internal data structure
    return {
      Version: '1.1',
      TranDtls: {
        TaxSch: 'GST',
        SupTyp: invoiceData.supplyType || 'B2B',
        RegRev: invoiceData.reverseCharge ? 'Y' : 'N',
        EcmGstin: null,
        IgstOnIntra: invoiceData.igstOnIntra ? 'Y' : 'N',
      },
      DocDtls: {
        Typ: 'INV',
        No: invoiceData.documentNumber,
        Dt: this.formatDate(invoiceData.documentDate),
      },
      SellerDtls: {
        Gstin: invoiceData.seller.gstin,
        LglNm: invoiceData.seller.legalName,
        TrdNm: invoiceData.seller.tradeName,
        Addr1: invoiceData.seller.address.line1,
        Addr2: invoiceData.seller.address.line2,
        Loc: invoiceData.seller.address.city,
        Pin: parseInt(invoiceData.seller.address.pincode),
        Stcd: invoiceData.seller.stateCode,
        Ph: invoiceData.seller.phone,
        Em: invoiceData.seller.email,
      },
      BuyerDtls: {
        Gstin: invoiceData.buyer.gstin,
        LglNm: invoiceData.buyer.legalName,
        TrdNm: invoiceData.buyer.tradeName,
        Pos: invoiceData.placeOfSupply,
        Addr1: invoiceData.buyer.address.line1,
        Addr2: invoiceData.buyer.address.line2,
        Loc: invoiceData.buyer.address.city,
        Pin: parseInt(invoiceData.buyer.address.pincode),
        Stcd: invoiceData.buyer.stateCode,
        Ph: invoiceData.buyer.phone,
        Em: invoiceData.buyer.email,
      },
      ItemList: invoiceData.items.map((item: any, index: number) => ({
        SlNo: String(index + 1),
        PrdDesc: item.description,
        IsServc: item.isService ? 'Y' : 'N',
        HsnCd: item.hsnCode,
        Barcde: item.barcode,
        Qty: item.quantity,
        FreeQty: item.freeQuantity || 0,
        Unit: item.unit,
        UnitPrice: item.unitPrice,
        TotAmt: item.totalAmount,
        Discount: item.discount || 0,
        PreTaxVal: item.preTaxValue,
        AssAmt: item.assessableAmount,
        GstRt: item.gstRate,
        IgstAmt: item.igstAmount || 0,
        CgstAmt: item.cgstAmount || 0,
        SgstAmt: item.sgstAmount || 0,
        CesRt: item.cessRate || 0,
        CesAmt: item.cessAmount || 0,
        CesNonAdvlAmt: item.cessNonAdvoloremAmount || 0,
        StateCesRt: item.stateCessRate || 0,
        StateCesAmt: item.stateCessAmount || 0,
        StateCesNonAdvlAmt: item.stateCessNonAdvoloremAmount || 0,
        OthChrg: item.otherCharges || 0,
        TotItemVal: item.totalItemValue,
        OrdLineRef: item.orderLineReference,
        OrgCntry: item.originCountry || 'IN',
        PrdSlNo: item.productSerialNumber,
        BchDtls: item.batchDetails,
        Attrib: item.attributes,
      })),
      ValDtls: {
        AssVal: invoiceData.totalAssessableValue,
        CgstVal: invoiceData.totalCgstValue || 0,
        SgstVal: invoiceData.totalSgstValue || 0,
        IgstVal: invoiceData.totalIgstValue || 0,
        CesVal: invoiceData.totalCessValue || 0,
        StCesVal: invoiceData.totalStateCessValue || 0,
        Discount: invoiceData.totalDiscount || 0,
        OthChrg: invoiceData.totalOtherCharges || 0,
        RndOffAmt: invoiceData.roundOffAmount || 0,
        TotInvVal: invoiceData.totalInvoiceValue,
        TotInvValFc: invoiceData.totalInvoiceValueForeignCurrency,
      },
      PayDtls: invoiceData.paymentDetails ? {
        Nm: invoiceData.paymentDetails.payeeName,
        Accdet: invoiceData.paymentDetails.accountDetails,
        Mode: invoiceData.paymentDetails.mode,
        Fininsbr: invoiceData.paymentDetails.finInsCode,
        Payterm: invoiceData.paymentDetails.terms,
        Payinstr: invoiceData.paymentDetails.instruction,
        Crtrn: invoiceData.paymentDetails.creditTransfer,
        Dirdr: invoiceData.paymentDetails.directDebit,
        Crday: invoiceData.paymentDetails.creditDays,
        Paidamt: invoiceData.paymentDetails.paidAmount,
        Paymtdue: invoiceData.paymentDetails.paymentDue,
      } : null,
      RefDtls: invoiceData.referenceDetails ? {
        InvRm: invoiceData.referenceDetails.invoiceRemarks,
        DocPerdDtls: {
          InvStDt: this.formatDate(invoiceData.referenceDetails.invoiceStartDate),
          InvEndDt: this.formatDate(invoiceData.referenceDetails.invoiceEndDate),
        },
        PrecDocDtls: invoiceData.referenceDetails.precedingDocuments?.map((doc: any) => ({
          InvNo: doc.invoiceNumber,
          InvDt: this.formatDate(doc.invoiceDate),
          OthRefNo: doc.otherReference,
        })),
        ContrDtls: invoiceData.referenceDetails.contracts?.map((contract: any) => ({
          RecAdvRefr: contract.receiptAdvanceReference,
          RecAdvDt: this.formatDate(contract.receiptAdvanceDate),
          Tendrefr: contract.tenderReference,
          Contrrefr: contract.contractReference,
          Extrefr: contract.externalReference,
          Projrefr: contract.projectReference,
          Porefr: contract.poReference,
          PoRefDt: this.formatDate(contract.poReferenceDate),
        })),
      } : null,
      AddlDocDtls: invoiceData.additionalDocuments?.map((doc: any) => ({
        Url: doc.url,
        Docs: doc.document,
        Info: doc.additionalInfo,
      })),
      ExpDtls: invoiceData.exportDetails ? {
        ShipBNo: invoiceData.exportDetails.shippingBillNumber,
        ShipBDt: this.formatDate(invoiceData.exportDetails.shippingBillDate),
        Port: invoiceData.exportDetails.portCode,
        RefClm: invoiceData.exportDetails.refundClaim,
        ForCur: invoiceData.exportDetails.foreignCurrency,
        CntCode: invoiceData.exportDetails.countryCode,
        ExpDuty: invoiceData.exportDetails.exportDuty,
      } : null,
      EwbDtls: invoiceData.ewaybillDetails ? {
        Transid: invoiceData.ewaybillDetails.transporterId,
        Transname: invoiceData.ewaybillDetails.transporterName,
        Distance: invoiceData.ewaybillDetails.distance,
        Transdocno: invoiceData.ewaybillDetails.transportDocNumber,
        Transdocdt: this.formatDate(invoiceData.ewaybillDetails.transportDocDate),
        Vehno: invoiceData.ewaybillDetails.vehicleNumber,
        Vehtype: invoiceData.ewaybillDetails.vehicleType,
        TransMode: invoiceData.ewaybillDetails.transportMode,
      } : null,
    };
  }

  /**
   * Format date to DD/MM/YYYY format required by IRP
   */
  private formatDate(dateString: string): string {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }
}