import { WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ListSubscriptionsManager } from '../subscriptions/list.subscriptions.manager';

@WebSocketGateway({cors: true})
export class ListGateway implements OnGatewayConnection, OnGatewayDisconnect {

  @WebSocketServer()
  server: Server;

  constructor(private readonly subscriptionsManager: ListSubscriptionsManager) {}

  handleConnection(client: Socket) {
    const { boardId } = client.handshake.query;
    const boardIdString = Array.isArray(boardId) ? boardId[0] : boardId; // Ensure it's a string
    if (boardIdString) {
      client.join(boardIdString); // Join a room for the specific board
      this.subscriptionsManager.addSubscription(boardIdString, client.id);
    }
  }
  handleDisconnect(client: any) {
    const { boardId } = client.handshake.query;
  const boardIdString = Array.isArray(boardId) ? boardId[0] : boardId; // Ensure it's a string

  if (boardIdString) {
    // Remove the client from the subscription manager
    this.subscriptionsManager.removeSubscription(boardIdString, client.id);

    // Leave the room
    client.leave(boardIdString);
  }
  }

}