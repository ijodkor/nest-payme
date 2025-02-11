import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsNumber, IsOptional, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

class Account {

}

class Shipping {
  @ApiProperty()
  @IsOptional()
  declare title: string

  @ApiProperty()
  @IsOptional()
  declare price: number
}

class ReceiptItem {
  @ApiProperty()
  @IsNotEmpty()
  declare title: string

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  declare price: number

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  declare discount: number

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  declare count: number

  @ApiProperty()
  @IsNotEmpty()
  declare code: string

  @ApiProperty()
  @IsNotEmpty()
  declare package_code: string

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  declare vat_percent: number
}

class Detail {
  @ApiProperty()
  @IsNotEmpty()
  declare receipt_type: 0

  @ApiProperty()
  @IsOptional()
  declare shipping?: Shipping

  @ApiProperty({ type: [ReceiptItem] })
  @ValidateNested({ each: true })
  @IsNotEmpty()
  @IsArray()
  @Type(() => ReceiptItem)
  declare items: ReceiptItem[]
}

export class ReceiptCreateDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  declare amount: number

  @ApiProperty()
  @IsNotEmpty()
  declare account: Account

  @ApiProperty()
  @IsOptional()
  detail?: Detail
}
