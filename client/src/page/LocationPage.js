import React from 'react';
import {Page} from '../components/page';
import {LocationsService} from "../services/locations.services";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import {TempChart} from "../components/charts/TempChart";
import {TempsService} from "../services/temps.services";
import { faCog } from '@fortawesome/free-solid-svg-icons'

import {Link} from "react-router-dom";
import {LoadingIndicator} from "../components/loadingIndicator";

class LocationPage extends React.Component {
  state = {
    location: null,
    temps: null,
  };

  constructor(props) {
    super(props);
    console.log(props.match.params.id)
    LocationsService.getLocation(props.match.params.id).then((location) => {
      console.log(location.data)
      this.setState({
        location: location.data
      }, this.getTemps)
    })
  }

  getTemps = () => {
    TempsService.getNLastTemps(this.props.match.params.id, 300).then((temps) => {
      this.setState({
        temps: temps.data
      });
    })
  };

  render() {

    if (!this.state.location) {
      return <LoadingIndicator/>;
    }

    return (
      <Page>
          <div className={'location'}>

            <div className={'location__name'}>
            Nazwa lokalizacji:
            <span> {this.state.location.name}</span>
            </div>
          <Link to={`/locations/${this.props.match.params.id}/settings`}>
            <FontAwesomeIcon icon={faCog} />
            Ustawienia</Link>

          {this.state.temps
          ? <TempChart temps={this.state.temps} location={this.state.location}/>
          : null}
        </div>
      </Page>
    )
  }

}

export {LocationPage}