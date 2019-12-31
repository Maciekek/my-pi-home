import io from 'socket.io-client';
import {store} from '../index';
import {websocketConnected, websocketDisconnected} from "../store/actions/SettingsActions";
import { toast } from 'react-toastify';

const WEBSOCKET_MESSAGE_TYPES = {
  NEW_RPI_CONNECTION: 'new_rpi_connection',
  SOME_RPI_DISCONNECTED: 'some_rpi_disconnected'
};

class Websocket {
  socket = {};

  constructor() {}

  connect() {
    this.socket = io('77.55.217.143:8888');

    this.attachListeners()
  }

  attachListeners() {
    this.socket.on('connect', () => {
      console.log(`Websocket connected... with ID: ${this.socket.id}`);
      store.dispatch(websocketConnected());
    });

    this.socket.on('disconnect', () => {
      console.log(`Websocket disconnected... ID: ${this.socket.id}`);
      store.dispatch(websocketDisconnected());

    });

    this.socket.on('message', (message) => {
      console.log(message);

      switch (message.event_type) {
        case WEBSOCKET_MESSAGE_TYPES.NEW_RPI_CONNECTION:
          toast.info(`Nowe połączenie z rpi. Nazwa urządzenia: ${message.name}`);
          break;
        case WEBSOCKET_MESSAGE_TYPES.SOME_RPI_DISCONNECTED:
          toast.info('Utracono połączenie z rpi.');
          break;
        default:
          console.log("Received new websocket message: ", message)
      }
    })
  }
}

const websocket = new Websocket();
export {websocket}