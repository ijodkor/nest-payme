import { Body, Controller, Post, } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { CardCreateDto } from "../dto/card-create.dto";
import { CardVerifyDto } from "../dto/card-verify.dto";
import { CardService } from "./card.service";

@ApiTags('payment')
@Controller('payment/payme')
export class CardController {
  constructor(private readonly cardService: CardService) {}

  @Post('card/create')
  async cardCreate(@Body() dto: CardCreateDto) {
    try {
      const card = await this.cardService.create(dto);
      const { token } = card;
      const response = await this.cardService.getCode(token);
      if (!response.result.sent) {
        throw new Error("Not sent");
      }

      return { token }
    } catch (e: any) {
      return {
        message: e.message
      };
    }
  }

  @Post('card/verify')
  async cardVerify(@Body() dto: CardVerifyDto) {
    try {
      const { result } = await this.cardService.verify(dto.token, dto.code)
      return result;
    } catch (e) {
      return 0;
    }
  }
}
