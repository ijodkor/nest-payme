import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from "class-validator";

export class ReceiptPayDto {
  @ApiProperty()
  @IsNotEmpty()
  declare id: string

  @ApiProperty()
  @IsNotEmpty()
  declare token: string
}
