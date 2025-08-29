import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { 
  IsString, 
  IsNotEmpty, 
  IsOptional, 
  IsEmail, 
  IsNumber, 
  IsArray, 
  ValidateNested, 
  IsBoolean,
  IsDateString,
  Min,
  Max,
  Length,
  Matches,
  ArrayMinSize,
  IsEnum
} from 'class-validator';
import { Type, Transform } from 'class-transformer';

// Enums
export enum SupplyType {
  B2B = 'B2B',
  SEZWP = 'SEZWP',
  SEZWOP = 'SEZWOP',
  EXPWP = 'EXPWP',
  EXPWOP = 'EXPWOP',
  DEXP = 'DEXP',
}

export enum DocumentType {
  INV = 'INV',
  CRN = 'CRN',
  DBN = 'DBN',
}

// Address DTO
export class AddressDto {
  @ApiProperty({ description: 'Address line 1', example: 'No. 123, Technology Park' })
  @IsString()
  @IsNotEmpty()
  @Length(1, 100)
  line1: string;

  @ApiPropertyOptional({ description: 'Address line 2', example: 'Electronic City Phase 1' })
  @IsOptional()
  @IsString()
  @Length(0, 100)
  line2?: string;

  @ApiProperty({ description: 'City', example: 'Bangalore' })
  @IsString()
  @IsNotEmpty()
  @Length(1, 50)
  city: string;

  @ApiProperty({ description: 'State', example: 'Karnataka' })
  @IsString()
  @IsNotEmpty()
  @Length(1, 50)
  state: string;

  @ApiProperty({ description: 'Pincode', example: '560100' })
  @IsString()
  @Matches(/^[0-9]{6}$/, { message: 'Pincode must be a 6-digit number' })
  pincode: string;
}

// Party Details DTO
export class PartyDetailsDto {
  @ApiProperty({ description: 'GSTIN', example: '29AAAPL1234C1Z5' })
  @IsString()
  @IsNotEmpty()
  @Matches(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/, { 
    message: 'Invalid GSTIN format' 
  })\n  gstin: string;

  @ApiProperty({ description: 'Legal name', example: 'Inventara Technologies Pvt Ltd' })
  @IsString()
  @IsNotEmpty()
  @Length(1, 100)
  legalName: string;

  @ApiPropertyOptional({ description: 'Trade name', example: 'Inventara Tech' })
  @IsOptional()
  @IsString()
  @Length(0, 100)
  tradeName?: string;

  @ApiProperty({ description: 'Address details', type: AddressDto })
  @ValidateNested()
  @Type(() => AddressDto)
  address: AddressDto;

  @ApiProperty({ description: 'State code', example: '29' })
  @IsString()
  @Matches(/^[0-9]{2}$/, { message: 'State code must be 2 digits' })
  stateCode: string;

  @ApiPropertyOptional({ description: 'Phone number', example: '+91-80-12345678' })
  @IsOptional()
  @IsString()
  @Length(10, 15)
  phone?: string;

  @ApiPropertyOptional({ description: 'Email address', example: 'billing@inventara.com' })
  @IsOptional()
  @IsEmail()
  email?: string;
}

// Item Details DTO
export class ItemDetailsDto {
  @ApiProperty({ description: 'Item description', example: 'Premium Steel Rods - Grade A' })
  @IsString()
  @IsNotEmpty()
  @Length(1, 300)
  description: string;

  @ApiProperty({ description: 'HSN code', example: '72142090' })
  @IsString()
  @Matches(/^[0-9]{4,8}$/, { message: 'HSN code must be 4-8 digits' })
  hsnCode: string;

  @ApiPropertyOptional({ description: 'SAC code (for services)' })
  @IsOptional()
  @IsString()
  @Matches(/^[0-9]{6}$/, { message: 'SAC code must be 6 digits' })
  sacCode?: string;

  @ApiProperty({ description: 'Quantity', example: 100.00 })
  @IsNumber({ maxDecimalPlaces: 3 })
  @Min(0.001)
  quantity: number;

  @ApiPropertyOptional({ description: 'Free quantity', example: 0 })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 3 })
  @Min(0)
  freeQuantity?: number;

  @ApiProperty({ description: 'Unit of measure', example: 'KG' })
  @IsString()
  @IsNotEmpty()
  @Length(1, 10)
  unit: string;

  @ApiProperty({ description: 'Unit price', example: 450.00 })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  unitPrice: number;

  @ApiProperty({ description: 'Total amount before tax', example: 45000.00 })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  totalAmount: number;

  @ApiPropertyOptional({ description: 'Discount amount', example: 0 })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  discount?: number;

  @ApiProperty({ description: 'Assessable amount (after discount)', example: 45000.00 })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  assessableAmount: number;

  @ApiProperty({ description: 'GST rate percentage', example: 18.00 })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Max(100)
  gstRate: number;

  @ApiPropertyOptional({ description: 'IGST amount', example: 0 })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  igstAmount?: number;

  @ApiPropertyOptional({ description: 'CGST amount', example: 4050.00 })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  cgstAmount?: number;

  @ApiPropertyOptional({ description: 'SGST amount', example: 4050.00 })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  sgstAmount?: number;

  @ApiPropertyOptional({ description: 'CESS rate percentage', example: 0 })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Max(100)
  cessRate?: number;

  @ApiPropertyOptional({ description: 'CESS amount', example: 0 })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  cessAmount?: number;

  @ApiPropertyOptional({ description: 'State CESS amount', example: 0 })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  stateCessAmount?: number;

  @ApiPropertyOptional({ description: 'Other charges', example: 0 })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  otherCharges?: number;

  @ApiProperty({ description: 'Total item value (including all taxes)', example: 53100.00 })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  totalItemValue: number;

  @ApiPropertyOptional({ description: 'Is this a service?', example: false })
  @IsOptional()
  @IsBoolean()
  isService?: boolean;

  @ApiPropertyOptional({ description: 'Product serial number' })
  @IsOptional()
  @IsString()
  @Length(0, 50)
  productSerialNumber?: string;

  @ApiPropertyOptional({ description: 'Batch details' })
  @IsOptional()
  @IsString()
  @Length(0, 100)
  batchDetails?: string;

  @ApiPropertyOptional({ description: 'Order line reference' })
  @IsOptional()
  @IsString()
  @Length(0, 50)
  orderLineReference?: string;

  @ApiPropertyOptional({ description: 'Origin country', example: 'IN' })
  @IsOptional()
  @IsString()
  @Length(2, 2)
  originCountry?: string;
}

