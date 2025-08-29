import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, Length, Matches, IsEnum } from 'class-validator';

export enum EwbCancelReasonCode {
  DUPLICATE = '1',
  ORDER_CANCELLED = '2',
  DATA_ENTRY_MISTAKE = '3',
  OTHERS = '4',
}

export class CancelEwbDto {
  @ApiProperty({ 
    description: 'E-waybill number to be cancelled',
    example: '351001234567'
  })
  @IsString()
  @IsNotEmpty()
  @Length(12, 12)
  @Matches(/^[0-9]{12}$/, { message: 'E-waybill number must be 12 digits' })
  ewbNumber: string;

  @ApiProperty({ 
    description: 'GSTIN of the supplier/consigner',
    example: '29AAAPL1234C1Z5'
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/, { 
    message: 'Invalid GSTIN format' 
  })
  gstin: string;

  @ApiProperty({ 
    description: 'Reason code for cancellation',
    enum: EwbCancelReasonCode,
    example: EwbCancelReasonCode.DATA_ENTRY_MISTAKE
  })
  @IsEnum(EwbCancelReasonCode)
  cancelReasonCode: EwbCancelReasonCode;

  @ApiPropertyOptional({ 
    description: 'Remarks for cancellation',
    example: 'Incorrect consignee details - regenerating with correct information'
  })
  @IsString()
  @Length(1, 100)
  cancelRemarks: string;
}