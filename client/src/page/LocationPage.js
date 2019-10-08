import React from 'react';
import {Page} from '../components/page';
import {LocationsService} from "../services/locations.services";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import {TempChart} from "../components/charts/TempChart";
import {TempsService} from "../services/temps.services";
import { faCog } from '@fortawesome/free-solid-svg-icons'

import {Link} from "react-router-dom";
import {LoadingIndicator} from "../components/loadingIndicator";
import {connect} from "react-redux";
import {rootActions} from "./../store/root-actions";
import {getAllLocations} from "./../store/actions/LocationsActions";

const DEFAULT_N = 100;

class LocationPageBase extends React.Component {
  state = {
    location: null,
    temps: null,
    n: DEFAULT_N,
  };

  constructor(props) {
    super(props);

    props.dispatch(getAllLocations());
    LocationsService.getLocation(props.match.params.id).then((location) => {

      this.setState({
        location: location.data
      }, () => {
        const sensorsCount = this.state.location.tempSettings.sensors.length;
        this.getTemps(DEFAULT_N * sensorsCount)
      })
    })
  }

  getTemps = (n) => {
    TempsService.getNLastTemps(this.props.match.params.id, n).then((temps) => {
      this.setState({
        temps: temps.data
      });
    })
  };

  onInputChange = () => {
    const sensorsCount = this.state.location.tempSettings.sensors.length;
    console.log(parseInt(document.querySelector('#nCount').value));
    console.log(sensorsCount);
    this.setState({
      temps: null,
      n: (parseInt(document.querySelector('#nCount').value)) * sensorsCount
    }, () => this.getTemps(this.state.n))
  };


  render() {
    this.props.dispatch(rootActions.testAction());
    if (!this.state.location) {
      return <LoadingIndicator/>;
    }

    return (
      <Page>


          <div className={'location'}>
            <Link to={`/locations/${this.props.match.params.id}/settings`}> <FontAwesomeIcon icon={faCog} />
              Ustawienia
            </Link>

            <br/>
            <br/>


            <div className={'location__name'}>
            Nazwa lokalizacji:
            <span> {this.state.location.name}</span>
            </div>

            <br/>
            <br/>

            <strong>Domyślnie pobieranych jest 100 ostatnich pomiarów. Jeżeli chcesz zwiększyć/zmiejszyć ten zakres wystarczy, że podasz niżej ile chcesz pobrać pomiarów.<br/></strong>
            <input type="text" id='nCount' placeholder={'100'}/>
            <button onClick={this.onInputChange}>zapisz</button>

            <br/>
            <br/>
            <br/>
          {this.state.temps
          ? <TempChart temps={this.state.temps} location={this.state.location}/>
          : null}
        </div>
      </Page>
    )
  }

}

const mapStateToProps = (state) => {
  console.log('state', state) ;
  return {
    counter: state.counter
  }
};

export const LocationPage = connect(mapStateToProps)(LocationPageBase);