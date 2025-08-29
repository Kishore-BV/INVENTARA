import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { 
  IsString, 
  IsNotEmpty, 
  IsOptional, 
  IsNumber, 
  IsArray, 
  ValidateNested, 
  IsDateString,
  Min,
  Max,
  Length,
  Matches,
  ArrayMinSize,
  IsEnum
} from 'class-validator';
import { Type } from 'class-transformer';
import { AddressDto } from './generate-irn.dto';

// Enums for E-Waybill
export enum EwbSupplyType {
  OUTWARD = 'O',
  INWARD = 'I',
}

export enum EwbSubSupplyType {
  SUPPLY = '1',
  IMPORT = '2',
  EXPORT = '3',
  JOB_WORK = '4',
  FOR_OWN_USE = '5',
  JOB_WORK_RETURNS = '6',
  SALES_RETURN = '7',
  OTHERS = '8',
  SKD_CKD_LOTS = '9',
  LINE_SALES = '10',
  RECIPIENT_NOT_KNOWN = '11',
  EXHIBITION_OR_FAIRS = '12',
}

export enum EwbDocumentType {
  TAX_INVOICE = 'INV',
  BILL_OF_SUPPLY = 'BIL',
  BILL_OF_ENTRY = 'BOE',
  CHALLAN = 'CHL',
  CREDIT_NOTE = 'CNT',
  OTHERS = 'OTH',
}

export enum TransportMode {
  ROAD = '1',
  RAIL = '2',
  AIR = '3',
  SHIP = '4',
}

export enum VehicleType {
  REGULAR = 'R',
  ODC = 'O', // Over Dimensional Cargo
}

// E-Waybill Item DTO
export class EwbItemDto {
  @ApiProperty({ description: 'Product name', example: 'Premium Steel Rods' })
  @IsString()
  @IsNotEmpty()
  @Length(1, 100)
  productName: string;

  @ApiPropertyOptional({ description: 'Product description', example: 'Grade A steel rods for construction' })
  @IsOptional()
  @IsString()
  @Length(0, 300)
  productDescription?: string;

  @ApiProperty({ description: 'HSN code', example: '72142090' })
  @IsString()
  @Matches(/^[0-9]{4,8}$/, { message: 'HSN code must be 4-8 digits' })
  hsnCode: string;

  @ApiProperty({ description: 'Quantity', example: 100.00 })
  @IsNumber({ maxDecimalPlaces: 3 })
  @Min(0.001)
  quantity: number;

  @ApiProperty({ description: 'Quantity unit', example: 'KG' })
  @IsString()
  @IsNotEmpty()
  @Length(1, 10)
  quantityUnit: string;

  @ApiPropertyOptional({ description: 'CGST rate', example: 9.00 })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Max(100)
  cgstRate?: number;

  @ApiPropertyOptional({ description: 'SGST rate', example: 9.00 })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Max(100)
  sgstRate?: number;

  @ApiPropertyOptional({ description: 'IGST rate', example: 0 })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Max(100)
  igstRate?: number;

  @ApiPropertyOptional({ description: 'CESS rate', example: 0 })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Max(100)
  cessRate?: number;

  @ApiPropertyOptional({ description: 'CESS non-advolorem rate', example: 0 })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  cessNonAdvolRate?: number;

  @ApiProperty({ description: 'Taxable amount', example: 45000.00 })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  taxableAmount: number;
}

// Main Generate E-Waybill DTO
export class GenerateEwbDto {
  @ApiPropertyOptional({ description: 'Internal invoice ID', example: 'inv_123456789' })
  @IsOptional()
  @IsString()
  invoiceId?: string;

  @ApiPropertyOptional({ 
    description: 'Idempotency key to prevent duplicate submissions',
    example: 'idem_ewb_123456789_20240125'
  })
  @IsOptional()
  @IsString()
  @Length(1, 100)
  idempotencyKey?: string;

  @ApiProperty({ 
    description: 'Supply type',
    enum: EwbSupplyType,
    example: EwbSupplyType.OUTWARD
  })
  @IsEnum(EwbSupplyType)
  supplyType: EwbSupplyType;

  @ApiProperty({ 
    description: 'Sub supply type',
    enum: EwbSubSupplyType,
    example: EwbSubSupplyType.SUPPLY
  })
  @IsEnum(EwbSubSupplyType)
  subSupplyType: EwbSubSupplyType;

  @ApiPropertyOptional({ 
    description: 'Sub supply description',
    example: 'Regular supply of goods'
  })
  @IsOptional()
  @IsString()
  @Length(0, 100)
  subSupplyDescription?: string;

  @ApiProperty({ 
    description: 'Document type',
    enum: EwbDocumentType,
    example: EwbDocumentType.TAX_INVOICE
  })
  @IsEnum(EwbDocumentType)
  documentType: EwbDocumentType;

  @ApiProperty({ description: 'Document number', example: 'INV-2024-000123' })
  @IsString()
  @IsNotEmpty()
  @Length(1, 50)
  documentNumber: string;

