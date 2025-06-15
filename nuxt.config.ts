export default defineNuxtConfig({
	css: [
		'~/assets/modern-normalize.css',
		'~/assets/variables.css',
		'~/assets/base.css',
		'~/assets/utils.css',
	],

	future: {
		compatibilityVersion: 4,
	},

	modules: ['@nuxtjs/supabase', '@nuxt/image', '@nuxt/eslint'],

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

	compatibilityDate: '2024-08-27',
});
