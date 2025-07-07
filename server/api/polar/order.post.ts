import { serverSupabaseServiceRole } from '#supabase/server';

export default defineEventHandler((event) => {
	const {
		private: { polarWebhookSecret },
	} = useRuntimeConfig();

	async function handleOrder(choiceId: number, orderId: string) {
		const supabase = serverSupabaseServiceRole(event);

		const closeAt = addDaysToISODate(
			TIMES.extendDays,
			new Date().toISOString()
		);

		const removeAt = addDaysToISODate(TIMES.removeDays, closeAt);

		const choiceResponse = await supabase
			.from('choices')
			.update({
				close_at: closeAt,
				remove_at: removeAt,
				order_id: orderId,
			})
			.eq('id', choiceId);

		if (choiceResponse.error) {
			console.error(choiceResponse.error);
			return;
		}

		console.log(choiceResponse);
	}

	const webhooksHandler = Webhooks({
		webhookSecret: polarWebhookSecret,
		onOrderPaid: async (order) => {
			const choiceId = +(order.data.metadata.reference_id ?? '');

			if (!choiceId) return;

			handleOrder(choiceId, order.data.id);
		},
	});

	return webhooksHandler(event);
});
