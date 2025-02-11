import { Injectable } from '@nestjs/common';
import { RequestService } from "../../request/request.service";
import { OfdReceipt } from "../../modules/ofd/ofd.receipt";
import { PayComException } from "../exceptions/pay-com.exception";

@Injectable()
export class ReceiptService {
  constructor(private readonly request: RequestService) {}

  public async create(account: any, amount: number, detail?: OfdReceipt) {
    if (detail) {
      detail = {
        ...detail,
        items: detail.items.map(it => ({
          ...it,
          price: it.price * 100,      // convert to UZS
          discount: it.discount * 100 // convert to UZS
        }))
      }
    }

    const { result, error } = await this.request.checkout("receipts.create", {
      amount: amount * 100,
      account: account,
      detail
    });

    if (error) {
      throw new PayComException(error)
    }

    const { receipt } = result;

    return receipt;
  }

  public async pay(receiptId: string, token: string) {
    const { result, error } = await this.request.checkout("receipts.pay", {
      id: receiptId,
      token
    });

    if (error) {
      throw new PayComException(error)
    }

    const { receipt } = result;

    return receipt;
  }
}
