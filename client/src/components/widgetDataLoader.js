import React from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';

import {LoadingIndicator} from "./loadingIndicator";
import moment from "moment";
//2018-08-29 15:38
const parseDateRangeToDate = (dateRange) => {
  switch (dateRange) {
    case 'last.1.hour':
      return {
        from: moment().subtract('1', 'hour'),
        to: moment().format('YYYY-MM-DD HH:mm')
      };
    case 'last.2.hour':
      return {
        from: moment().subtract('2', 'hour'),
        to: moment().format('YYYY-MM-DD HH:mm')
      };
    case 'last.3.hour':
      return {
        from: moment().subtract('3', 'hour'),
        to: moment().format('YYYY-MM-DD HH:mm')
      };
    case 'last.6.hour':
      return {
        from: moment().subtract('6', 'hour'),
        to: moment().format('YYYY-MM-DD HH:mm')
      };
    case 'last.12.hour':
      return {
        from: moment().subtract('12', 'hour'),
        to: moment().format('YYYY-MM-DD HH:mm')
      };
    case 'last.24.hour':
      return {
        from: moment().subtract('24', 'hour'),
        to: moment().format('YYYY-MM-DD HH:mm')
      };
    case 'last.7.days':
      return {
        from: moment().subtract('7', 'days'),
        to: moment().format('YYYY-MM-DD HH:mm')
      };

    default:
      return {
        from: moment().subtract('1', 'hour'),
        to: moment().format('YYYY-MM-DD HH:mm')
      };
  }
};


class WidgetDataLoader extends React.Component {
  static propTypes = {
    component: PropTypes.object,
    dataLoader: PropTypes.object,
    options: PropTypes.object,
    locationId: PropTypes.string,
    dateRange: PropTypes.string,
  };

  constructor(props) {
    super(props);
    const config = {
      ...props.component.WidgetConfig,
      ...props.options,
      locationId: props.locationId,
      ...parseDateRangeToDate(this.props.dateRange)
    };

    if(config.sensors) {
      props.dataLoader.get(config).then(data => {
        this.setState({
          data: data,
        })
      });
    }

    this.state = {
      data: null
    }
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    console.log("load data?")
    console.log(prevState);
    console.log(this.state);
    if (prevProps.dateRange !== this.props.dateRange || !_.isEqual(prevProps, this.props)) {
      console.log("load data!!!!")
      this.loadData()
    }
  }

  loadData = () => {
    const config = {
      ...this.props.component.WidgetConfig,
      ...this.props.options,
      locationId: this.props.locationId,
      ...parseDateRangeToDate(this.props.dateRange)
    };

    this.setState({
      isLoading: true
    });

    this.props.dataLoader.get(config).then(data => {
      console.log('data', data)
      this.setState({
        data: [...data],
        isLoading: false
      })
    })
  };

  render() {
    const Component = this.props.component;
    console.log(this.state.data)
    return (
      <>
        {this.state.isLoading ?
          <div className={'loading-overlay'}><LoadingIndicator/></div>
          : null}


        {this.state.data === null
          ? <LoadingIndicator/>
          : this.state.data.length > 0
            ? <Component {...this.props} data={this.state.data}/>
            : <ErrorWidget error={JSON.stringify(this.props.options)}/>}
      </>
    )
  }
}

const ErrorWidget = ({error}) => {
  return (
    <div className={'error-widget'}>
      Niestety nie mogłem załadować danych dla tych ustawień. Sprawdz ich poprawnośći i dodaj ponownie widget
      <pre>{error}</pre>
    </div>

  )

}

export {WidgetDataLoader};
