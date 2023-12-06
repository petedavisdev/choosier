export default defineNuxtConfig({
	css: [
		'~/assets/modern-normalize.css',
		'~/assets/variables.css',
		'~/assets/base.css',
		'~/assets/utils.css',
	],
	modules: ['@nuxtjs/supabase', '@nuxtjs/eslint-module'],
	runtimeConfig: {
		public: {
			apiBase: process.env.SUPABASE_URL,
			baseUrl: process.env.SITE_URL,
			prod: process.env.NODE_ENV === 'production',
			siteUrl: process.env.SITE_URL || 'https://choosier.com',
		},
	},
	supabase: {
		redirect: false,
	},
	typescript: {
		shim: false,
	},
});
