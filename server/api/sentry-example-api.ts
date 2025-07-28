// This is just a very simple API route that throws an example error.
export default defineEventHandler(() => {
	throw new Error('Sentry Example API Route Error');
});
