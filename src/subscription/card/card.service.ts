import { Injectable } from '@nestjs/common';
import { RequestService } from "../../request/request.service";
import { PayComException } from "../exceptions/pay-com.exception";

@Injectable()
export class CardService {
  constructor(private readonly request: RequestService) {}

  public async create({ number, expire, save = false }: any) {
    const { result, error } =  await this.request.prepare("cards.create", {
      card: {
        number,
        expire
      },
      save
    })

    if (error) {
      throw new PayComException(error);
    }

    const { card } = result;

    return card;
  }

  public getCode(token: string) {
    return this.request.prepare("cards.get_verify_code", {
      token
    })
  }

  public verify(token: string, code: string) {
    return this.request.prepare("cards.verify", {
      token,
      code
    })
  }
}
