import { Injectable } from '@nestjs/common';
import { ConfigService } from "@nestjs/config";
import * as crypto from 'crypto';

@Injectable()
export class EncryptionService {
  // AES-256
  private readonly algorithm = 'aes-256-cbc';

  // encryption key
  private readonly key;

  // initialization vector
  private readonly iv = crypto.randomBytes(16);

  constructor(private readonly configService: ConfigService) {
    // configService.get("APP_KEY")
    this.key = Buffer.from(process.env.APP_KEY as string);
  }

  public secret(): string {
    return crypto.randomBytes(16).toString("hex")
  }

  encrypt(text: string): string {
    const cipher = crypto.createCipheriv(this.algorithm, Buffer.from(this.key), this.iv);
    let encrypted = cipher.update(text, 'utf-8', 'hex');
    encrypted += cipher.final('hex');

    return `${this.iv.toString('hex')}:${encrypted}`;
  }

  decrypt(encryptedText: string): string {
    const [iv, encrypted] = encryptedText.split(':');
    const decipher = crypto.createDecipheriv(this.algorithm, Buffer.from(this.key), Buffer.from(iv, 'hex'));

    let decrypted = decipher.update(encrypted, 'hex', 'utf-8');
    decrypted += decipher.final('utf-8');
    return decrypted;
  }
}
