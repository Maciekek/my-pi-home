import React from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { Page } from '../components/page';
import { Icon } from '../components/uiComponents/Icon';
import { LocationsService } from '../services/locations.services';
import { uuidv4 } from '../utils/Utils';

const MIN_CONTACT_GPIO = 2;
const MAX_CONTACT_GPIO = 27;
const DEFAULT_ALARM_SETTINGS = { enabled: false, from: '22:00', to: '06:00', sensorIds: [], reminderMinutes: 30 };

class LocationSettingsPage extends React.Component {
  state = {
    location: null,
    isEditingNotificationEmail: false,
  };

  loadLocation = () => {
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
  };

  constructor(props) {
    super(props);
    this.loadLocation();
  }

  submit = () => {
    const settings = this.state.location.notificationSettings;
    const email = ((settings && settings.email) || '').trim();
    const emailValid = email && email.indexOf('@') !== -1;

    if (settings && settings.enabled) {
      const threshold = Number(settings.inactiveThresholdMinutes);
      if (!emailValid) {
        alert('Podaj poprawny email do powiadomień.');
        return;
      }
      if (!threshold || threshold < 1) {
        alert('Podaj poprawny czas braku aktywności (minuty).');
        return;
      }
    }

    if (settings && (settings.notifyContactOpen || settings.notifyContactClose) && !emailValid) {
      alert('Podaj poprawny email do powiadomień, aby włączyć notyfikacje o czujnikach otwarcia.');
      return;
    }

    const alarmSettings = this.getAlarmSettings();
    if (alarmSettings.enabled) {
      if (!alarmSettings.from || !alarmSettings.to || alarmSettings.from === alarmSettings.to) {
        alert('Podaj różne godziny uzbrojenia i rozbrojenia alarmu.');
        return;
      }
    }
    if (alarmSettings.sensorIds.length && !(Number(alarmSettings.reminderMinutes) >= 1)) {
      alert('Podaj co ile minut przypominać o otwartym czujniku (min. 1).');
      return;
    }
    if (alarmSettings.enabled && !alarmSettings.sensorIds.length) {
      alert('Wybierz przynajmniej jeden czujnik dla alarmu.');
      return;
    }
    if (alarmSettings.sensorIds.length && !emailValid) {
      alert('Podaj poprawny email do powiadomień, aby alarm mógł wysyłać wiadomości.');
      return;
    }

    const contactSensors = this.getContactSensors();
    const usedGpios = {};
    for (const contactSensor of contactSensors) {
      const gpio = Number(contactSensor.gpio);
      if (contactSensor.gpio === '' || !Number.isInteger(gpio) || gpio < MIN_CONTACT_GPIO || gpio > MAX_CONTACT_GPIO) {
        alert(`Podaj poprawny numer GPIO (BCM ${MIN_CONTACT_GPIO}-${MAX_CONTACT_GPIO}) dla czujnika otwarcia.`);
        return;
      }
      if (usedGpios[gpio]) {
        alert(`GPIO ${gpio} jest przypisany do więcej niż jednego czujnika otwarcia.`);
        return;
      }
      usedGpios[gpio] = true;
    }

    const sensors =
      (this.state.location.tempSettings && this.state.location.tempSettings.sensors) || [];
    for (const sensor of sensors) {
      if (sensor.notifyAbove || sensor.notifyBelow) {
        if (!emailValid) {
          alert('Podaj poprawny email do powiadomień, aby włączyć notyfikacje o temperaturze.');
          return;
        }
      }
      if (sensor.notifyAbove && (sensor.maxTemp === undefined || sensor.maxTemp === null || sensor.maxTemp === '')) {
        alert('Podaj próg górny temperatury dla czujki.');
        return;
      }
      if (sensor.notifyBelow && (sensor.minTemp === undefined || sensor.minTemp === null || sensor.minTemp === '')) {
        alert('Podaj próg dolny temperatury dla czujki.');
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

  changeSensorField = (index, name, event) => {
    const target = event.target;
    let value;
    if (target.type === 'checkbox') {
      value = target.checked;
    } else if (target.type === 'number') {
      value = target.value === '' ? '' : Number(target.value);
    } else {
      value = target.value;
    }

    const obj = this.state;
    obj.location.tempSettings.sensors[index][name] = value;
    this.setState(obj);
  };

  hasSensorAlerts = () => {
    const sensors =
      this.state.location && this.state.location.tempSettings && this.state.location.tempSettings.sensors;
    if (!sensors) {
      return false;
    }
    return sensors.some((sensor) => sensor.notifyAbove || sensor.notifyBelow);
  };

  hasContactAlerts = () => {
    const settings = this.state.location && this.state.location.notificationSettings;
    const alarmSettings = this.state.location && this.state.location.alarmSettings;
    return !!(
      (settings && (settings.notifyContactOpen || settings.notifyContactClose)) ||
      (alarmSettings && alarmSettings.sensorIds && alarmSettings.sensorIds.length)
    );
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

  resetForm = () => {
    this.props.history.push(`/locations/${this.props.match.params.id}`);
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

  getContactSensors = () => {
    const contactSettings = this.state.location && this.state.location.contactSettings;
    return (contactSettings && contactSettings.sensors) || [];
  };

  addContactSensor = () => {
    const obj = this.state;
    if (!obj.location.contactSettings) {
      obj.location.contactSettings = {};
    }
    if (!obj.location.contactSettings.sensors) {
      obj.location.contactSettings.sensors = [];
    }
    obj.location.contactSettings.sensors.push({
      sensorId: `contact_${uuidv4().slice(0, 8)}`,
      name: '',
      gpio: '',
    });
    this.setState(obj);
  };

  changeContactSensorField = (index, name, event) => {
    const target = event.target;
    const value = target.type === 'number' ? (target.value === '' ? '' : Number(target.value)) : target.value;
    const obj = this.state;
    obj.location.contactSettings.sensors[index][name] = value;
    this.setState(obj);
  };

  removeContactSensor = (index) => {
    const confirmed = window.confirm('Czy na pewno usunąć ten czujnik otwarcia?');
    if (!confirmed) {
      return;
    }
    const obj = this.state;
    const [removed] = obj.location.contactSettings.sensors.splice(index, 1);
    if (obj.location.alarmSettings && obj.location.alarmSettings.sensorIds) {
      obj.location.alarmSettings.sensorIds = obj.location.alarmSettings.sensorIds.filter(
        (sensorId) => sensorId !== removed.sensorId,
      );
    }
    this.setState(obj);
  };

  getAlarmSettings = () => ({
    ...DEFAULT_ALARM_SETTINGS,
    ...((this.state.location && this.state.location.alarmSettings) || {}),
  });

  changeAlarmField = (name, value) => {
    const obj = this.state;
    obj.location.alarmSettings = { ...this.getAlarmSettings(), [name]: value };
    this.setState(obj);
  };

  toggleAlarmSensor = (sensorId, checked) => {
    const sensorIds = this.getAlarmSettings().sensorIds.filter((id) => id !== sensorId);
    this.changeAlarmField('sensorIds', checked ? [...sensorIds, sensorId] : sensorIds);
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
                  checked={this.state.location.notificationSettings && this.state.location.notificationSettings.enabled}
                />
              </Form.Group>

              <Form.Group controlId="notificationSettingsContactOpen">
                <Form.Check
                  type="checkbox"
                  label="Powiadomienie o otwarciu (kontaktron)"
                  name="notifyContactOpen"
                  onChange={this.changeNotificationValue}
                  checked={
                    !!(this.state.location.notificationSettings && this.state.location.notificationSettings.notifyContactOpen)
                  }
                />
              </Form.Group>

              <Form.Group controlId="notificationSettingsContactClose">
                <Form.Check
                  type="checkbox"
                  label="Powiadomienie o zamknięciu (kontaktron)"
                  name="notifyContactClose"
                  onChange={this.changeNotificationValue}
                  checked={
                    !!(this.state.location.notificationSettings && this.state.location.notificationSettings.notifyContactClose)
                  }
                />
              </Form.Group>

              {this.state.location.notificationSettings &&
                (this.state.location.notificationSettings.enabled || this.hasSensorAlerts() || this.hasContactAlerts()) && (
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
                      <Form.Text className="text-muted">Aby zmienić email, usuń aktualny i wpisz nowy.</Form.Text>
                    </Form.Group>
                    {this.state.location.notificationSettings.enabled && (
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
                    )}
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

                      <Form.Group controlId={`sensorNotifyAbove-${index}`}>
                        <Form.Check
                          type="checkbox"
                          label="Notyfikacje po przekroczeniu temperatury"
                          checked={!!sensor.notifyAbove}
                          onChange={(event) => this.changeSensorField(index, 'notifyAbove', event)}
                        />
                      </Form.Group>
                      {sensor.notifyAbove && (
                        <Form.Group controlId={`sensorMaxTemp-${index}`}>
                          <Form.Label>Próg górny (°C)</Form.Label>
                          <Form.Control
                            type="number"
                            placeholder="np. 30"
                            value={sensor.maxTemp === undefined || sensor.maxTemp === null ? '' : sensor.maxTemp}
                            onChange={(event) => this.changeSensorField(index, 'maxTemp', event)}
                          />
                        </Form.Group>
                      )}

                      <Form.Group controlId={`sensorNotifyBelow-${index}`}>
                        <Form.Check
                          type="checkbox"
                          label="Notyfikacje po spadku poniżej temperatury"
                          checked={!!sensor.notifyBelow}
                          onChange={(event) => this.changeSensorField(index, 'notifyBelow', event)}
                        />
                      </Form.Group>
                      {sensor.notifyBelow && (
                        <Form.Group controlId={`sensorMinTemp-${index}`}>
                          <Form.Label>Próg dolny (°C)</Form.Label>
                          <Form.Control
                            type="number"
                            placeholder="np. 5"
                            value={sensor.minTemp === undefined || sensor.minTemp === null ? '' : sensor.minTemp}
                            onChange={(event) => this.changeSensorField(index, 'minTemp', event)}
                          />
                        </Form.Group>
                      )}
                    </div>
                  );
                })}

              <div className="location-settings__sensors-actions">
                <Button variant="secondary" onClick={this.addNewSensor}>
                  Dodaj nową czujkę
                </Button>
              </div>

              <div className="location-settings__section-title">Czujniki otwarcia (kontaktrony)</div>
              {this.getContactSensors().map((contactSensor, index) => {
                return (
                  <div className="location-settings__sensor" key={contactSensor.sensorId}>
                    <div className="location-settings__sensor-header">
                      <div className="location-settings__sensor-title">Czujnik otwarcia #{index + 1}</div>
                      <button
                        type="button"
                        className="location-settings__sensor-delete"
                        onClick={() => this.removeContactSensor(index)}
                        aria-label="Usuń czujnik otwarcia"
                      >
                        <Icon type="delete" size={18} />
                      </button>
                    </div>
                    <Form.Group controlId={`contactSensor-name-${index}`}>
                      <Form.Label>Nazwa</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="np. Drzwi wejściowe"
                        value={contactSensor.name}
                        onChange={(event) => this.changeContactSensorField(index, 'name', event)}
                      />
                    </Form.Group>
                    <Form.Group controlId={`contactSensor-gpio-${index}`}>
                      <Form.Label>Numer pinu (GPIO, numeracja BCM)</Form.Label>
                      <Form.Control
                        type="number"
                        min={MIN_CONTACT_GPIO}
                        max={MAX_CONTACT_GPIO}
                        placeholder="17"
                        value={contactSensor.gpio}
                        onChange={(event) => this.changeContactSensorField(index, 'gpio', event)}
                      />
                      <Form.Text className="text-muted">
                        BCM, nie numer fizyczny złącza (np. GPIO17 = pin 11). Drugi przewód do GND. Raspberry Pi
                        pobiera zmiany w ciągu minuty.
                      </Form.Text>
                    </Form.Group>
                  </div>
                );
              })}

              <div className="location-settings__sensors-actions">
                <Button variant="secondary" onClick={this.addContactSensor}>
                  Dodaj czujnik otwarcia
                </Button>
              </div>

              <div className="location-settings__section-title">Alarm</div>
              {this.getContactSensors().length === 0 ? (
                <p className="text-muted">Dodaj najpierw czujnik otwarcia, żeby móc go uzbrajać.</p>
              ) : (
                <div className="location-settings__section">
                  <Form.Group>
                    <Form.Label>Czujniki objęte alarmem</Form.Label>
                    {this.getContactSensors().map((contactSensor) => (
                      <Form.Check
                        key={contactSensor.sensorId}
                        id={`alarmSensor-${contactSensor.sensorId}`}
                        type="checkbox"
                        label={contactSensor.name || `GPIO${contactSensor.gpio}`}
                        checked={this.getAlarmSettings().sensorIds.includes(contactSensor.sensorId)}
                        onChange={(event) => this.toggleAlarmSensor(contactSensor.sensorId, event.target.checked)}
                      />
                    ))}
                    <Form.Text className="text-muted">
                      Wybrane czujniki powinny być zamknięte, gdy alarm jest uzbrojony (z harmonogramu lub
                      przyciskiem na stronie lokacji).
                    </Form.Text>
                  </Form.Group>

                  <Form.Group controlId="alarmScheduleEnabled">
                    <Form.Check
                      type="checkbox"
                      label="Uzbrajaj automatycznie codziennie"
                      checked={!!this.getAlarmSettings().enabled}
                      onChange={(event) => this.changeAlarmField('enabled', event.target.checked)}
                    />
                  </Form.Group>

                  {this.getAlarmSettings().enabled && (
                    <div className="location-settings__alarm-times">
                      <Form.Group controlId="alarmFrom">
                        <Form.Label>Od</Form.Label>
                        <Form.Control
                          type="time"
                          value={this.getAlarmSettings().from}
                          onChange={(event) => this.changeAlarmField('from', event.target.value)}
                        />
                      </Form.Group>
                      <Form.Group controlId="alarmTo">
                        <Form.Label>Do</Form.Label>
                        <Form.Control
                          type="time"
                          value={this.getAlarmSettings().to}
                          onChange={(event) => this.changeAlarmField('to', event.target.value)}
                        />
                      </Form.Group>
                    </div>
                  )}

                  <Form.Group controlId="alarmReminder">
                    <Form.Label>Przypominaj o otwartym czujniku co (minuty)</Form.Label>
                    <Form.Control
                      type="number"
                      min="1"
                      value={this.getAlarmSettings().reminderMinutes}
                      onChange={(event) =>
                        this.changeAlarmField('reminderMinutes', event.target.value === '' ? '' : Number(event.target.value))
                      }
                    />
                    <Form.Text className="text-muted">
                      Powiadomienia idą na email z sekcji Powiadomienia: otwarcie przy uzbrojonym alarmie, czujnik
                      otwarty w chwili uzbrojenia, przypomnienia oraz brak łączności z Raspberry Pi.
                    </Form.Text>
                  </Form.Group>
                </div>
              )}

              <div className="location-settings__footer">
                <div className="location-settings__actions">
                  <Button variant="outline-secondary" onClick={this.resetForm}>
                    Anuluj
                  </Button>
                  <Button variant="primary" onClick={this.submit}>
                    Zapisz
                  </Button>
                </div>
              </div>
            </Form>
          </div>
        )}
      </Page>
    );
  }
}

export { LocationSettingsPage };
