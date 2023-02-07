import React from 'react';

// import 'bootstrap/dist/css/bootstrap.min.css';
// import 'react-toastify/dist/ReactToastify.min.css';
import './styles/App.scss';

import { ConfirmationModal } from 'components/ConfirmationModal';
import { WebsocketIndicator } from 'components/uiComponents/websocketIndicator';
import { DashboardPage } from 'pages/DashboardPage';
import { DashboardSettingsPage } from 'pages/DashboardSettingsPage';
import { DeviceFormPage } from 'pages/DeviceFormPage';
import { DevicesPage } from 'pages/DevicesPage';
import { LocationPage } from 'pages/LocationPage';
import { LocationSettingsPage } from 'pages/LocationSettingsPage';
import { LocationsNewPage } from 'pages/LocationsNewPage';
import LocationsPage from 'pages/LocationsPage';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { BrowserRouter as Router, Link, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

function App() {
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
