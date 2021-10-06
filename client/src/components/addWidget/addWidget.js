import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Select from 'react-select';
import PropTypes from 'prop-types';
import _ from 'lodash';

import { SpeedChartForm } from './speedChartForm';
import { createDashboardByLocationId, updateDashboardByLocationId } from 'store/actions/DashboardActions';
import { connect } from 'react-redux';
import { LineChartForm } from './lineChartForm';

const options = [
  { value: 'speedChart', label: 'Predkościomierz' },
  { value: 'lineChart', label: 'Wykres liniowy' },
];

class AddWidgetBase extends React.PureComponent {
  static propTypes = {
    widget: PropTypes.object,
    widgetIndex: PropTypes.number,
    hideModal: PropTypes.func,
    locationId: PropTypes.string,
  };

  constructor(props) {
    super(props);

    const state = {
      selectedFormType: null,
      form: null,
      widget: null,
    };

    if (!_.isEmpty(this.props.widget)) {
      state.widget = this.props.widget;
      state.selectedFormType = this.props.widget.widgetType;
    }

    this.state = state;
  }

  componentDidMount() {
    this.props.onMount(() => this.onSubmit());
  }

  onSubmit = () => {
    const form = {
      ...this.state.form,
      widgetType: this.state.selectedFormType,
    };

    this.props.hideModal();

    if (_.isNumber(this.props.widgetIndex)) {
      const config = JSON.parse(this.props.dashboard.config);

      config[this.props.widgetIndex] = form;

      this.props.dispatch(
        updateDashboardByLocationId(this.props.locationId, {
          locationId: this.props.locationId,
          config: JSON.stringify(config),
        }),
      );
      return;
    }

    let currentConfig;
    try {
      currentConfig = JSON.parse(this.props.dashboard.config);
      currentConfig.push(form);
    } catch (e) {
      currentConfig = [];
      currentConfig.push(form);

      this.props.dispatch(
        createDashboardByLocationId(this.props.locationId, {
          locationId: this.props.locationId,
          config: JSON.stringify(currentConfig),
        }),
      );

      return;
    }

    this.props.dispatch(
      updateDashboardByLocationId(this.props.locationId, {
        locationId: this.props.locationId,
        config: JSON.stringify(currentConfig),
      }),
    );
  };

  getComponentToRender = componentName => {
    switch (componentName) {
      case 'speedChart':
        return SpeedChartForm;
      case 'lineChart':
        return LineChartForm;
      default:
        return () => {
          return null;
        };
    }
  };

  onSelectChange = e => {
    this.setState({
      selectedFormType: e.value,
    });
  };

  onChange = formValue => {
    this.setState({
      form: formValue,
    });
  };

  getWidgetType = () => {
    return _.find(options, ['value', this.state.widget.widgetType]);
  };

  isEditMode = () => {
    return !_.isEmpty(this.state.widget);
  };

  render() {
    const Component = this.getComponentToRender(this.state.selectedFormType);
    return (
      <Modal.Body>
        {!this.isEditMode() ? <h6>Wybierz rodzaj widgetu:</h6> : null}
        <Select
          className="basic-single"
          classNamePrefix="select"
          isClearable={false}
          name="color"
          isDisabled={this.isEditMode()}
          onChange={this.onSelectChange}
          options={options}
          value={this.isEditMode() ? this.getWidgetType() : null}
        />

        {this.state.selectedFormType ? (
          <Component
            locationId={this.props.locationId}
            onChange={this.onChange}
            submit={this.onSubmit}
            widget={this.state.widget}
            hideModal={this.props.hideModal}
          />
        ) : null}
      </Modal.Body>
    );
  }
}

const getDashboardForLocation = (state, locationId) => {
  return state.dashboardsStore[locationId];
};

const mapStateToProps = (state, props) => {
  return {
    dashboard: getDashboardForLocation(state, props.locationId),
  };
};

export const AddWidget = connect(mapStateToProps)(AddWidgetBase);
