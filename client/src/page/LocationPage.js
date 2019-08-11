import React from 'react';
import {Page} from '../components/page';
import {LocationsService} from "../services/locations.services";

import {TempChart} from "../components/charts/TempChart";
import {TempsService} from "../services/temps.services";

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
    TempsService.getNLastTemps(100).then((temps) => {
      this.setState({
        temps: temps.data
      });
    })
  }

  render() {
    return (
      <Page>
        {!this.state.location
          ? "loading"
          :(
            <div>
              <div>Nazwa lokacji: {this.state.location.name}</div>

              {this.state.temps
              ? <TempChart temps={this.state.temps}/>
              : null}


            </div>


          )}

      </Page>
    )
  }

}

export {LocationPage}