import { Logger } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

const websocketRPIConnections = {};

@WebSocketGateway({
  cors: { credentials: true, origin: 'https://temperaturki.bieda.it/' },
  allowEIO3: true,
})
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;
  pendingActions = {};

  private readonly logger = new Logger(EventsGateway.name);

  constructor() {
    setInterval(() => {
      if (this.server && this.server.emit) {
        this.server.emit('ping');
      }
    }, 1000);
  }

  handleConnection(client): void {
    if (client.handshake.query && client.handshake.query.device === 'rpi') {
      this.logger.log(`new RPI connected, websocketID: ${client.id}`);
      websocketRPIConnections[client.id] = client.handshake.query.locationId;
      this.server.emit('message', {
        event_type: 'new_rpi_connection',
        name: client.handshake.query.name,
        locationId: client.handshake.query.locationId,
      });
      this.server.emit('message', { event_type: 'active_rpi_connection', websocketRPIConnections });
    }
    setTimeout(() => {
      this.server.emit('message', { event_type: 'active_rpi_connection', websocketRPIConnections });
    }, 3000);

    this.logger.log(`have new connection from: ${client.id}`);
  }

  handleDisconnect(client): any {
    if (websocketRPIConnections[client.id]) {
      this.server.emit('message', { event_type: 'some_rpi_disconnected' });
      delete websocketRPIConnections[client.id];
      this.server.emit('message', { event_type: 'active_rpi_connection', websocketRPIConnections });
    }

    this.logger.log(`Disconnected some user: ${client.id}`);
  }

  @SubscribeMessage('finishedAction')
  handleEvent2(socket: any, response: any): void {
    this.logger.log(`Finished action ${JSON.stringify(response)}`);
    this.pendingActions[response.id](response);

    delete this.pendingActions[response.id];
  }

  emit(eventName, message) {
    this.server.emit(eventName, message);

    return new Promise((resolve, reject) => {
      this.pendingActions[message.id] = resolve;
    });
  }
}
