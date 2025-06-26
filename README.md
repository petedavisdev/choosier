# Choosier

Visual decisions made easy

[choosier.com](https://www.choosier.com/)

&copy; 2022 Pete Davis

## Local Development

### Setup

- [Node.js](https://nodejs.org/en/download/) LTS
- Create an [ngrok account](https://ngrok.com/), [install ngrok](https://dashboard.ngrok.com/get-started/setup/macos), and [get a free static forwarding URL](https://dashboard.ngrok.com/domains).
- Copy the `.env.example` file to `.env` and fill in the values.

```bash
npm install
```

### Development

```bash
npm run dev
npm run ngrok
```

Copy the ngrok Forwarding URL and add it to [polar sandbox webhooks](https://sandbox.polar.sh/dashboard/petedavisdev/settings/webhooks) with the path `/api/polar/order` and all the order events selected.

Also edit the `vite.server.allowedHosts` in `nuxt.config.ts` to include the ngrok Forwarding URL, minus the https://

TODO: move to .env
