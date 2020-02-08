import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {RelayService} from "../../services/deviceServices/relay.service";

const RelayDeviceController = ({device}) => {
  const [deviceState, setDeviceState]= useState( device.state );


  const onClick = () => {
    RelayService.relayToggle(device._id).then(response => {
      console.log(response);
      setDeviceState(response.data.state);
    });
  };

  return (
    <div className={'relay-device-controller'}>
      <span className={'relay-device-controller--title'}>{device.name}</span>
      <span>Stan: {deviceState}</span>
      <button onClick={onClick}>wlacz/wylacz</button>
    </div>
  )
};

RelayDeviceController.propTypes = {
  device: PropTypes.object,
};


export {RelayDeviceController};
