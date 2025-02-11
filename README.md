# Payme - Elektron to&#8216;lov tizimi

NestJs ilovalar uchun Payme ETT bilan integratsiyaq qilish uchun kutubxona.

Payment gateway integrator package for NestJs App

### O&#8216;rnatish va sozlash (Installation and setup)

O&#8216;rnatish (installation)

```
npm install payme-integration
```

Muhit o&#8216;zgaruvchilari (Environment variables)

```dotenv
PAYME_SUBSCRIPTION_API_URL=
PAYME_MERCHANT_ID=
PAYME_MERCHANT_KEY=
```

### Foydalanish (Usage)

Namuna (example)
```ts
import { HttpException, Inject, Injectable } from '@nestjs/common';
import { Cache as MCache, CACHE_MANAGER } from "@nestjs/cache-manager";
import { CardService, ReceiptService } from "payme";
import { v4 as uuidV4 } from 'uuid';

import { PaymentTransactionService } from "@/modules/balance/transaction/payment-transaction.service";
import { PreparePaymentDto } from "@/modules/account/dto/payment/prepare-payment.dto";
import { PayPaymentDto } from "@/modules/account/dto/payment/pay-payment.dto";
import { ProductService } from "@/modules/account/services/product.service";

@Injectable()
export class PaymentService {

  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: MCache,
    private readonly transactionService: PaymentTransactionService,
    private readonly receiptService: ReceiptService,
    private readonly cardService: CardService,
  ) {}

  public async prepare(dto: PreparePaymentDto) {
    // Create a token
    const { token } = await this.cardService.create(dto);

    // Get code for verifying
    await this.cardService.getCode(token);

    // Create new receipt (there is account contains only uuid)
    const account = {};
    const receipt = await this.receiptService.create(
      account,
      dto.amount,
      {
        receipt_type: 0,
        items: [
          {
            title: "Xizmat",
            price: dto.amount,
            discount: 0,
            count: 1,
            code: "10305001001000000",
            package_code: "1504169",
            vat_percent: 0
          }
        ]
      }
    );

    // Create transaction
    // ...
    // Store token to cache

    return {
      account,
      amount: receipt.amount
    }
  }

  async pay(dto: PayPaymentDto) {
    // Verify code
    await this.cardService.getCode(dto.code);

    // Get token from cache
    const token: any = "..."

    // Find transaction
    const { receiptId, balanceId } = await this.transactionService.findById(dto.uuid);

    // Verify card
    await this.cardService.verify(token, dto.code);

    // Pay by card
    const receipt = await this.receiptService.pay(receiptId, token);

    // Update transaction status
    await this.transactionService.completed(dto.uuid);

    return receipt;
  }
}

```


## Foydalanilgan manbalar (References)

