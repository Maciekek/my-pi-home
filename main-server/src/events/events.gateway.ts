import {
  OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import {Logger} from "@nestjs/common";

const websocketRPIConnections = {};

@WebSocketGateway()
export class EventsGateway implements  OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;
  pendingActions = {};

  private readonly logger = new Logger(EventsGateway.name);

  constructor() {
    setInterval(() => {
      if (this.server && this.server.emit) {
        this.server.emit('pin 123 g');
      }
    }, 1000);
  }

  handleConnection(client): void {
    if (client.handshake.query && client.handshake.query.device === 'rpi') {
      this.logger.log(`new RPI connected, websocketID: ${client.id}`);
      websocketRPIConnections[client.id] = client.handshake.query.locationId;
      this.server.emit('message', {event_type: 'new_rpi_connection',
        name: client.handshake.query.name, locationId: client.handshake.query.locationId});
      this.server.emit('message', {event_type: 'active_rpi_connection', websocketRPIConnections});
    }
    setTimeout(() => {
      this.server.emit('message', {event_type: 'active_rpi_connection', websocketRPIConnections});
    }, 3000);

    this.logger.log(`have new connection from: ${client.id}`);
  }

  handleDisconnect(client): any {
    if (websocketRPIConnections[client.id]) {
      this.server.emit('message', {event_type: 'some_rpi_disconnected'});
      delete websocketRPIConnections[client.id];
      this.server.emit('message', {event_type: 'active_rpi_connection', websocketRPIConnections});

    }

    this.logger.log(`Disconnected some user: ${client.id}`);
  }

  @SubscribeMessage('finishedAction')
  handleEvent2(socket: any, response: any): void {
    console.log("finito", response.id);
    // this.resolveCallback('finished!');
  }

  emit(eventName, message) {
    this.server.emit(eventName, message);

    return new Promise((resolve, reject) => {
      // this.resolveCallback = resolve;

      this.pendingActions[message.id] = resolve;
    });
  }

}
