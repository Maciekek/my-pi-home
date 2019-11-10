import React from 'react';
import PropTypes from 'prop-types';

class SpeedChartSettings extends React.Component {
  static propTypes = {
    options: PropTypes.object,
    onChange: PropTypes.func
  };

  constructor(props) {
    super(props);

    this.state = {
      options: props.options
    }
  }

  onChange = (event) => {
    let name = event.target.name;
    let value = event.target.value;

    const newState = {
      ...this.state,

    };
    newState.options[name] = value;

    this.setState(newState, () =>  this.props.onChange(newState));
  };


  render() {
    return (

      <div>
        <div>
          <label htmlFor="">Sensor ID</label>
          <input type="text" name={'sensorId'} value={this.state.options.sensorId} onChange={this.onChange}/>
        </div>
        <div>
          <label htmlFor="">Jednostka</label>
          <input type="text" name={'unit'} value={this.state.options.unit} onChange={this.onChange}/>
        </div>

      <div>settings page for speedChartsetings</div>

      </div>
    )
  }

}

export {SpeedChartSettings}