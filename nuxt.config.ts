const domain = process.env.DOMAIN || process.env.VERCEL_URL || 'localhost:3000';

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
			supabaseServiceKey: process.env.SUPABASE_SERVICE_KEY,
		},

		public: {
			apiBase: process.env.SUPABASE_URL,
			polarCheckoutLink: process.env.POLAR_CHECKOUT_LINK,
			prod: process.env.NODE_ENV === 'production',
			siteUrl: 'https://' + domain,
		},
	},

	supabase: {
		redirect: false,
	},

	compatibilityDate: '2024-08-27',

	vite: {
		server: {
			allowedHosts: [domain],
		},
	},
});
