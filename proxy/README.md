# Proxy (Node.js)

Statyczny HTTP proxy do zbierania requestow i przekazywania dalej. Logi leca na stdout.

## Konfiguracja

Ustaw `TARGET_URL` (wymagane) oraz opcjonalnie `PORT`. Plik `.env` jest ladowany automatycznie.

Przyklad:

```bash
cp .env.example .env
# edytuj .env
```

## Uruchomienie

```bash
npm install
npm start
```

Serwer nasluchuje na `0.0.0.0:PORT` i przekazuje wszystko do `TARGET_URL`.
