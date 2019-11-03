import React from 'react';
import {Page} from '../components/page';

import {connect} from "react-redux";
import {speedChartDataLoader} from "../dataLoaders/speedChartDataLoader";
import {SpeedChart} from "../components/charts/SpeedChart";
import {WidgetDataLoader} from "../components/widgetDataLoader";
import {CustomModal} from "../components/modal";
import {AddWidget} from "../components/addWidget/addWidget";
import {getDashboardByLocationIdFront} from "../store/actions/DashboardActions";
import {TempChartWidget} from "../components/charts/TempChartWidget";
import {getLocationSettings} from "../store/actions/LocationsActions";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlusCircle} from '@fortawesome/free-solid-svg-icons'
import {Widget} from "../components/widget";

export const widgetType = {
  'speedChart': 'SpeedChart',
  'lineChart': 'LineChart',
};

export const widgetDataLoaders = {
  'speedChart': speedChartDataLoader,
};

class DashboardPageBase extends React.Component {
  state = {
    // dashboardConfig: [
    //   {
    //     widgetType: widgetType.speedChart,
    //     dataLoader: widgetDataLoaders.speedChart,
    //     options: {
    //       sensorIds: ['room1']
    //     }
    //   },
    //   {
    //     widgetType: widgetType.speedChart,
    //     dataLoader: widgetDataLoaders.speedChart,
    //     options: {
    //       sensorIds: ['room2']
    //     }
    //   },
    //   {
    //     widgetType: widgetType.speedChart,
    //     dataLoader: widgetDataLoaders.speedChart,
    //     options: {
    //       sensorIds: ['room2']
    //     }
    //   },
    //   {
    //     widgetType: widgetType.speedChart,
    //     dataLoader: widgetDataLoaders.speedChart,
    //     options: {
    //       sensorIds: ['room2']
    //     }
    //   }
    // ],
    isModalOpen: false
  };

  constructor(props) {
    super(props);
    props.dispatch(getLocationSettings(props.match.params.id));

    props.dispatch(getDashboardByLocationIdFront(props.match.params.id))

  }

  getComponentToRender = (name) => {
    switch (name) {
      case 'speedChart':
        return SpeedChart;
      case 'lineChart':
        return TempChartWidget;
    }
  };

  addNewWidget = () => {
    this.setState({
      isModalOpen: true
    });

    this.props.dispatch(getDashboardByLocationIdFront(this.props.match.params.id))
  };

  onModalHide = () => {
    this.setState({
      isModalOpen: false
    })
  };

  getDashboardConfig = () => {
    if (!this.props.dashboardConfig) {
      return [];
    }

    return JSON.parse(this.props.dashboardConfig.config);
  };

  render() {
    return (
      <Page>
        <div className={'dashboard'}>
          <div className={'centered'}>Dashboard beta.</div>
          <div className={'dashboard__settings'}>
            <div className={'dashboard__settings--action'} onClick={this.addNewWidget}>
              <FontAwesomeIcon icon={faPlusCircle}/>Dodaj nowy widget</div>
          </div>
          <div className={'dashboard__widgets'}>

            {this.getDashboardConfig().map((widget, index) => {
              return (
                <Widget index={index} locationId={this.props.match.params.id}>
                  <WidgetDataLoader
                    locationId={this.props.match.params.id}
                    component={this.getComponentToRender(widget.widgetType)}
                    dataLoader={speedChartDataLoader}
                    options={widget}
                  />
                </Widget>
              )
            })}

          </div>

          {this.state.isModalOpen
            ? <CustomModal
              title={"Dodaj nowy widget"}
              locationId={this.props.match.params.id}
              onHide={this.onModalHide}
              show={this.state.isModalOpen}><AddWidget/></CustomModal>
            : null
          }
        </div>
      </Page>
    )
  }
}

const getDashboardForLocation = (state, locationId) => {
  return state.dashboardsStore[locationId];
};

const mapStateToProps = (state, props) => {
  return {
    dashboardConfig: getDashboardForLocation(state, props.match.params.id)
  }
};

export const DashboardPage = connect(mapStateToProps)(DashboardPageBase);