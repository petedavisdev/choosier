export default defineNuxtConfig({
	future: {
		compatibilityVersion: 4,
	},

	css: [
		'~/assets/modern-normalize.css',
		'~/assets/variables.css',
		'~/assets/base.css',
		'~/assets/utils.css',
	],

	modules: ['@nuxtjs/supabase', '@nuxt/image', '@nuxt/eslint'],

	nitro: {
		prerender: {
			routes: ['/', '/about', '/privacy', '/terms'],
		},
	},

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

	compatibilityDate: '2024-08-27',
});
