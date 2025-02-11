import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from "class-validator";

export class CardVerifyDto {
  @ApiProperty()
  @IsNotEmpty()
  declare token: string

  @ApiProperty()
  @IsNotEmpty()
  declare code: string
}
