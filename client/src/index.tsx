import 'bootstrap-daterangepicker/daterangepicker.css';
import React from 'react';
import { applyMiddleware, combineReducers, createStore } from 'redux';
import thunk from 'redux-thunk';
import App from './App';

import { composeWithDevTools } from '@redux-devtools/extension';
import { behaviourReducer } from 'store/reducers/Behaviour';
import { dashboardsReducer } from 'store/reducers/Dashboards';
import { devicesReducer } from 'store/reducers/Devices';
import { locationReducer } from 'store/reducers/Locations';
import { settingsReducer } from 'store/reducers/Settings';
import { websocket } from 'utils/Websocket';
import * as serviceWorker from './serviceWorker';

import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import './styles/index.scss';

websocket.connect();
console.log(process.env);

const store = createStore(
  combineReducers({
    locationStore: locationReducer,
    dashboardsStore: dashboardsReducer,
    settingsStore: settingsReducer,
    behaviourStore: behaviourReducer,
    devicesStore: devicesReducer,
  }),
  composeWithDevTools(applyMiddleware(thunk)),
);

const container = document.getElementById('root') as HTMLDivElement;
const root = createRoot(container); // createRoot(container!) if you use TypeScript
root.render(
  <Provider store={store}>
    <App />
  </Provider>,
);

// ReactDOM.render(
//   <Provider store={store}>
//     <App />
//   </Provider>,
//   document.getElementById('root'),
// );

// // If you want your app to work offline and load faster, you can change
// // unregister() to register() below. Note this comes with some pitfalls.
// // Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();

export { store };
