import React from 'react';
import PropTypes from 'prop-types';
import {connect} from "react-redux";

import {faTrashAlt} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import { removeWidgetByIndex} from "../store/actions/DashboardActions";

class WidgetBase extends React.PureComponent {
  static propTypes = {
    children: PropTypes.node.isRequired,
    index: PropTypes.number.isRequired,
    locationId: PropTypes.string.isRequired,
  };

  state = {

  };

  removeWidget = () => {
    this.props.dispatch(removeWidgetByIndex(this.props.locationId, this.props.index));
  };

  render() {
    return (
      <div className={'widget'}>
        <div className={'widget__menu'}>
          <div className={'widget__menu--action'} onClick={this.removeWidget}>
            <FontAwesomeIcon icon={faTrashAlt}/>
          </div>
        </div>
        {this.props.children}
      </div>
    )
  }
}

export const Widget = connect()(WidgetBase);