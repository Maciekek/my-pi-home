import React from 'react';
import PropTypes from 'prop-types';
import {connect} from "react-redux";

import {faTrashAlt} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import { removeWidgetByIndex} from "../store/actions/DashboardActions";

const widgetWithAvailableTimeRangePicker = new Set(['lineChart']);


class WidgetBase extends React.Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    index: PropTypes.number.isRequired,
    locationId: PropTypes.string.isRequired,
    widgetType: PropTypes.string.isRequired,
  };

  state = {
    customDateRanges: {}
  };

  removeWidget = () => {
    this.props.dispatch(removeWidgetByIndex(this.props.locationId, this.props.index));
  };

  setDateRange = (index, range) => {
    const dateRanges = this.state.customDateRanges;

    dateRanges[index] = range;

    this.setState({
      customDateRanges: dateRanges
    }, () => this.forceUpdate)

  };

  getDateRange = (index) => {
    const dateRanges = this.state.customDateRanges;

    if (!dateRanges[index]){
      return 'last.1.hour';
    }
    console.log(dateRanges[index]);
    return dateRanges[index]
  };

  render() {
    return (
      <div className={'widget'} key={this.props.key}>
        <div className={'widget__menu'}>
          <div className={'widget__menu--action'} >

            {widgetWithAvailableTimeRangePicker.has(this.props.widgetType)
                ? <WidgetDateRangePicker
                  index={this.props.index}
                  active={this.state.customDateRanges}
                  onSetRange={(index, range) => {
                    this.setDateRange(index, range)
                  }}
                />
                : <div/>}


            <FontAwesomeIcon icon={faTrashAlt} onClick={this.removeWidget}/>
          </div>
        </div>

        {React.cloneElement(this.props.children,
          {
            dateRange: this.getDateRange(this.props.index)
          })}
      </div>
    )
  }
}

const WidgetDateRangePicker = ({index, onSetRange, active}) => {
  console.log(active[index])
  return (
    <div className={'widget-date-range-picker'}>
      <span className={'widget-date-range-picker__title'}>Ostatnie:
      <span className={'widget-date-range-picker__range' + (active[index] === 'last.1.hour' ? ' active' : '')}
            onClick={() => onSetRange(index, 'last.1.hour')}> 1h</span>
      <span className={'widget-date-range-picker__range' + (active[index] === 'last.2.hour' ? ' active' : '')}
            onClick={() => onSetRange(index, 'last.2.hour')}> 2h</span>
      <span className={'widget-date-range-picker__range' + (active[index] === 'last.24.hour' ? ' active' : '')}
            onClick={() => onSetRange(index, 'last.24.hour')}> 24h</span>
      </span>

    </div>
  )
};

export const Widget = connect()(WidgetBase);