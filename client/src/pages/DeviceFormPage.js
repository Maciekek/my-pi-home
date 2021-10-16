import React from 'react';
import { Page } from 'components/page';
import _ from 'lodash';

import { connect } from 'react-redux';
import { getDashboardByLocationIdFront } from 'store/actions/DashboardActions';
import Select from 'react-select';
import Col from 'react-bootstrap/Col';
import { RelayForm } from 'components/deviceTypeForms/RelayForm';
import { getDevicesByLocationId } from 'store/actions/DevicesActions';

const options = [{ value: 'simpleRelay', label: 'Przekaźnik prosty' }];

class DeviceFormPageBase extends React.Component {
  state = {
    isModalOpen: false,
    editWidgetIndex: null,
  };

  constructor(props) {
    super(props);

    this.state = {
      selectedFormType: null,
      isEditMode: this.props.match.url.includes('/edit'),
    };

    console.log(this.props.match);
    console.log(this.state.isEditMode);
    console.log('asd', this.props.deviceToEdit);
    if (this.state.isEditMode && !this.props.deviceToEdit) {
      console.log('laduje');
      props.dispatch(getDevicesByLocationId(props.match.params.id));
    }

    props.dispatch(getDashboardByLocationIdFront(props.match.params.id));
  }

  onSelectChange = e => {
    this.setState({
      selectedFormType: e.value,
    });
  };

  getComponentToRender = componentName => {
    switch (componentName) {
      case 'simpleRelay':
        return RelayForm;
      default:
        return () => {
          return null;
        };
    }
  };

  getWidgetType = () => {
    if (!this.props.deviceToEdit) {
      return {};
    }
    const device = _.find(options, ['value', this.props.deviceToEdit.type]);

    // console.log('qaz', this.state.selectedFormType.value);
    console.log('qaz', device.value);
    if (!_.isEqual(this.state.selectedFormType, device.value)) {
      this.setState({
        selectedFormType: device.value,
      });
      return device;
    }

    return device;
  };

  render() {
    const Component = this.getComponentToRender(this.state.selectedFormType);
    console.log(this.props.deviceToEdit);
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
              onChange={this.onSelectChange}
              options={options}
              isDisabled={this.state.isEditMode}
              value={this.state.isEditMode ? this.getWidgetType() : null}
            />
          </div>

          {this.state.selectedFormType ? (
            <Component locationId={this.props.match.params.id} device={this.props.deviceToEdit} />
          ) : null}
        </Col>
      </Page>
    );
  }
}
const getDeviceById = (state, props) => {
  return _.find(state.devicesStore.devices[props.match.params.id], ['_id', props.match.params.deviceId]);
};

const mapStateToProps = (state, props) => {
  return {
    deviceToEdit: getDeviceById(state, props),
  };
};

export const DeviceFormPage = connect(mapStateToProps)(DeviceFormPageBase);
