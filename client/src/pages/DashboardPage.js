import React from 'react';
import { Page } from 'components/page';
import _ from 'lodash';

import { connect } from 'react-redux';
import { speedChartDataLoader } from 'dataLoaders/speedChartDataLoader';
import { SpeedChart } from 'components/charts/SpeedChart';
import { WidgetDataLoader } from 'components/widgetDataLoader';
import { CustomModal } from 'components/modal';
import { AddWidget } from 'components/addWidget/addWidget';
import { getDashboardByLocationIdFront } from 'store/actions/DashboardActions';
import { TempChartWidget } from 'components/charts/TempChartWidget';
import { getLocationSettings } from 'store/actions/LocationsActions';

import { Widget } from 'components/widget';
import { Icon } from 'components/uiComponents/Icon';

export const widgetType = {
  speedChart: 'SpeedChart',
  lineChart: 'LineChart',
};

export const widgetDataLoaders = {
  speedChart: speedChartDataLoader,
};

class DashboardPageBase extends React.Component {
  state = {
    isModalOpen: false,
    editWidgetIndex: null,
  };

  constructor(props) {
    super(props);
    props.dispatch(getLocationSettings(props.match.params.id));

    props.dispatch(getDashboardByLocationIdFront(props.match.params.id));
  }

  getComponentToRender = name => {
    switch (name) {
      case 'speedChart':
        return SpeedChart;
      case 'lineChart':
        return TempChartWidget;
    }
  };

  addNewWidget = () => {
    this.setState({
      isModalOpen: true,
    });

    this.props.dispatch(getDashboardByLocationIdFront(this.props.match.params.id));
  };

  onModalHide = () => {
    this.setState({
      isModalOpen: false,
      editWidgetIndex: null,
    });
  };

  getDashboardConfig = () => {
    if (!this.props.dashboardConfig) {
      return [];
    }

    return JSON.parse(this.props.dashboardConfig.config);
  };

  onEditWidget = widgetIndex => {
    console.log('onEditWidget ');
    this.setState({
      isModalOpen: true,
      editWidgetIndex: widgetIndex,
    });
  };

  render() {
    console.log(this.getDashboardConfig());
    return (
      <Page>
        <div className={'dashboard'}>
          <div className={'centered'}>Dashboard beta.</div>
          <div className={'dashboard__settings'}>
            <div className={'dashboard__settings--action'} onClick={this.addNewWidget}>
              <Icon icon={'add_circle_outline'} />
              Dodaj nowy widget
            </div>
          </div>

          <div className={'dashboard__widgets'}>
            {this.getDashboardConfig().map((widget, index) => {
              return (
                <Widget
                  key={index}
                  index={index}
                  widgetType={widget.widgetType}
                  chartName={widget.chartName || ''}
                  locationId={this.props.match.params.id}
                  editWidget={this.onEditWidget}
                >
                  <WidgetDataLoader
                    locationId={this.props.match.params.id}
                    component={this.getComponentToRender(widget.widgetType)}
                    dataLoader={speedChartDataLoader}
                    options={widget}
                  />
                </Widget>
              );
            })}
          </div>

          {this.state.isModalOpen ? (
            <CustomModal
              title={_.isNumber(this.state.editWidgetIndex) ? 'Edytuj widget' : 'Dodaj nowy widget'}
              locationId={this.props.match.params.id}
              onHide={this.onModalHide}
              show={this.state.isModalOpen}
            >
              <AddWidget
                widgetIndex={this.state.editWidgetIndex}
                widget={this.getDashboardConfig()[this.state.editWidgetIndex]}
              />
            </CustomModal>
          ) : null}
        </div>
      </Page>
    );
  }
}

const getDashboardForLocation = (state, locationId) => {
  return state.dashboardsStore[locationId];
};

const mapStateToProps = (state, props) => {
  return {
    dashboardConfig: getDashboardForLocation(state, props.match.params.id),
  };
};

export const DashboardPage = connect(mapStateToProps)(DashboardPageBase);