// Payment Details DTO
export class PaymentDetailsDto {
  @ApiPropertyOptional({ description: 'Payee name' })
  @IsOptional()
  @IsString()
  @Length(0, 100)
  payeeName?: string;

  @ApiPropertyOptional({ description: 'Account details' })
  @IsOptional()
  @IsString()
  @Length(0, 200)
  accountDetails?: string;

  @ApiPropertyOptional({ description: 'Payment mode' })
  @IsOptional()
  @IsString()
  @Length(0, 50)
  mode?: string;

  @ApiPropertyOptional({ description: 'Payment terms' })
  @IsOptional()
  @IsString()
  @Length(0, 100)
  terms?: string;

  @ApiPropertyOptional({ description: 'Paid amount' })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  paidAmount?: number;

  @ApiPropertyOptional({ description: 'Payment due amount' })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  paymentDue?: number;

  @ApiPropertyOptional({ description: 'Credit days' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  creditDays?: number;
}

// Main Generate IRN DTO
export class GenerateIrnDto {
  @ApiProperty({ description: 'Internal invoice ID', example: 'inv_123456789' })
  @IsString()
  @IsNotEmpty()
  invoiceId: string;

  @ApiPropertyOptional({ 
    description: 'Idempotency key to prevent duplicate submissions',
    example: 'idem_inv_123456789_20240125'
  })
  @IsOptional()
  @IsString()
  @Length(1, 100)
  idempotencyKey?: string;

  @ApiProperty({ 
    description: 'Supply type',
    enum: SupplyType,
    example: SupplyType.B2B
  })
  @IsEnum(SupplyType)
  supplyType: SupplyType;

  @ApiProperty({ 
    description: 'Document type',
    enum: DocumentType,
    example: DocumentType.INV
  })
  @IsEnum(DocumentType)
  documentType: DocumentType;

  @ApiProperty({ description: 'Document number', example: 'INV-2024-000123' })
  @IsString()
  @IsNotEmpty()
  @Length(1, 50)
  documentNumber: string;

  @ApiProperty({ description: 'Document date in YYYY-MM-DD format', example: '2024-01-25' })
  @IsDateString()
  documentDate: string;

  @ApiProperty({ description: 'GSTIN of the supplier', example: '29AAAPL1234C1Z5' })
  @IsString()
  @Matches(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/, { 
    message: 'Invalid GSTIN format' 
  })
  gstin: string;

  @ApiProperty({ description: 'Seller details', type: PartyDetailsDto })
  @ValidateNested()
  @Type(() => PartyDetailsDto)
  seller: PartyDetailsDto;

  @ApiProperty({ description: 'Buyer details', type: PartyDetailsDto })
  @ValidateNested()
  @Type(() => PartyDetailsDto)
  buyer: PartyDetailsDto;

  @ApiProperty({ description: 'Place of supply (state code)', example: '29' })
  @IsString()
  @Matches(/^[0-9]{2}$/, { message: 'Place of supply must be 2-digit state code' })
  placeOfSupply: string;

  @ApiPropertyOptional({ description: 'Reverse charge mechanism applicable', example: false })
  @IsOptional()
  @IsBoolean()
  reverseCharge?: boolean;

  @ApiProperty({ 
    description: 'List of items/services',
    type: [ItemDetailsDto],
    minItems: 1
  })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => ItemDetailsDto)
  items: ItemDetailsDto[];

  @ApiProperty({ description: 'Total assessable value', example: 100000.00 })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  totalAssessableValue: number;

  @ApiPropertyOptional({ description: 'Total CGST value', example: 9000.00 })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  totalCgstValue?: number;

  @ApiPropertyOptional({ description: 'Total SGST value', example: 9000.00 })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  totalSgstValue?: number;

  @ApiPropertyOptional({ description: 'Total IGST value', example: 0 })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  totalIgstValue?: number;

  @ApiPropertyOptional({ description: 'Total CESS value', example: 0 })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  totalCessValue?: number;

  @ApiPropertyOptional({ description: 'Total state CESS value', example: 0 })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  totalStateCessValue?: number;

  @ApiPropertyOptional({ description: 'Total discount', example: 1250.00 })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  totalDiscount?: number;

  @ApiPropertyOptional({ description: 'Total other charges', example: 0 })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  totalOtherCharges?: number;

  @ApiPropertyOptional({ description: 'Round off amount', example: 0 })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  roundOffAmount?: number;

  @ApiProperty({ description: 'Total invoice value', example: 118000.00 })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  totalInvoiceValue: number;

  @ApiPropertyOptional({ description: 'Payment details', type: PaymentDetailsDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => PaymentDetailsDto)
  paymentDetails?: PaymentDetailsDto;

  @ApiPropertyOptional({ description: 'Invoice remarks' })
  @IsOptional()
  @IsString()
  @Length(0, 500)
  invoiceRemarks?: string;
}