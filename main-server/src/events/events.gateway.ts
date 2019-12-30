import {
  OnGatewayConnection, OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import {Logger} from "@nestjs/common";

@WebSocketGateway()
export class EventsGateway implements  OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(EventsGateway.name);

  constructor() {
    setInterval(() => {
      if (this.server && this.server.emit) {
        this.server.emit('ping');
      }
    }, 1000);
  }

  handleConnection(client): void {
    this.logger.log(`have new connection from: ${client.id}`);
  }

  handleDisconnect(client): any {
    this.logger.log(`Disconnected some user: ${client.id}`);
  }

}
