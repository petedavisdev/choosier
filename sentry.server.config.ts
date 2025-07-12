import * as Sentry from '@sentry/nuxt';

Sentry.init({
	dsn: 'https://461a76558f13cbd5e67b2776b125e553@o4509656762482688.ingest.de.sentry.io/4509656768315472',

	// We recommend adjusting this value in production, or using tracesSampler
	// for finer control
	tracesSampleRate: 1.0,

	// Setting this option to true will print useful information to the console while you're setting up Sentry.
	debug: false,
});
