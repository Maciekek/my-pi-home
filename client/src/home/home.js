import React from 'react';
import {LocationsService} from "../services/locations.services";
import {TempsService} from "../services/temps.services";

const Location = (location) => {
    return (
        <div key={location._id}>Nazwa: {location.name} |  Opis: {location.description} |  Id: {location._id}</div>
    )
};

const Temp = (temp) => {
    return (
        <div key={temp.id}>Nazwa: {temp.name} |  Wartość: {temp.value} |  Id: {temp._id}</div>

    )
};

class Home extends React.Component {

    state = {
        locations: null,
        temps: null
    };

    constructor(props) {
        super(props);
        LocationsService.getAllLocations().then(
            (locations) => this.setState({locations: locations.data})
        );

        TempsService.getAllTemps().then(
            (temps) => this.setState({temps: temps.data})
        );
    }

    render() {
        return (
            <div> Dostepne Lokacje {this.state.locations ? (`(${this.state.locations.length})`) : null}:

                {this.state.locations
                    ? this.state.locations.map(location => Location(location))
                    : null
                }

            <br/>
                {this.state.temps
                    ? this.state.temps.map(temps => Temp(temps))
                    : null
                }
            </div>
        )

    }

}

export {Home}
