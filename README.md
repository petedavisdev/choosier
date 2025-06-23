# Choosier

Visual decisions made easy

[choosier.com](https://choosier.com/)

&copy; 2022 Pete Davis

## Local Development

### Prerequisites

- [Node.js](https://nodejs.org/en/download/)

### Installation

Create an [ngrok account](https://ngrok.com/) and [install ngrok](https://dashboard.ngrok.com/get-started/setup/macos).

```bash
npm install
```

Copy the `.env.example` file to `.env` and fill in the values.

### Development

```bash
npm run dev
npm run ngrok
```

Copy the ngrok Forwarding URL and add it to [polar sandbox webhooks](https://sandbox.polar.sh/dashboard/petedavisdev/settings/webhooks) with the path `/api/polar/order` and all the order events selected.

Also edit the `vite.server.allowedHosts` in `nuxt.config.ts` to include the ngrok Forwarding URL, minus the https://

TODO: move to .env
