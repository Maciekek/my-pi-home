import React from 'react';
import { Page } from 'components/page';

import { connect } from 'react-redux';

import { Link } from 'react-router-dom';
import { getDevicesByLocationId } from 'store/actions/DevicesActions';
import { RelayDeviceController } from 'components/devices/relayDevice';
import { Icon } from 'components/uiComponents/Icon';

class DevicesPageBase extends React.Component {
  state = {
    isModalOpen: false,
    editWidgetIndex: null,
  };

  constructor(props) {
    super(props);
    props.dispatch(getDevicesByLocationId(props.match.params.id));
  }

  render() {
    return (
      <Page>
        <div className={'devices'}>
          <div className={'centered'}>Devices beta.</div>
          <div className={'devices__settings'}>
            <div className={'devices__settings--action'}>
              <Link to={`/${this.props.match.params.id}/devices/new`}>
                {' '}
                <Icon type={'add_circle_outline'} />
                Dodaj nowe urządzenie
              </Link>
            </div>
          </div>

          <div className={'devices__list'}>
            {this.props.devices ? (
              this.props.devices.map(device => {
                return (
                  <div className={'device-item'}>
                    <div className={'device-item__header'}>
                      <div className={'device-item__header--left'}></div>
                      <div className={'device-item__header--center'}>{device.name}</div>
                      <div className={'device-item__header--right'}>
                        <Link to={`/${this.props.match.params.id}/devices/${device._id}/edit`}>
                          <Icon icon={'edit'} onClick={this.editWidget} />
                        </Link>
                      </div>
                    </div>
                    <RelayDeviceController device={device} />
                  </div>
                );
              })
            ) : (
              <div className={'centered'}>Nie masz żadnego urządzenia</div>
            )}
          </div>
        </div>
      </Page>
    );
  }
}

const getDevicesForLocation = (state, props) => {
  return state.devicesStore.devices[props.match.params.id];
};

const mapStateToProps = (state, props) => {
  return {
    devices: getDevicesForLocation(state, props),
  };
};

export const DevicesPage = connect(mapStateToProps)(DevicesPageBase);
