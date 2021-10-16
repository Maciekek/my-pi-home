import React, { FC } from 'react';
import classNames from 'classnames';
import { useSelector } from 'react-redux';
import { IAppStore } from 'models/common';

const WebsocketIndicator: FC = () => {
  const isWebsocketActive = useSelector((state: IAppStore) => {
    return state.settingsStore.websocketActive;
  });

  return (
    <div className={'websocket-indicator-wrapper'}>
      <span className={'websocket-indicator__description'}>Websocket status:</span>
      <div className={classNames('websocket-indicator', { 'websocket-indicator--active': isWebsocketActive })} />
    </div>
  );
};

export { WebsocketIndicator };
