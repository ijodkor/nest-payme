import { Body, Controller, Post, } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { PayComException } from "../exceptions/pay-com.exception";
import { ReceiptPayDto } from "../dto/receipt-pay.dto";
import { ReceiptCreateDto } from "../dto/receipt-create.dto";
import { ReceiptService } from "./receipt.service";

@ApiTags('payment')
@Controller('payment/payme')
export class ReceiptController {
  constructor(private readonly receiptService: ReceiptService) {}

  @Post('prepare')
  async prepare(@Body() dto: ReceiptCreateDto) {
    try {
      const receipt = await this.receiptService.create(
        dto.account,
        dto.amount,
        dto.detail
      );

      return {
        receipt: {
          id: receipt._id,
          amount: receipt.amount
        }
      }
    } catch (e) {
      return { e };
    }
  }

  @Post('pay')
  async pay(@Body() dto: ReceiptPayDto) {
    try {
      const receipt = await this.receiptService.pay(dto.id, dto.token);

      return {
        receipt
      }
    } catch (e: any) {
      if (e instanceof PayComException) {
        return e.error
      }

      return {
        message: e.message
      };
    }
  }
}
