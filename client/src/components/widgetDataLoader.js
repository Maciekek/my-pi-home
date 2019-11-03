import React from 'react';
import PropTypes from 'prop-types';
import {LoadingIndicator} from "./loadingIndicator";

class WidgetDataLoader extends React.Component {
  static propTypes = {
    component: PropTypes.func,
    dataLoader: PropTypes.object,
    options: PropTypes.object,
    locationId: PropTypes.string,
  };

  constructor(props) {
    super(props);

    const config = {
      ...props.component.WidgetConfig,
      ...props.options,
      locationId: props.locationId
    };
    props.dataLoader.get(config).then(data => {
      this.setState({
        data: data
      })

    }).catch(() => {
      console.log("ERROR");
      return;
    });

    this.state = {
      data: null,
    }
  }

  render() {
    const Component = this.props.component;

    return (
      this.state.data === null
        ? <LoadingIndicator/>
        : this.state.data.length > 0
          ? <Component {...this.props} data={this.state.data}/>
          : <ErrorWidget error={JSON.stringify(this.props.options)}>
            </ErrorWidget>
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