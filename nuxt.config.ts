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
			routes: ['/', '/about', '/privacy', '/terms', '/hello'],
		},
	},

	runtimeConfig: {
		private: {
			polarAccessToken: process.env.POLAR_ACCESS_TOKEN,
			polarServer: process.env.POLAR_SERVER,
			polarWebhookSecret: process.env.POLAR_WEBHOOK_SECRET,
		},

		public: {
			apiBase: process.env.SUPABASE_URL,
			baseUrl: process.env.SITE_URL,
			polarUrl: process.env.POLAR_URL,
			polarCheckoutPath: process.env.POLAR_CHECKOUT_PATH,
			prod: process.env.NODE_ENV === 'production',
			siteUrl: process.env.SITE_URL || 'https://choosier.com',
		},
	},

	supabase: {
		redirect: false,
	},

	compatibilityDate: '2024-08-27',

	vite: {
		server: {
			allowedHosts: [
				'650e-2a02-2988-fffd-f11-5cc7-ba76-f48e-c45b.ngrok-free.app', // ngrok
			],
		},
	},
});
