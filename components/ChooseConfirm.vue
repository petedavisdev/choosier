<template>
	<section class="option">
		<img :src="props.image" alt="" class="image" />
	</section>

	<section v-if="!user" class="option">
		<h1>You have chosen!</h1>
		<p>Now please confirm you are human.</p>

		<p class="Field">
			<label for="email">Email</label>
			<input type="email" id="email" name="email" required />
		</p>

		<input hidden name="chosen" :value="$attrs.image" />

		<button class="button">Send me a confirmation link</button>

		<!-- <footer>
			<h3>Privacy first...</h3>
			<ul>
				<li>
					<strong>No spam.</strong> We are only using your email address to send
					the confirmation link. It will not be shared.
				</li>
				<li>
					<strong>Essential cookies only.</strong> The confirmation link sets a
					cookie so that you can continue using Choosier uninterrupted.
					<strong>No trackers. No ads</strong>.
				</li>
			</ul>
		</footer> -->
	</section>

	<section v-else>
		<h1>You have chosen!</h1>
		<button @click.prevent="vote" class="button">Confirm my choice</button>
	</section>
</template>

<script setup lang="ts">
const props = defineProps<{
	id: number;
	image: string;
}>();
const user = useSupabaseUser();
const supabase = useSupabaseClient();
const router = useRouter();

const data = reactive({
	loading: false,
});

async function vote() {
	try {
		data.loading = true;

		const updates = {
			user_id: user.value?.id,
			choice_id: props.id,
			image_url: props.image,
			updated_at: new Date(),
		};

		// @ts-ignore: Unreachable code error
		const response = await supabase.from('votes').upsert(updates, {
			returning: 'minimal',
		});

		if (response.error) throw response.error;

		router.push('/results/' + props.id);
	} catch (error: any) {
		alert(error.message);
	} finally {
		data.loading = false;
	}
}
</script>

<style scoped>
section {
	display: grid;
	place-content: center;
	min-height: 0;
	text-align: center;
}

section img {
	object-fit: contain;
	min-height: 0;
	max-width: 100%;
	max-height: 100%;
	line-height: 1;
	background-color: white;
}

.Field {
	width: 100%;
	display: grid;
	grid-template-columns: auto 1fr;
	gap: 0.5em;
	align-items: center;
}
</style>
