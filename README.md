
# my-pi-home

My-pi-home is a lightweight and straightforward application designed for recording, storing, and displaying temperature readings sent by external devices. The application also includes the capability to control relays, although this feature is not currently in use or supported by me.

## Motivation 

I developed this application to assist a family member in monitoring the furnace and indoor temperatures. Later on, I found it useful for my own use with devices such as Raspberry Pi (utilizing ds18b20 sensors) and NodeMCU (paired with ds18b20 sensors).

### Raspberry PI
There's a client tailored for Raspberry Pi (`/pi`) in place, which reads temperatures from ds18b20 sensors and transmits them to a specified address configured in the settings.

### Tech stach
- Backend framework - Nest.js
- Frontend library - React.js
- DB - MongoDD
- Reverse Proxy - Ngnix
- SMS provider - Twilio
- Docker, github actions


### Hosting
Hosted on https://mikr.us/

### SMTP / Email notifications
The backend reads SMTP config from `main-server/.env`. For Brevo, use:

```
SMTP_HOST=smtp-relay.brevo.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your_brevo_login
SMTP_PASS=your_brevo_password
SMTP_FROM=alerts@yourdomain.com
SMTP_TEST_TO=you@example.com
INACTIVE_NOTIFICATION_COOLDOWN_MINUTES=30
```

`SMTP_TEST_TO` is optional. If set, the server sends a one-time test email on startup.

----

![Diagram](./assets/diagram.png)
