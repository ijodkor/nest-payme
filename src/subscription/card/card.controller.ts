import { BadRequestException, Body, Controller, HttpException, Post, UseGuards, } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { CardCreateDto } from "../dto/card-create.dto";
import { CardVerifyDto } from "../dto/card-verify.dto";
import { CardService } from "./card.service";
import { RouteGuard } from "../../support/guards/route.guard";

@ApiTags('payment')
@Controller('payment/payme')
@UseGuards(RouteGuard)
export class CardController {
  constructor(private readonly cardService: CardService) {}

  @Post('card/create')
  async cardCreate(@Body() dto: CardCreateDto) {
    try {
      const card = await this.cardService.create(dto);
      const { token } = card;
      const response = await this.cardService.getCode(token);
      if (!response.result.sent) {
        throw new BadRequestException("Not sent");
      }

      return { token }
    } catch (e: any) {
      throw new HttpException(e.message, 400)
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
