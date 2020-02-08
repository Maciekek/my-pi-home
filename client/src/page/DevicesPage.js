import React from 'react';
import {Page} from '../components/page';
import _ from 'lodash';

import {connect} from "react-redux";
import {speedChartDataLoader} from "../dataLoaders/speedChartDataLoader";
import {SpeedChart} from "../components/charts/SpeedChart";
import {WidgetDataLoader} from "../components/widgetDataLoader";
import {CustomModal} from "../components/modal";
import {AddWidget} from "../components/addWidget/addWidget";
import {getDashboardByLocationIdFront} from "../store/actions/DashboardActions";
import {TempChartWidget} from "../components/charts/TempChartWidget";
import {getLocationSettings} from "../store/actions/LocationsActions";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlusCircle} from '@fortawesome/free-solid-svg-icons'
import {Widget} from "../components/widget";
import {faToggleOn} from "@fortawesome/free-solid-svg-icons/faToggleOn";
import {Link} from "react-router-dom";
import {getDevicesByLocationId} from "../store/actions/DevicesActions";
import {RelayDeviceController} from "../components/devices/relayDevice";



class DevicesPageBase extends React.Component {
  state = {
    isModalOpen: false,
    editWidgetIndex: null
  };

  constructor(props) {
    super(props);
    props.dispatch(getDevicesByLocationId(props.match.params.id))

  }

  render() {
    return (
     <Page>
       <div className={'devices'}>
         <div className={'centered'}>Devices beta.</div>
         <div className={'devices__settings'}>
           <div className={'devices__settings--action'}>
             <Link to={`/${this.props.match.params.id}/devices/new`}> <FontAwesomeIcon icon={faPlusCircle}/>
               Dodaj nowe urządzenie
             </Link>
           </div>
         </div>

         <div className={'device'}>



           {this.props.devices
             ? this.props.devices.map(device => {
                return <RelayDeviceController device={device}/>
              })
             : <div className={'centered'}>Nie masz żadnego urządzenia</div>
           }


         </div>

       </div>

     </Page>
    )
  }
}

const getDevicesForLocation = (state, props) => {
  return state.devicesReducer.devices[props.match.params.id];
};

const mapStateToProps = (state, props) => {
  return {
    devices: getDevicesForLocation(state, props)
  }
};

export const DevicesPage = connect(mapStateToProps)(DevicesPageBase);
