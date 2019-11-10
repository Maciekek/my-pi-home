import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Select from 'react-select';
import {SpeedChartForm} from "./speedChartForm";
import {
  createDashboardByLocationId,
  updateDashboardByLocationId
} from "../../store/actions/DashboardActions";
import {connect} from "react-redux";
import {LineChartForm} from "./lineChartForm";

const options = [
  {value: 'speedChart', label: 'Predkościomierz'},
  {value: 'lineChart', label: 'Wykres liniowy'}
];


class AddWidgetBase extends React.PureComponent {
  static propTypes = {};

  state = {
    selectedFormType: null,
    form: null
  };

  componentDidMount() {
    this.props.onMount(() => this.onSubmit())
  }

  onSubmit = () => {
    const form = {
      ...this.state.form,
      widgetType: this.state.selectedFormType,
    };

    let currentConfig;
    try {
      currentConfig = JSON.parse(this.props.dashboard.config);
      currentConfig.push(form);
    } catch (e) {
      currentConfig = [];
      currentConfig.push(form);

      this.props.dispatch(createDashboardByLocationId(this.props.locationId,
        {
          locationId: this.props.locationId,
          config: JSON.stringify(currentConfig)}));

      return;
    }



    this.props.dispatch(updateDashboardByLocationId(this.props.locationId,
      {
        locationId: this.props.locationId,
        config: JSON.stringify(currentConfig)}));
  };

  getComponentToRender = (componentName) => {
    switch (componentName) {
      case 'speedChart':
        return SpeedChartForm;
      case 'lineChart':
        return LineChartForm;
      default:
        return () => {return null};
    }
  };

  onSelectChange = (e) => {
    this.setState({
      selectedFormType: e.value
    })
  };

  onChange = (formValue) => {
    this.setState({
      form: formValue
    })
  };

  render() {
    const Component = this.getComponentToRender(this.state.selectedFormType);
    return (

      <Modal.Body>
        <h6>Wybierz rodzaj widgetu:</h6>
        <Select
          className="basic-single"
          classNamePrefix="select"
          isClearable={false}
          name="color"
          onChange={this.onSelectChange}
          options={options}
        />

        {this.state.selectedFormType
          ? <Component onChange={this.onChange}/>
          : null}


      </Modal.Body>

    )
  }
}

const getDashboardForLocation = (state, locationId) => {
  return state.dashboardsStore[locationId];
};

const mapStateToProps = (state, props) => {
  return {
    dashboard: getDashboardForLocation(state, props.locationId)
  }
};

export const AddWidget = connect(mapStateToProps)(AddWidgetBase)
