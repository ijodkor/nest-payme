import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from "@nestjs/config";
import { createCipheriv, createDecipheriv, randomBytes } from 'crypto';

@Injectable()
export class EncryptionService {
  // AES-256
  private readonly algorithm = 'aes-256-cbc';

  // encryption key
  private readonly key?: any;

  // initialization vector
  private readonly iv = randomBytes(16);

  constructor(private readonly configService: ConfigService) {
    const key = configService.get<any>('APP_KEY');
    const isEnabled = JSON.parse(configService.get<any>('PAYME_ENCRYPTION_ENABLE'));
    if (!isEnabled) {
      this.key = null;
      return;
    }

    if (!key) {
      throw new InternalServerErrorException('APP_KEY is not defined in the environment');
    }

    this.key = Buffer.from(key, 'hex');

    if (this.key.length !== 16) {
      throw new InternalServerErrorException('APP_KEY must be a 32-byte hex string for AES-256-CBC');
    }
  }

  public secret(): string {
    return randomBytes(16).toString("hex")
  }

  encrypt(text: string): string {
    const cipher = createCipheriv(this.algorithm, Buffer.from(this.key), this.iv);
    let encrypted = cipher.update(text, 'utf-8', 'hex');
    encrypted += cipher.final('hex');

    return `${this.iv.toString('hex')}:${encrypted}`;
  }

  decrypt(encryptedText: string): string {
    const [iv, encrypted] = encryptedText.split(':');
    const decipher = createDecipheriv(this.algorithm, Buffer.from(this.key), Buffer.from(iv, 'hex'));

    let decrypted = decipher.update(encrypted, 'hex', 'utf-8');
    decrypted += decipher.final('utf-8');
    return decrypted;
  }
}
