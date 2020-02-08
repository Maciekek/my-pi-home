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
import Select from "react-select";
import Modal from "react-bootstrap/Modal";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import {SpeedChartForm} from "../components/addWidget/speedChartForm";
import {LineChartForm} from "../components/addWidget/lineChartForm";
import {RelayForm} from "../components/deviceTypeForms/RelayForm";


const options = [
  {value: 'simpleRelay', label: 'Przekaźnik prosty'},
];


class DeviceFormPageBase extends React.Component {
  state = {
    isModalOpen: false,
    editWidgetIndex: null
  };

  constructor(props) {
    super(props);

    this.state = {
      selectedFormType: null
    }

    props.dispatch(getDashboardByLocationIdFront(props.match.params.id))
  }

  onSelectChange = (e) => {
    this.setState({
      selectedFormType: e.value
    })
  };

  getComponentToRender = (componentName) => {
    switch (componentName) {
      case 'simpleRelay':
        return RelayForm;
      default:
        return () => {return null};
    }
  };


  render() {
    const Component = this.getComponentToRender(this.state.selectedFormType);

    return (
     <Page>
       {/*<Col />*/}
       <Col md={{ span: 6, offset: 3 }}>
       <div className={'device-form'}>
         <h6>Wybierz rodzaj urządzenia:</h6>
         <Select
           className="basic-single"
           classNamePrefix="select"
           isClearable={false}
           name="color"
           isDisabled={false}
           onChange={this.onSelectChange}
           options={options}
         />
       </div>


         {this.state.selectedFormType
           ? <Component
              locationId={this.props.match.params.id}
            />
           : null}
       </Col>
     </Page>
    )
  }
}

const mapStateToProps = (state, props) => {
  return {

  }
};

export const DeviceFormPage = connect(mapStateToProps)(DeviceFormPageBase);
