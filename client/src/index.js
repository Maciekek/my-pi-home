import React from 'react';
import ReactDOM from 'react-dom';
import './styles/index.scss';
import 'bootstrap-daterangepicker/daterangepicker.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { Provider } from 'react-redux';
import { combineReducers, createStore, compose, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

import { locationReducer } from 'store/reducers/Locations';
import { dashboardsReducer } from 'store/reducers/Dashboards';
import { settingsReducer } from 'store/reducers/Settings';
import { behaviourReducer } from 'store/reducers/Behaviour';
import { devicesReducer } from 'store/reducers/Devices';
import { websocket } from 'utils/Websocket';
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

// const socket = window.io('http://localhost:8888');
// console.log(socket);

websocket.connect();

const store = createStore(
  combineReducers({
    locationStore: locationReducer,
    dashboardsStore: dashboardsReducer,
    settingsStore: settingsReducer,
    behaviourStore: behaviourReducer,
    devicesStore: devicesReducer,
  }),
  composeEnhancers(applyMiddleware(thunk)),
);

//
ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

export { store };
