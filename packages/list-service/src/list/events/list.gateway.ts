import { WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ cors: true })
export class ListGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket): void {
    const { boardId } = client.handshake.query;
    const boardIdString = Array.isArray(boardId) ? boardId[0] : boardId;
    if (boardIdString) {
      client.join(boardIdString); // Join room for board
    }
    console.log('Client connected:', client.id);
  }

  handleDisconnect(client: Socket): void {
    const { boardId } = client.handshake.query;
    const boardIdString = Array.isArray(boardId) ? boardId[0] : boardId;
    if (boardIdString) {
      client.leave(boardIdString); // Leave room for board
    }
    console.log('Client disconnected:', client.id);
  }

  emitUpdate(boardId: string, event: string, data: any): void {
    this.server.to(boardId).emit(event, data);
  }
}
