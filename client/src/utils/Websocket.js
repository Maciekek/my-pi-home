import io from 'socket.io-client';
import {store} from '../index';
import {websocketConnected, websocketDisconnected} from "../store/actions/SettingsActions";
class Websocket {
  socket = {};

  constructor() {}

  connect() {
    this.socket = io('http://77.55.217.143/api');

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

    })
  }
}

const websocket = new Websocket();
export {websocket}