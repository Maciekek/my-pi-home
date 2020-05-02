import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {RelayService} from "services/deviceServices/relay.service";
import {Switcher} from "components/devices/switcher";

const RelayDeviceController = ({device}) => {
  const [deviceState, setDeviceState]= useState( device.state );


  const onClick = () => {
    RelayService.relayToggle(device._id).then(response => {
      console.log(response);
      setDeviceState(response.data.state);
    });
  };
  console.log(deviceState);
  return (

    <div className={'relay-device-controller'}>
      <Switcher checked={deviceState} onClick={onClick}/>


      <span className={'relay-device-controller__title'}>
        <span className={'relay-device-controller__description'}>Nazwa: </span>
        <span>{device.name}</span>
      </span>

      <span className={'relay-device-controller__state'}>
        <span className={'relay-device-controller__description'}>Prawdopodobny stan: </span>
        <span>{deviceState}</span>
      </span>

      <span className={'relay-device-controller__ip'}>
        <span className={'relay-device-controller__description'}>IP: {device.ip}, GPIO: {device.gpio} </span>
      </span>

    </div>
  )
};

RelayDeviceController.propTypes = {
  device: PropTypes.object,
};


export {RelayDeviceController};
