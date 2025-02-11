import { Module } from '@nestjs/common';

import { SubscriptionModule } from './subscription/subscription.module';

@Module({
  imports: [SubscriptionModule],
  providers: []
})
export class PaymeModule {}
