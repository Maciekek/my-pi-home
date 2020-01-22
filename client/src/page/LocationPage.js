import _ from 'lodash';

import React from 'react';
import {Page} from '../components/page';
import {LocationsService} from "../services/locations.services";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'

import {TempChart} from "../components/charts/TempChart";
import {TempsService} from "../services/temps.services";
import {faCog} from '@fortawesome/free-solid-svg-icons'
import {faTachometerAlt} from '@fortawesome/free-solid-svg-icons'

import {Link} from "react-router-dom";
import {LoadingIndicator} from "../components/loadingIndicator";
import {connect} from "react-redux";
import {rootActions} from "./../store/root-actions";
import {ActualTemps} from "../components/ActualTemps";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";
import {storeLocationRecentlySensors} from "../store/actions/LocationsActions";

const DEFAULT_N = 100;

class LocationPageBase extends React.Component {
  state = {
    location: null,
    temps: null,
    n: DEFAULT_N,
  };

  constructor(props) {
    super(props);

    LocationsService.getLocation(props.match.params.id).then((location) => {
      this.setState({
        location: location.data
      }, () => {
        if (!this.state.location.tempSettings) {
          this.getTemps(DEFAULT_N * 2)
        } else {
          const sensorsCount = this.state.location.tempSettings.sensors.length;
          this.getTemps(DEFAULT_N * sensorsCount);
        }
      })
    })
  }

  getTemps = (n) => {
    TempsService.getNLastTemps(this.props.match.params.id, n).then((temps) => {
      this.setState({
        temps: temps.data
      }, () => {
        this.props.dispatch(storeLocationRecentlySensors(this.props.match.params.id,
          _.map(_.uniqBy(temps.data, 'sensorId'), 'sensorId')))
      });
    })
  };

  onInputChange = () => {
    const sensorsCount = this.state.location.tempSettings ?  this.state.location.tempSettings.sensors.length : 1;
    this.setState({
      temps: null,
      n: (parseInt(document.querySelector('#nCount').value) || DEFAULT_N) * sensorsCount
    }, () => this.getTemps(this.state.n))
  };


  render() {
    this.props.dispatch(rootActions.testAction());
    if (!this.state.location) {
      return <LoadingIndicator/>;
    }

    return (
      <Page>


        <div className={'location__panel'}>
          <Link to={`/dashboard/${this.props.match.params.id}`}> <FontAwesomeIcon icon={faTachometerAlt}/>
            Dashboard (beta!)
          </Link>
          <Link to={`/locations/${this.props.match.params.id}/settings`}> <FontAwesomeIcon icon={faCog}/>
            Ustawienia
          </Link>
        </div>
        <div className={'location'}>
          <div className={'location__name'}>
            Nazwa lokalizacji:
            <span> {this.state.location.name}</span>
          </div>

          <strong>Domyślnie pobieranych jest 100 ostatnich pomiarów. Jeżeli chcesz zwiększyć/zmiejszyć ten zakres
            wystarczy, że podasz niżej ile chcesz pobrać pomiarów.</strong>


          {/*<Form type="text" id='nCount' placeholder={'100'}/>*/}
          {/*<button onClick={this.onInputChange}>zapisz</button>*/}

          <div className={'load-n'}>
            <Row>
              <Col sm="6">
                <Form.Group controlId="sensorId">
                  <Form.Label >Ile odczytów załadować?</Form.Label>
                  <Form.Control id='nCount' type="number" placeholder="100" />
                  <Button  onClick={this.onInputChange} variant="success" >Załaduj</Button>
                </Form.Group>
              </Col>
            </Row>
          </div>


          {this.state.temps
            ? <ActualTemps temps={this.state.temps} location={this.state.location}/>
            : null}

          {this.state.temps
            ? <TempChart temps={this.state.temps} location={this.state.location}/>
            : null}

        </div>
      </Page>
    )
  }

}

const mapStateToProps = (state) => {
  console.log('state', state);
  return {
    counter: state.counter
  }
};

export const LocationPage = connect(mapStateToProps)(LocationPageBase);
