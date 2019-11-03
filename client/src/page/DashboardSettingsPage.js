import React from 'react';
import {Page} from '../components/page';

import {connect} from "react-redux";
import {speedChartDataLoader} from "../dataLoaders/speedChartDataLoader";
import {SpeedChart} from "../components/charts/SpeedChart";
import {WidgetDataLoader} from "../components/widgetDataLoader";
import {widgetDataLoaders, widgetType} from "./DashboardPage";
import {SpeedChartSettings} from "../dashboardSettingComponents/SpeedChartSettingsForm";


class DashboardSettingsPageBase extends React.Component {
  state = {
    dashboardConfig: [
      {
        widgetType: widgetType.speedChart,
        dataLoader: widgetDataLoaders.speedChart,
        options: {
          sensorId: '123',
          unit: "C"
        }
      }
    ]
  };

  getComponentToRender = (name) => {
    const widgetSettingForm = `SpeedChartSettings`;
    switch (name) {
      case 'SpeedChart':
        return SpeedChartSettings;
    }
  };

  onChange = (e) => {

  }

  render() {
    return (
      <Page>
        {this.state.dashboardConfig.map(widget => {
          const Component = this.getComponentToRender(widget.widgetType);
          return <Component options={widget.options} onChange={this.onChange} />
        })}
        <div>Welcome on dashboard setting page beta!</div>
      </Page>
    )
  }

}

const mapStateToProps = (state) => {
  return {
    counter: state.counter
  }
};

export const DashboardSettingsPage = connect(mapStateToProps)(DashboardSettingsPageBase);