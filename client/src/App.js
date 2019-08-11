import React from 'react';

import './styles/App.scss';
import 'bootstrap/dist/css/bootstrap.min.css';

import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import {BrowserRouter as Router, Route, Link} from "react-router-dom";
import {LocationsPage} from "./page/LocationsPage";
import {LocationPage} from "./page/LocationPage";

function App() {
  return (
    <div className={'app'}>
      <Router>
        <Navbar bg="light" expand="lg">
          <Navbar.Brand href="#">My pi home </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav"/>
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mr-auto">
              <Link to="/locations">Dostępne lokacje</Link>
            </Nav>
          </Navbar.Collapse>
        </Navbar>

        <Route path="/" exact={true} component={LocationsPage}/>
        <Route path="/locations" exact={true} component={LocationsPage}/>
        <Route path="/locations/:id" exact={true} component={LocationPage}/>

      </Router>
    </div>

  );
}

export default App;
