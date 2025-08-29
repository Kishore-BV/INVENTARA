import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, Length, Matches, IsEnum } from 'class-validator';

export enum CancelReason {
  DUPLICATE = '1',
  DATA_ENTRY_MISTAKE = '2',
  ORDER_CANCELLED = '3',
  OTHERS = '4',
}

export class CancelIrnDto {
  @ApiProperty({ 
    description: 'IRN to be cancelled',
    example: '01AAAPL1234C1Z5000000000000000000000000000000123456789012345'
  })
  @IsString()
  @IsNotEmpty()
  @Length(64, 64)
  @Matches(/^[A-Z0-9]{64}$/, { message: 'Invalid IRN format' })
  irn: string;

  @ApiProperty({ 
    description: 'GSTIN of the supplier',
    example: '29AAAPL1234C1Z5'
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/, { 
    message: 'Invalid GSTIN format' 
  })
  gstin: string;

  @ApiProperty({ 
    description: 'Reason for cancellation',
    enum: CancelReason,
    example: CancelReason.DATA_ENTRY_MISTAKE
  })
  @IsEnum(CancelReason)
  cancelReason: CancelReason;

  @ApiPropertyOptional({ 
    description: 'Remarks for cancellation',
    example: 'Incorrect tax calculation - reissuing corrected invoice'
  })
  @IsString()
  @Length(1, 100)
  cancelRemarks: string;
}