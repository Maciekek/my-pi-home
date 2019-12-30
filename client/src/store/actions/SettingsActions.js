const SettingActions = {
  WEBSOCKET_CONNECTED: "WEBSOCKET_CONNECTED",
  WEBSOCKET_DISCONNECTED: "WEBSOCKET_DISCONNECTED"
};

const websocketConnected = () => {
  return {
    type: SettingActions.WEBSOCKET_CONNECTED,
  }
};

const websocketDisconnected = () => {
  return {
    type: SettingActions.WEBSOCKET_DISCONNECTED,
  }
};

export {
  SettingActions,
  websocketConnected,
  websocketDisconnected
}