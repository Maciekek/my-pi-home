import React from 'react';
import {Page} from '../components/page';
import {LocationsService} from "../services/locations.services";
import ListGroup from "react-bootstrap/ListGroup";
import Tooltip from "react-bootstrap/Tooltip";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import {Link} from "react-router-dom";

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

  render() {
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
                    <ListGroup.Item as="li" action>
                      <span className={'location-title'}>{location.name}</span>
                      <span className={'location-id'}> {location._id}</span>


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

export {LocationsPage}