import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional } from "class-validator";

export class CardCreateDto {
  @ApiProperty()
  @IsNotEmpty()
  declare number: string

  @ApiProperty()
  @IsNotEmpty()
  declare expire: string

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  save: boolean = false
}
