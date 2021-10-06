import React from 'react';
import classNames from 'classnames';
import { useSelector } from 'react-redux';

const WebsocketIndicator = () => {
  const isWebsocketActive = useSelector((state) => {
    return state.settingsReducer.websocketActive;
  });

  return (
    <div className={'websocket-indicator-wrapper'}>
      <span className={'websocket-indicator__description'}>Websocket status:</span>
      <div className={classNames('websocket-indicator', { 'websocket-indicator--active': isWebsocketActive })} />
    </div>
  );
};

export { WebsocketIndicator };