  @ApiProperty({ description: 'Document date in YYYY-MM-DD format', example: '2024-01-25' })
  @IsDateString()
  documentDate: string;

  @ApiProperty({ description: 'From GSTIN', example: '29AAAPL1234C1Z5' })
  @IsString()
  @Matches(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/, { 
    message: 'Invalid from GSTIN format' 
  })
  fromGstin: string;

  @ApiProperty({ description: 'From trade name', example: 'Inventara Technologies Pvt Ltd' })
  @IsString()
  @IsNotEmpty()
  @Length(1, 100)
  fromTradeName: string;

  @ApiProperty({ description: 'From address', type: AddressDto })
  @ValidateNested()
  @Type(() => AddressDto)
  fromAddress: AddressDto;

  @ApiProperty({ description: 'From state code', example: '29' })
  @IsString()
  @Matches(/^[0-9]{2}$/, { message: 'From state code must be 2 digits' })
  fromStateCode: string;

  @ApiPropertyOptional({ description: 'To GSTIN', example: '27BBBFG5678D1Z5' })
  @IsOptional()
  @IsString()
  @Matches(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/, { 
    message: 'Invalid to GSTIN format' 
  })
  toGstin?: string;

  @ApiProperty({ description: 'To trade name', example: 'ABC Manufacturing Ltd' })
  @IsString()
  @IsNotEmpty()
  @Length(1, 100)
  toTradeName: string;

  @ApiProperty({ description: 'To address', type: AddressDto })
  @ValidateNested()
  @Type(() => AddressDto)
  toAddress: AddressDto;

  @ApiProperty({ description: 'To state code', example: '06' })
  @IsString()
  @Matches(/^[0-9]{2}$/, { message: 'To state code must be 2 digits' })
  toStateCode: string;

  @ApiProperty({ description: 'Total value before tax', example: 100000.00 })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  totalValue: number;

  @ApiPropertyOptional({ description: 'CGST value', example: 9000.00 })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  cgstValue?: number;

  @ApiPropertyOptional({ description: 'SGST value', example: 9000.00 })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  sgstValue?: number;

  @ApiPropertyOptional({ description: 'IGST value', example: 0 })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  igstValue?: number;

  @ApiPropertyOptional({ description: 'CESS value', example: 0 })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  cessValue?: number;

  @ApiPropertyOptional({ description: 'CESS non-advolorem value', example: 0 })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  cessNonAdvolValue?: number;

  @ApiPropertyOptional({ description: 'Other value', example: 0 })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  otherValue?: number;

  @ApiProperty({ description: 'Total invoice value', example: 118000.00 })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  totalInvoiceValue: number;

  @ApiProperty({ 
    description: 'Transport mode',
    enum: TransportMode,
    example: TransportMode.ROAD
  })
  @IsEnum(TransportMode)
  transportMode: TransportMode;

  @ApiProperty({ description: 'Approximate distance in KM', example: 850 })
  @IsNumber()
  @Min(1)
  @Max(4000)
  transportDistance: number;

  @ApiPropertyOptional({ description: 'Transporter name', example: 'XYZ Logistics Pvt Ltd' })
  @IsOptional()
  @IsString()
  @Length(0, 100)
  transporterName?: string;

  @ApiPropertyOptional({ description: 'Transporter ID (GSTIN)', example: '29XYZAB1234C1Z5' })
  @IsOptional()
  @IsString()
  @Matches(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/, { 
    message: 'Invalid transporter GSTIN format' 
  })
  transporterId?: string;

  @ApiPropertyOptional({ description: 'Transport document number', example: 'LR-2024-00456' })
  @IsOptional()
  @IsString()
  @Length(0, 50)
  transportDocNumber?: string;

  @ApiPropertyOptional({ description: 'Transport document date', example: '2024-01-25' })
  @IsOptional()
  @IsDateString()
  transportDocDate?: string;

  @ApiPropertyOptional({ description: 'Vehicle number', example: 'KA-05-AB-1234' })
  @IsOptional()
  @IsString()
  @Length(0, 20)
  @Matches(/^[A-Z]{2}[0-9]{2}[A-Z]{1,2}[0-9]{4}$/, { 
    message: 'Invalid vehicle number format'
  })
  vehicleNumber?: string;

  @ApiPropertyOptional({ 
    description: 'Vehicle type',
    enum: VehicleType,
    example: VehicleType.REGULAR
  })
  @IsOptional()
  @IsEnum(VehicleType)
  vehicleType?: VehicleType;

  @ApiProperty({ 
    description: 'List of items being transported',
    type: [EwbItemDto],
    minItems: 1
  })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => EwbItemDto)
  items: EwbItemDto[];

  @ApiProperty({ description: 'GSTIN for authentication', example: '29AAAPL1234C1Z5' })
  @IsString()
  @Matches(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/, { 
    message: 'Invalid GSTIN format' 
  })
  gstin: string;
}