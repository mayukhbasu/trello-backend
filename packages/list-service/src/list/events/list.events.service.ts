import { Injectable } from '@nestjs/common';
import { ListGateway } from './list.gateway';
import { RedisPubSubService } from '../../redis/redis-pubsub.service';

@Injectable()
export class ListEventsService {
  constructor(
    private readonly listGateway: ListGateway,
    private readonly redisPubSubService: RedisPubSubService,
  ) {
    this.redisPubSubService.subscribe('list-updates', (message) => {
      const { boardId, event, data } = JSON.parse(message);
      this.listGateway.emitUpdate(boardId, event, data);
    });
  }

  emitEvent(boardId: string, event: string, data: any): void {
    // Publish to Redis
    this.redisPubSubService.publish('list-updates', { boardId, event, data });
  }
}
