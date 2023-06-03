import onesignal from '@onesignal/onesignal-vue3';

export default defineNuxtPlugin((nuxtApp) => {
	nuxtApp.vueApp.use(onesignal, {
		appId: '13970e77-6e91-46b2-b033-1427d3281709',
		safari_web_id: 'web.onesignal.auto.040fbea3-5bf4-4f81-a6ad-042d48246d00',
		notifyButton: {
			enable: true,
		},
	});
});
