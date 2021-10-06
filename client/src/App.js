import React from 'react';

import './styles/App.scss';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.min.css';

import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import LocationsPage from './pages/LocationsPage';
import { LocationPage } from './pages/LocationPage';
import { LocationSettingsPage } from './pages/LocationSettingsPage';
import { LocationsNewPage } from './pages/LocationsNewPage';
import { DashboardPage } from './pages/DashboardPage';
import { DashboardSettingsPage } from './pages/DashboardSettingsPage';
import { WebsocketIndicator } from './components/uiComponents/websocketIndicator';
import { ToastContainer } from 'react-toastify';
import { ConfirmationModal } from './components/ConfirmationModal';
import { DevicesPage } from './pages/DevicesPage';
import { DeviceFormPage } from './pages/DeviceFormPage';

function App() {
  console.log('APP started');

  return (
    <div className={'app'}>
      <Router>
        <Navbar bg="light" expand="lg">
          <Navbar.Brand href="/">My pi home </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mr-auto">
              <Link to="/locations">Dostępne lokacje</Link>
            </Nav>
          </Navbar.Collapse>

          <WebsocketIndicator />
        </Navbar>

        <Route path="/" exact={true} component={LocationsPage} />
        <Route path="/locations" exact={true} component={LocationsPage} />
        <Route path="/location/new" exact={true} component={LocationsNewPage} />
        <Route path="/locations/:id" exact={true} component={LocationPage} />
        <Route path="/locations/:id/settings" exact={true} component={LocationSettingsPage} />
        <Route path="/dashboard/:id" exact={true} component={DashboardPage} />
        <Route path="/:id/devices/" exact={true} component={DevicesPage} />
        <Route path="/:id/devices/new" exact={true} component={DeviceFormPage} />
        <Route path="/:id/devices/:deviceId/edit" exact={true} component={DeviceFormPage} />
        <Route path="/dashboardSettings/:id" exact={true} component={DashboardSettingsPage} />

        <ConfirmationModal></ConfirmationModal>
      </Router>
      <ToastContainer />
    </div>
  );
}

export default App;
