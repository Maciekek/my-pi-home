import React from 'react';
import { Page } from '../components/page';
import { Icon } from '../components/uiComponents/Icon';
import { LocationsService } from '../services/locations.services';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

class LocationSettingsPage extends React.Component {
  state = {
    location: null,
    isEditingNotificationEmail: false,
  };

  constructor(props) {
    super(props);
    LocationsService.getLocationSettings(this.props.match.params.id).then((locations) => {
      console.log(locations.data);
      const location = locations.data;
      if (!location.notificationSettings) {
        location.notificationSettings = {
          enabled: false,
          email: '',
          inactiveThresholdMinutes: 60,
        };
      }
      this.setState({
        location,
        isEditingNotificationEmail: false,
      });
    });
  }

  submit = () => {
    const settings = this.state.location.notificationSettings;
    if (settings && settings.enabled) {
      const email = (settings.email || '').trim();
      const threshold = Number(settings.inactiveThresholdMinutes);
      if (!email || email.indexOf('@') === -1) {
        alert('Podaj poprawny email do powiadomień.');
        return;
      }
      if (!threshold || threshold < 1) {
        alert('Podaj poprawny czas braku aktywności (minuty).');
        return;
      }
    }

    LocationsService.updateLocation(this.props.match.params.id, this.state.location).then(() => {
      this.props.history.push(`/locations/${this.props.match.params.id}`);
    });
  };

  changeValue = (event) => {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    console.log(name);
    const obj = this.state;
    obj.location[name] = value;

    this.setState(obj);
  };

  changeValueBySensorIndex = (index, name, event) => {
    const value = event.target.value;

    const obj = this.state;
    console.log(obj);
    obj.location.tempSettings.sensors[index][name] = value;
    this.setState(obj);
  };

  changeNotificationValue = (event) => {
    const target = event.target;
    const rawValue = target.type === 'checkbox' ? target.checked : target.value;
    const value = target.type === 'number' ? Number(rawValue) : rawValue;
    const name = target.name;
    const obj = this.state;

    if (!obj.location.notificationSettings) {
      obj.location.notificationSettings = {
        enabled: false,
        email: '',
        inactiveThresholdMinutes: 60,
      };
    }

    obj.location.notificationSettings[name] = value;
    this.setState(obj);
  };

  startEmailEdit = () => {
    const obj = this.state;
    if (!obj.location.notificationSettings) {
      obj.location.notificationSettings = {
        enabled: false,
        email: '',
        inactiveThresholdMinutes: 60,
      };
    }
    obj.location.notificationSettings.email = '';
    obj.isEditingNotificationEmail = true;
    this.setState(obj);
  };

  maskEmail = (email) => {
    if (!email || email.indexOf('@') === -1) {
      return '';
    }
    const [local, domain] = email.split('@');
    if (local.length <= 1) {
      return `*@${domain}`;
    }
    const visible = local.slice(0, 1);
    return `${visible}${'*'.repeat(Math.max(1, local.length - 1))}@${domain}`;
  };

  addNewSensor = () => {
    const state = this.state.location;

    if (!state.tempSettings) {
      console.log('dodaje obiekt');
      state.tempSettings = {};
    }

    if (!state.tempSettings.sensors) {
      console.log('dodaje tablice');
      state.tempSettings.sensors = [];
    }

    state.tempSettings.sensors.push({
      name: '',
      description: '',
      sensorId: '',
      locationId: this.props.match.params.id,
    });

    console.log(state);

    this.setState(state);
  };

  removeSensor = (index) => {
    const obj = this.state;
    if (!obj.location.tempSettings || !obj.location.tempSettings.sensors) {
      return;
    }
    const confirmed = window.confirm('Czy na pewno usunąć tę czujkę?');
    if (!confirmed) {
      return;
    }
    obj.location.tempSettings.sensors.splice(index, 1);
    this.setState(obj);
  };

