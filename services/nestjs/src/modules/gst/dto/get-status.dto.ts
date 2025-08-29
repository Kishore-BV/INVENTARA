import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, Length, Matches } from 'class-validator';

export class GetIrnStatusDto {
  @ApiProperty({ 
    description: 'Submission ID for IRN generation',
    example: 'irn_123e4567-e89b-12d3-a456-426614174000'
  })
  @IsString()
  @IsNotEmpty()
  @Length(1, 100)
  submissionId: string;
}

export class GetEwbStatusDto {
  @ApiProperty({ 
    description: 'Submission ID for e-waybill generation',
    example: 'ewb_123e4567-e89b-12d3-a456-426614174000'
  })
  @IsString()
  @IsNotEmpty()
  @Length(1, 100)
  submissionId: string;
}

export class GetIrnByDocumentDto {
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
    description: 'Document number',
    example: 'INV-2024-000123'
  })
  @IsString()
  @IsNotEmpty()
  @Length(1, 50)
  documentNumber: string;

  @ApiProperty({ 
    description: 'Financial year',
    example: '2023-24'
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^[0-9]{4}-[0-9]{2}$/, { message: 'Financial year must be in YYYY-YY format' })
  financialYear: string;
}

export class GetEwbByDocumentDto {
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
    description: 'Document number',
    example: 'INV-2024-000123'
  })
  @IsString()
  @IsNotEmpty()
  @Length(1, 50)
  documentNumber: string;
}