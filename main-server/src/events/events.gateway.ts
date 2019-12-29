import {
  MessageBody, OnGatewayConnection, OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway()
export class EventsGateway implements  OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor() {
    console.log('hej');
  }

  handleConnection(client): any {
    console.log('have some connection');
    console.log(client.id);
    console.log(this.server.clients());

    setInterval(() => {
      this.server.emit("hej");
    }, 3000);
  }

  handleDisconnect(): any {
    console.log('DIsconnect....');
  }

}
