import { DynamicModule, Module, UseGuards } from '@nestjs/common';
import { HttpModule } from "@nestjs/axios";
import { ConfigModule } from "@nestjs/config";
import { ApiExcludeController } from "@nestjs/swagger";

import { EncryptionModule } from "../modules/encryption";
import { CardService } from './card/card.service';
import { RequestService } from "../request/request.service";
import { ReceiptService } from './receipt/receipt.service';
import { CardController } from "./card/card.controller";
import { ReceiptController } from "./receipt/receipt.controller";

import { AUTH_GUARD_OPTIONS, AuthOption } from "../support/config/auth-option.config";
import { ISubscriptionModuleFeatureOptions, ISubscriptionModuleOptions } from "./definitions/subscription.options";
import { BasicAuthGuard } from "../support/guards/basic-auth.guard";

@Module({
  imports: [HttpModule, EncryptionModule, ConfigModule],
  controllers: [CardController, ReceiptController],
  providers: [
    CardService, RequestService, ReceiptService, BasicAuthGuard,
    {
      provide: AUTH_GUARD_OPTIONS,
      useValue: null
    }
  ],
  exports: [CardService, ReceiptService]
})
export class SubscriptionModule {

  static forFeature(options: ISubscriptionModuleFeatureOptions): DynamicModule {
    const decorators = [ApiExcludeController(options.hidden)];
    if (options.options?.auth == AuthOption.BASIC_AUTH) {
      decorators.push(UseGuards(BasicAuthGuard))
    }

    const controllers = [CardController, ReceiptController];

    // Apply decorators
    decorators.map(dec => {
      controllers.map(controller => {
        dec(controller)
      })
    });

    return {
      module: SubscriptionModule,
      imports: [HttpModule, EncryptionModule, ConfigModule],
      controllers: [CardController, ReceiptController],
      providers: [
        CardService, RequestService, ReceiptService, BasicAuthGuard,
        {
          provide: AUTH_GUARD_OPTIONS,
          useValue: options.options
        }
      ],
      exports: [CardService, ReceiptService]
    };
  }

  static registerAsync(options: ISubscriptionModuleOptions): DynamicModule {
    const decorators = [ApiExcludeController(options.hidden)];
    const controllers = [CardController, ReceiptController];

    // Apply decorators
    decorators.map(dec => {
      controllers.map(controller => {
        dec(controller)
      })
    });

    return {
      module: SubscriptionModule,
      imports: [HttpModule, EncryptionModule, ConfigModule],
      controllers: controllers,
      providers: [
        CardService, RequestService, ReceiptService, BasicAuthGuard,
        {
          provide: AUTH_GUARD_OPTIONS,
          useFactory: options.useFactory
        }
      ],
      exports: [CardService, ReceiptService]
    };
  }
}
