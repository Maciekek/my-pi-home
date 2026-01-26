import moment from 'moment';
import PropTypes from 'prop-types';
import React from 'react';
import DateRangePicker from 'react-bootstrap-daterangepicker';
import { connect } from 'react-redux';

import { Icon } from 'components/uiComponents/Icon';
import { confirmOperation } from 'store/actions/BehaviourActions';
import { removeWidgetByIndex } from 'store/actions/DashboardActions';

const widgetWithAvailableTimeRangePicker = new Set(['lineChart']);

class WidgetBase extends React.Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    chartName: PropTypes.string,
    index: PropTypes.number.isRequired,
    locationId: PropTypes.string.isRequired,
    widgetType: PropTypes.string.isRequired,
    editWidget: PropTypes.func,
  };

  state = {
    customDateRanges: {},
  };

  removeWidget = () => {
    this.props.dispatch(
      confirmOperation({
        visible: true,
        onConfirmAction: () => {
          this.props.dispatch(removeWidgetByIndex(this.props.locationId, this.props.index));
        },
        message: 'Czy na pewno chcesz usunąć ten widget?',
      }),
    );
  };

  setDateRange = (index, range) => {
    const dateRanges = this.state.customDateRanges;
    dateRanges[index] = range;
    console.log(40, index, range);
    this.setState(
      {
        customDateRanges: dateRanges,
      },
      () => this.forceUpdate,
    );
  };

  getDateRange = (index) => {
    const dateRanges = this.state.customDateRanges;

    if (!dateRanges[index]) {
      return 'last.1.hour';
    }

    return dateRanges[index];
  };

  editWidget = () => {
    console.log('qwe');

    this.props.editWidget && this.props.editWidget(this.props.index);
  };

  render() {
    return (
      <div className={'widget'} key={this.props.key}>
        <div className={'widget__menu'}>
          {widgetWithAvailableTimeRangePicker.has(this.props.widgetType) ? (
            <WidgetDateRangePicker
              index={this.props.index}
              active={this.state.customDateRanges}
              onSetRange={(index, range) => {
                this.setDateRange(index, range);
              }}
            />
          ) : null}
          <div className={'widget__menu-title'}>{this.props.chartName}</div>
          <div className={'widget__menu-actions'}>
            <Icon className={'widget__menu-actions--remove'} onClick={() => this.removeWidget()} type={'delete'} />
          </div>
        </div>

        {React.cloneElement(this.props.children, {
          dateRange: this.getDateRange(this.props.index),
        })}
      </div>
    );
  }
}

const WidgetDateRangePicker = ({ index, onSetRange, active }) => {
  const isActive = () => {
    if (!active[index]) {
      return true;
    }

    return active[index] === 'last.1.hour';
  };

  return (
    <div className={'widget-date-range-picker'}>
      <span className={'widget-date-range-picker__title'}>
        <span
          className={'widget-date-range-picker__range' + (isActive() ? ' active' : '')}
          onClick={() => onSetRange(index, 'last.1.hour')}
        >
          1h
        </span>
        <span
          className={'widget-date-range-picker__range' + (active[index] === 'last.2.hour' ? ' active' : '')}
          onClick={() => onSetRange(index, 'last.2.hour')}
        >
          2h
        </span>
        <span
          className={'widget-date-range-picker__range' + (active[index] === 'last.3.hour' ? ' active' : '')}
          onClick={() => onSetRange(index, 'last.3.hour')}
        >
          3h
        </span>
        <span
          className={'widget-date-range-picker__range' + (active[index] === 'last.6.hour' ? ' active' : '')}
          onClick={() => onSetRange(index, 'last.6.hour')}
        >
          6h
        </span>
        <span
          className={'widget-date-range-picker__range' + (active[index] === 'last.12.hour' ? ' active' : '')}
          onClick={() => onSetRange(index, 'last.12.hour')}
        >
          12h
        </span>
        <span
          className={'widget-date-range-picker__range' + (active[index] === 'last.24.hour' ? ' active' : '')}
          onClick={() => onSetRange(index, 'last.24.hour')}
        >
          24h
        </span>
        <span
          className={'widget-date-range-picker__range' + (active[index] === 'last.48.hour' ? ' active' : '')}
          onClick={() => onSetRange(index, 'last.48.hour')}
        >
          48h
        </span>
        <span
          className={'widget-date-range-picker__range' + (active[index] === 'last.7.days' ? ' active' : '')}
          onClick={() => onSetRange(index, 'last.7.days')}
        >
          <span className={'no-wrap'}>7 dni</span>
        </span>
        <span
          className={'widget-date-range-picker__range' + (active[index] === 'last.30.days' ? ' active' : '')}
          onClick={() => onSetRange(index, 'last.30.days')}
        >
          <span className={'no-wrap'}>30 dni</span>
        </span>
        <span className={'widget-date-range-picker__range--advanced'}>
          <DateRangePicker
            maxDate={moment().endOf('day')}
            minDate={moment('2021-10-09T10:15:00')}
            locale={{
              format: 'DD/MM/YYYY',
              separator: ' - ',
              applyLabel: 'Zastosuj',
              cancelLabel: 'Anuluj',
              fromLabel: 'Od',
              toLabel: 'Do',
              customRangeLabel: 'Własny zakres',
              weekLabel: 'Tydzień',
              daysOfWeek: ['Nie', 'Pon', 'Wt', 'Śr', 'Czw', 'Pt', 'So'],
              monthNames: [
                'Styczeń',
                'Luty',
                'Marzec',
                'Kwiecień',
                'Maj',
                'Czerwiec',
                'Lipiec',
                'Sierpień',
                'Wrzesień',
                'Październik',
                'Listopad',
                'Grudzień',
              ],
              firstDay: 1,
            }}
            initialSettings={{
              alwaysShowCalendars: true,
            }}
            onApply={(event, picker) => {
              console.log(picker.startDate.valueOf(), picker.endDate.valueOf());
              onSetRange(index, `custom_${picker.startDate.valueOf()}_${picker.endDate.valueOf()}`);
            }}
          >
            <span
              className={
                'widget-date-range-picker__range' +
                (active[index] && active[index].startsWith('custom') ? ' active' : '')
              }
            >
              Własny zakres
            </span>
          </DateRangePicker>
        </span>
      </span>
    </div>
  );
};

export const Widget = connect()(WidgetBase);
