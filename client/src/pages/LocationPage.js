import _ from 'lodash';

import React from 'react';
import { Page } from 'components/page';
import { LocationsService } from 'services/locations.services';

import { TempChart } from 'components/charts/TempChart';
import { TempsService } from 'services/temps.services';

import { Link } from 'react-router-dom';
import { LoadingIndicator } from 'components/loadingIndicator';
import { connect } from 'react-redux';
import { rootActions } from 'store/root-actions';
import { ActualTemps } from 'components/ActualTemps';
import { AlarmPanel } from 'components/AlarmPanel';
import { ContactSensors } from 'components/ContactSensors';
import { storeLocationRecentlySensors } from 'store/actions/LocationsActions';
import { Icon } from 'components/uiComponents/Icon';

const DEFAULT_N = 100;

class LocationPageBase extends React.Component {
  state = {
    location: null,
    temps: null,
  };

  constructor(props) {
    super(props);

    LocationsService.getLocation(props.match.params.id).then(location => {
      this.setState(
        {
          location: location.data,
        },
        () => {
          if (!this.state.location.tempSettings) {
            this.getTemps(DEFAULT_N * 2);
          } else {
            const sensorsCount = this.state.location.tempSettings.sensors.length;
            this.getTemps(DEFAULT_N * sensorsCount);
          }
        },
      );
    });
  }

  getTemps = n => {
    TempsService.getNLastTemps(this.props.match.params.id, n).then(temps => {
      this.setState(
        {
          temps: temps.data,
        },
        () => {
          this.props.dispatch(
            storeLocationRecentlySensors(
              this.props.match.params.id,
              _.map(_.uniqBy(temps.data, 'sensorId'), 'sensorId'),
            ),
          );
        },
      );
    });
  };

  render() {
    this.props.dispatch(rootActions.testAction());
    if (!this.state.location) {
      return <LoadingIndicator />;
    }

    return (
      <Page>
        <div className={'location'}>
          <div className={'location__panel'}>
            <Link to={`/dashboard/${this.props.match.params.id}`} className="location__panel-link">
              <Icon type={'device_thermostat'} />
              Dashboard
            </Link>
            <Link to={`/${this.props.match.params.id}/devices/`} className="location__panel-link">
              <Icon type={'devices_other'} />
              Urządzenia
            </Link>
            <Link to={`/locations/${this.props.match.params.id}/settings`} className="location__panel-link">
              <Icon type={'settings'} />
              Ustawienia
            </Link>
          </div>

          <div className="location__header">
            <div className="location__title">{this.state.location.name}</div>
          </div>

          <AlarmPanel locationId={this.props.match.params.id} location={this.state.location} />

          <ContactSensors locationId={this.props.match.params.id} location={this.state.location} />

          {this.state.temps ? <ActualTemps temps={this.state.temps} location={this.state.location} /> : null}

          {this.state.temps ? <TempChart temps={this.state.temps} location={this.state.location} /> : null}
        </div>
      </Page>
    );
  }
}

const mapStateToProps = state => {
  console.log('state', state);
  return {
    counter: state.counter,
  };
};

export const LocationPage = connect(mapStateToProps)(LocationPageBase);
