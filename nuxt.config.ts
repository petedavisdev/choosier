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

	modules: [
		'@nuxtjs/supabase',
		'@nuxt/image',
		'@nuxt/eslint',
		'@polar-sh/nuxt',
	],

	nitro: {
		prerender: {
			routes: ['/about', '/privacy', '/terms', '/hello'],
		},
	},

	runtimeConfig: {
		private: {
			polarWebhookSecret: process.env.POLAR_WEBHOOK_SECRET,
		},

		public: {
			apiBase: process.env.SUPABASE_URL,
			baseUrl: process.env.SITE_URL,
			polarCheckoutLink: process.env.POLAR_CHECKOUT_LINK,
			prod: process.env.NODE_ENV === 'production',
			siteUrl: process.env.SITE_URL || 'https://www.choosier.com',
		},
	},

	supabase: {
		redirect: false,
	},

	compatibilityDate: '2024-08-27',

	vite: {
		server: {
			allowedHosts: [process.env.NGROK_FORWARDING_URL || process.env.SITE_URL!],
		},
	},
});
