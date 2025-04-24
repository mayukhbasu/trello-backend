// src/gcp/pubsub.service.ts
import { Injectable } from '@nestjs/common';
import { PubSub } from '@google-cloud/pubsub';

const pubsub = new PubSub(); // uses GOOGLE_APPLICATION_CREDENTIALS

const topicName = 'url-click-events';

@Injectable()
export class PubSubService {
  async publishClickEvent(data: {
    shortCode: string;
    ip: string;
    userAgent: string;
    timestamp: string;
  }) {
    const buffer = Buffer.from(JSON.stringify(data));
    await pubsub.topic(topicName).publish(buffer);
    console.log('📤 Published click event to Pub/Sub:', data);
  }
}
