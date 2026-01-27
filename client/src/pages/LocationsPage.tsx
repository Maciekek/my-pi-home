import classNames from 'classnames';
import { Page } from 'components/page';
import { Icon } from 'components/uiComponents/Icon';
import { isArray } from 'lodash';
import { FixMeLater, IAppStore } from 'models/common';
import React from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { LocationsService } from 'services/locations.services';

interface ILocationsPageState {
  locations: {}[] | null;
}

interface ILocationsPageProps {
  readonly activeWebsocketConnections: FixMeLater;
}

class LocationsPage extends React.Component<ILocationsPageProps, ILocationsPageState> {
  state = {
    locations: [],
  };

  constructor(props: ILocationsPageProps) {
    super(props);
    this.load();
  }

  load = () => {
    LocationsService.getAllLocations().then((locations) => {
      console.log(33, typeof locations.data === 'object');

      if (isArray(locations.data)) {
        this.setState({
          locations: locations.data,
        });
      }
    });
  };

  isWSActive = (locationId: string) => {
    const locations = Object.values(this.props.activeWebsocketConnections);
    return locations.indexOf(locationId) > -1;
  };

  deleteLocation = (location: FixMeLater) => {
    const locationNameConfirmation = prompt(
      'Aby potwierdzić, że na pewno chcesz usunąć tą lokalizacjie, wpisz poniżej jej nazwę:',
    );

    if (location.name === locationNameConfirmation) {
      LocationsService.deleteLocation(location._id).then(() => {
        this.load();
        alert('Lokalizacja zostanie usunięta.');
      });
    } else {
      alert('Niepoprawna nazwa lokalizacji.');
    }
  };

  render() {
    return (
      <Page>
        {!this.state.locations ? (
          'loading'
        ) : (
          <ListGroup as="ul">
            {(this.state.locations as []).map((location: FixMeLater, index: number) => {
              return (
                <ListGroup.Item
                  as="li"
                  action
                  key={location._id}
                  className={classNames('list-group-item d-flex justify-content-between align-items-center', {
                    'websocket--active': this.isWSActive(location._id),
                  })}
                >
                  {' '}
                  <OverlayTrigger
                    overlay={
                      <Tooltip id={`tooltip-top`}>
                        <span className={'location-description'}> {location.description}</span>
                      </Tooltip>
                    }
                  >
                    <Link key={index} to={`/locations/${location._id}`}>
                      <span className={'flex-grow-1'}>
                        <span className={'location-title'}>{location.name}</span>
                        <span className={'location-id'}> {location._id}</span>
                        {this.isWSActive(location._id) ? (
                          <span className={'location-ws'}>Połączenie websocket aktywne</span>
                        ) : null}
                      </span>
                    </Link>
                  </OverlayTrigger>
                  <Icon onClick={() => this.deleteLocation(location)} type={'delete'} />
                </ListGroup.Item>
              );
            })}
          </ListGroup>
        )}
        <hr />
        <Link to={`/location/new`}>
          <Icon type={'add_circle_outline'} />
          Dodaj nową lokalizację
        </Link>
      </Page>
    );
  }
}

const mapStateToProps = (state: IAppStore) => {
  const { activeWebsocketConnections } = state.settingsStore;
  return { activeWebsocketConnections };
};

export default connect(mapStateToProps)(LocationsPage);
