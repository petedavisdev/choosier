export default defineNuxtConfig({
	modules: ['@nuxtjs/supabase'],
	plugins: [{ src: '~/plugins/vercel.ts', mode: 'client' }],
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
