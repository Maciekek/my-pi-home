const SettingActions = {
  WEBSOCKET_CONNECTED: "WEBSOCKET_CONNECTED",
  WEBSOCKET_DISCONNECTED: "WEBSOCKET_DISCONNECTED",
  ACTIVE_WEBSOCKET_CONNECTIONS: "ACTIVE_WEBSOCKET_CONNECTIONS"
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

const updateActiveConections = (payload) => {
  return {
    type: SettingActions.ACTIVE_WEBSOCKET_CONNECTIONS,
    payload
  }
};


export {
  SettingActions,
  websocketConnected,
  websocketDisconnected,
  updateActiveConections
}