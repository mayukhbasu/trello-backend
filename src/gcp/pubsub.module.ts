// src/gcp/pubsub.module.ts
import { Module } from '@nestjs/common';
import { PubSubService } from './pubsub.service';

@Module({
  providers: [PubSubService],
  exports: [PubSubService], // export so other modules can use it
})
export class PubSubModule {}
