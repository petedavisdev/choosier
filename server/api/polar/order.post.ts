import { serverSupabaseServiceRole } from '#supabase/server';

export default defineEventHandler((event) => {
	async function handleOrder(choiceId: number, orderId: string) {
		const supabase = serverSupabaseServiceRole<Database>(event);

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
			throw createError({
				statusCode: choiceResponse.status,
				message: choiceResponse.error.message,
			});
		}

		console.log(choiceResponse);
	}

	const {
		private: { polarWebhookSecret },
	} = useRuntimeConfig();

	let webhooksHandler;

	try {
		webhooksHandler = Webhooks({
			webhookSecret: polarWebhookSecret,
			onOrderPaid: async (order) => {
				const choiceId = +(order.data.metadata.reference_id ?? '');

				if (!choiceId || choiceId <= 0) {
					throw createError({
						statusCode: 400,
						message: 'order.data.metadata.reference_id is missing',
					});
				}

				handleOrder(choiceId, order.data.id);
			},
		});
	} catch (error) {
		if (error instanceof Error) {
			throw createError({
				statusCode: 500,
				message: error.message,
			});
		}

		throw createError({
			statusCode: 501,
			message: 'Error creating webhooks handler',
		});
	}

	return webhooksHandler(event);
});
