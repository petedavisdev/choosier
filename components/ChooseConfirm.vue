<template>
	<section class="option">
		<img :src="props.image" alt="" class="image" />
	</section>

	<section v-if="!user" class="option">
		<h1>You have chosen!</h1>
		<p>To submit your choice, please confirm you are human.</p>

		<input
			type="email"
			placeholder="Email"
			v-model="data.email"
			title="Email"
			required
		/>

		<button @click="login" class="button">
			Send me a confirmation link &rarr;
		</button>
		<br />
		<p>Essential cookies only.</p>
	</section>

	<section v-else>
		<h1>You have chosen!</h1>
		<button @click.prevent="vote" class="button">✓ Confirm my choice</button>
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
	email: '',
});

async function vote(userId?: string) {
	try {
		data.loading = true;

		const updates = {
			user_id: userId || user.value?.id,
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
		return true;
	} catch (error: any) {
		alert(error.message);
		return false;
	} finally {
		data.loading = false;
	}
}

async function login() {
	try {
		data.loading = true;
		const response = await supabase.auth.signInWithOtp({
			email: data.email,
			options: { emailRedirectTo: '/account' },
		});

		if (response.error) throw response.error;

		const voted = await vote(response.data.user?.id);

		if (voted) {
			alert('Check your email for the login link!');
		}
	} catch (error: any) {
		alert(error.error_description || error.message);
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
</style>