  render() {
    console.log('rerender');
    return (
      <Page>
        {!this.state.location ? (
          'loading'
        ) : (
          <div className="location-settings">
            <Form className="location-settings__card">
              <div className="location-settings__section-title">Ustawienia lokacji</div>
              <Form.Group controlId="name">
                <Form.Label>Nazwa lokacji</Form.Label>
                <Form.Control
                  name={'name'}
                  onChange={this.changeValue}
                  type="name"
                  placeholder="Nazwa lokalizacji"
                  value={this.state.location.name}
                />
              </Form.Group>

              <Form.Group controlId="description">
                <Form.Label>Opis Lokalizacji</Form.Label>
                <Form.Control
                  name={'description'}
                  type="description"
                  onChange={this.changeValue}
                  placeholder="opis lokalizacji"
                  value={this.state.location.description}
                />
              </Form.Group>

              <div className="location-settings__section-title">Powiadomienia</div>
              <Form.Group controlId="notificationSettingsEnabled">
                <Form.Check
                  type="checkbox"
                  label="Powiadomienie o braku aktywności odczytów"
                  name="enabled"
                  onChange={this.changeNotificationValue}
                  checked={
                    this.state.location.notificationSettings &&
                    this.state.location.notificationSettings.enabled
                  }
                />
              </Form.Group>

              {this.state.location.notificationSettings &&
                this.state.location.notificationSettings.enabled && (
                  <div className="location-settings__section">
                    <Form.Group controlId="notificationSettingsEmail">
                      <Form.Label>Email do powiadomień</Form.Label>
                    {this.state.location.notificationSettings.email && !this.state.isEditingNotificationEmail ? (
                      <div className="location-settings__email-row">
                        <Form.Control
                          readOnly
                          type="text"
                          value={this.maskEmail(this.state.location.notificationSettings.email)}
                        />
                        <Button
                          variant="outline-secondary"
                          className="location-settings__email-edit"
                          onClick={this.startEmailEdit}
                        >
                          Zmień
                        </Button>
                      </div>
                    ) : (
                      <Form.Control
                        name="email"
                        type="email"
                        onChange={this.changeNotificationValue}
                        placeholder="email@domena.pl"
                        value={this.state.location.notificationSettings.email}
                      />
                    )}
                    <Form.Text className="text-muted">
                      Aby zmienić email, usuń aktualny i wpisz nowy.
                    </Form.Text>
                  </Form.Group>
                    <Form.Group controlId="notificationSettingsThreshold">
                      <Form.Label>Brak aktywności (minuty)</Form.Label>
                      <Form.Control
                        name="inactiveThresholdMinutes"
                        type="number"
                        min="1"
                        onChange={this.changeNotificationValue}
                        value={this.state.location.notificationSettings.inactiveThresholdMinutes}
                      />
                    </Form.Group>
                  </div>
                )}

              <div className="location-settings__section-title">Czujki</div>
              {this.state.location.tempSettings &&
                this.state.location.tempSettings.sensors.map((sensor, index) => {
                  return (
                    <div className="location-settings__sensor" key={index}>
                      <div className="location-settings__sensor-header">
                        <div className="location-settings__sensor-title">Czujka #{index + 1}</div>
                        <button
                          type="button"
                          className="location-settings__sensor-delete"
                          onClick={() => this.removeSensor(index)}
                          aria-label="Usuń czujkę"
                        >
                          <Icon type="delete" size={18} />
                        </button>
                      </div>
                      <Form.Group controlId={`sensorSettings-name-${index}`}>
                        <Form.Label>Nazwa czujki</Form.Label>
                        <Form.Control
                          onChange={(event) => this.changeValueBySensorIndex(index, 'name', event)}
                          type={`sensorSettings-${index}`}
                          placeholder="Nazwa czujki"
                          value={sensor.name}
                        />
                      </Form.Group>
                      <Form.Group controlId={`sensorSettings-id-${index}`}>
                        <Form.Label>Id czujki</Form.Label>
                        <Form.Control
                          onChange={(event) => this.changeValueBySensorIndex(index, 'sensorId', event)}
                          type={`sensorSettings-${index}`}
                          placeholder="Id czujki"
                          value={sensor.sensorId}
                        />
                      </Form.Group>
                    </div>
                  );
                })}

              <div className="location-settings__actions">
                <Button variant="secondary" onClick={this.addNewSensor}>
                  Dodaj nową czujkę
                </Button>
                <Button variant="primary" onClick={this.submit}>
                  Zapisz
                </Button>
              </div>
            </Form>
          </div>
        )}
      </Page>
    );
  }
}

export { LocationSettingsPage };
