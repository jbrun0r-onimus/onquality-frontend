# Onquality (onquality-front)

## Install the dependencies

```bash
# if not docker
yarn
```

### Start the app in development mode (hot-code reloading, error reporting, etc.)

```bash
quasar dev

# or with docker
docker compose up --build
```

### Lint the files

```bash
yarn lint
```

### Format the files

```bash
yarn format
```

### Build the app for production

```bash
quasar build

# or with docker
docker compose -f docker-compose-ci.yml up -d --build
```

### Customize the configuration

See [Configuring quasar.config.js](https://v2.quasar.dev/quasar-cli-vite/quasar-config-js).
