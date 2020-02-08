import React from 'react';
import PropTypes from 'prop-types';
import {RelayService} from "../../services/deviceServices/relay.service";

const RelayDeviceController = ({device}) => {
  const onClick = () => {
    RelayService.relayToggle(device._id);
  };

  return (
    <div className={'relay-device-controller'}>
      <span className={'relay-device-controller--title'}>{device.name}</span>
      <button onClick={onClick}>wlacz/wylacz</button>
    </div>
  )
};

RelayDeviceController.propTypes = {
  device: PropTypes.object,
};


export {RelayDeviceController};
