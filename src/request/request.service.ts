import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from "axios";
import { ConfigService } from "@nestjs/config";
import { EncryptionService } from "../modules/encryption";

@Injectable()
export class RequestService {

  private declare axios: AxiosInstance;

  private declare readonly cashId: string;
  private declare readonly key: string;
  private declare readonly secure?: boolean;

  constructor(
    private readonly configService: ConfigService,
    private readonly encryption: EncryptionService
  ) {
    this.cashId = configService.get("PAYME_MERCHANT_ID")!!;
    this.key = configService.get("PAYME_MERCHANT_KEY")!!;
    this.secure = configService.get<boolean>("PAYME_ENCRYPTION_ENABLE");

    const { ...config } = {
      baseURL: configService.get("PAYME_SUBSCRIPTION_API_URL"),
      headers: {
        'X-Auth': this.cashId
      }
    };

    this.axios = axios.create(config);
  }

  public async prepare(method: string, params: any) {
    const { data } = await this.axios.post("/", {
      id: new Date().getTime(),
      method,
      params
    });

    return data
  }

  public async checkout(method: string, params: any) {
    // To store secure format
    const key = this.secure
      ? this.encryption.decrypt(this.key)
      : this.key;

    const { data } = await this.axios.post("/", {
      id: new Date().getTime(),
      method,
      params
    }, {
      headers: {
        'X-Auth': this.cashId.concat(":").concat(key)
      }
    });

    return data;
  }
}
