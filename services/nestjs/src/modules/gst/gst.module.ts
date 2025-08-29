import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';

import { GstController } from './gst.controller';
import { EInvoiceService } from './services/einvoice.service';
import { EWaybillService } from './services/ewaybill.service';
import { GspClientService } from '../../common/http/gsp-client.service';

@Module({
  imports: [
    HttpModule.register({
      timeout: 30000, // 30 seconds timeout for GSP APIs
      maxRetries: 3,
      retryDelay: 1000,
    }),
    ConfigModule,
  ],
  controllers: [GstController],
  providers: [
    EInvoiceService,
    EWaybillService,
    GspClientService,
  ],
  exports: [
    EInvoiceService,
    EWaybillService,
    GspClientService,
  ],
})
export class GstModule {}