import { Module } from '@nestjs/common';
import { HttpModule } from "@nestjs/axios";

import { EncryptionModule } from "../modules/encryption";
import { CardService } from './card/card.service';
import { RequestService } from "../request/request.service";
import { ReceiptService } from './receipt/receipt.service';
import { CardController } from "./card/card.controller";
import { ReceiptController } from "./receipt/receipt.controller";

@Module({
  imports: [HttpModule, EncryptionModule],
  controllers: [CardController, ReceiptController],
  providers: [CardService, RequestService, ReceiptService],
  exports: [CardService, ReceiptService]
})
export class SubscriptionModule {}
