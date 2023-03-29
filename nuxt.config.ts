export default defineNuxtConfig({
	modules: ['@nuxtjs/supabase', 'nuxt-og-image'],
	plugins: [{ src: '~/plugins/vercel.ts', mode: 'client' }],
	runtimeConfig: {
		public: {
			apiBase: process.env.SUPABASE_URL,
			baseUrl: process.env.SITE_URL,
			prod: process.env.NODE_ENV === 'production',
			siteUrl: process.env.SITE_URL || 'https://choosier.app',
		},
	},
	typescript: {
		shim: false,
	},
});
