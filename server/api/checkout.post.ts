export default defineEventHandler((event) => {
	const {
		public: { siteUrl },
		private: { polarAccessToken, polarServer },
	} = useRuntimeConfig();

	const checkoutHandler = Checkout({
		accessToken: polarAccessToken,
		successUrl: siteUrl + PATHS.success,
		server: polarServer as 'sandbox' | 'production',
	});

	return checkoutHandler(event);
});
