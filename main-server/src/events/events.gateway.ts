import {
  OnGatewayConnection, OnGatewayDisconnect,
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

}
