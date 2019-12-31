import React from 'react';
import {Page} from '../components/page';
import {LocationsService} from "../services/locations.services";
import ListGroup from "react-bootstrap/ListGroup";
import Tooltip from "react-bootstrap/Tooltip";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import {Link} from "react-router-dom";
import {connect} from "react-redux";
import classNames from 'classnames'

class LocationsPage extends React.Component {
  state = {
    locations: null,
  };

   constructor(props) {
    super(props);
    LocationsService.getAllLocations().then((locations) => {
      console.log(locations.data);
      this.setState({
        locations: locations.data
      })
    })
  }

  isWSActive = (locationId) => {
    console.log(this.props.activeWebsocketConnections);
    const locations = Object.values(this.props.activeWebsocketConnections)
    console.log(locations);
    return locations.indexOf(locationId) > -1;
  };

  render() {
    console.log(this.props);
    return (
      <Page>Dostępne lokacje:
        {!this.state.locations
          ? "loading"
          :
          <ListGroup as="ul">
            {this.state.locations.map((location, index) => {
              return (
                <Link key={index} to={`/locations/${location._id}`}>
                  <OverlayTrigger
                    key={location._id}
                    overlay={
                      <Tooltip id={`tooltip-top`}>
                        <span className={'location-description'}> {location.description}</span>
                      </Tooltip>
                    }
                  >
                    <ListGroup.Item as="li" action className={classNames({'websocket--active': this.isWSActive(location._id)})}>

                      <span className={'location-title'}>{location.name}</span>
                      <span className={'location-id'}> {location._id}</span>
                      { this.isWSActive(location._id)
                        ? <span className={'location-ws'}>Połączenie websocket aktywne</span>
                        : null}


                    </ListGroup.Item>
                  </OverlayTrigger>
                </Link>

              )
            })}
          </ListGroup>
        }

        <Link to={`/location/new`}>Dodaj nową lokalizację</Link>

      </Page>
    )
  }
}


const mapStateToProps = (state) => {
  console.log(state)
  const { activeWebsocketConnections } = state.settingsReducer;
  return {activeWebsocketConnections};
};


export default connect(mapStateToProps)(LocationsPage)

