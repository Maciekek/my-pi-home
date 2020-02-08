const io = require('socket.io-client');
const configEnv = require('config');
import axios from 'axios';

class WebsocketManager {
  constructor() {
    this.socket = null;
  }

  connect() {
    this.socket = io(configEnv.get('api.websocket'));
    this.attachListeners()
  }

  attachListeners() {
    this.socket.on('connect', () => {
      console.log('[websocket] connect!')
    });
    this.socket.on('connect_error', (e) => {
      console.log('[websocket] connect error!')
    });
    this.socket.on('disconnect', () => {
      console.log('[websocket] disconnect!')
    });

    this.socket.on('error', () => {
      console.log('[websocket] socket error!')
    });

    this.socket.on('message', (message) => {
      console.log(message);
      console.log(`[websocket] received some message type: ${message.event_type}`)
    });

    this.socket.on('action', (actionMessage) => {
      console.log("DO SOME ACTION ", actionMessage);

      axios.get(actionMessage.url).then((response) => {
        console.log(response)
      })

      console.log(`[websocket] received some message type: ${actionMessage}`)
    });

    this.socket.on('ping', () => {
      console.log('[websocket] event ping!')
    });

  }
}

const websocketManager = new WebsocketManager();
module.exports = websocketManager;
