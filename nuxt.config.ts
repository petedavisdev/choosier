export default defineNuxtConfig({
	modules: ['@nuxtjs/supabase'],
	runtimeConfig: {
		public: {
			baseUrl: process.env.SITE_URL,
			apiBase: process.env.SUPABASE_URL,
			prod: process.env.NODE_ENV === 'production',
		},
	},
	typescript: {
		shim: false,
	},
});
