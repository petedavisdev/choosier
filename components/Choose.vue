<template>
	<Head>
		<Title
			>Choosier. Help @{{ choice.username }} choose {{ choice.title }}</Title
		>
		<Meta
			name="description"
			:content="`Help @${choice.username} choose ${choice.title}`"
		/>
	</Head>

	<main>
		<form
			v-for="(match, matchIndex) in data.matches"
			@reset="updateMatches(matchIndex)"
			:id="'match' + matchIndex"
			:key="matchIndex"
			ref="chooseForm"
		>
			<ChooseConfirm
				v-if="matchIndex === length - 1 && match[0]"
				:image="match[0]"
				:id="+props.id"
			/>

			<template v-else>
				<label
					v-for="(option, optionIndex) in match"
					class="option"
					:key="optionIndex"
				>
					<input
						type="radio"
						:name="'option' + matchIndex"
						@input="updateMatches(matchIndex, option)"
						required
					/>

					<img :src="option" alt="" />
				</label>
			</template>

			<ChooseControls
				class="controls"
				:matchIndex="matchIndex"
				:length="length"
			/>
		</form>

		<aside class="popup backdrop" v-if="data.userHasVoted">
			<NuxtLink :to="'/result' + props.id" class="button">
				You have made your choice
				<h2>See the results &rarr;</h2>
			</NuxtLink>
		</aside>

		<ChooseIntro
			v-else
			class="popup"
			:username="choice.username"
			:title="choice.title"
		/>
	</main>
</template>

<script setup lang="ts">
const props = defineProps<{
	id: number;
}>();

const supabase = useSupabaseClient();
const user = useSupabaseUser();
const choice = await useChoice(props.id);
const length = choice.images.length;

const data = reactive({
	matches: [] as (string | undefined)[][],
	userHasVoted: false,
});

data.matches = choice.images.map((_image, index) => [
	choice.images[2 * index],
	choice.images[2 * index + 1],
]);

if (user.value) {
	try {
		const response = await supabase
			.from('votes')
			.select('image_url')
			.eq('user_id', user.value.id)
			.eq('choice_id', props.id)
			.single();

		if (response.error) throw response.error;

		data.userHasVoted = Boolean(response.data.image_url);
	} catch (error: any) {
		console.log(error.message);
	}
}

function updateMatches(matchIndex: number, option?: string) {
	const match = Math.floor((length + matchIndex) / 2);
	const position = (length + matchIndex) % 2;

	data.matches[match][position] = option;
}
</script>

<style scoped>
main {
	height: 100%;
	display: grid;
	place-content: end center;
	grid-template: '📋' 1fr / 1fr;
}

form {
	grid-area: 📋;
	display: grid;
	gap: 1em;
	grid-template:
		'1️⃣' 1fr
		'2️⃣' 1fr
		'🦶' max-content
		/ 1fr;
	height: var(--windowHeight, 100vh);
	padding: 1em 1em 0;
	opacity: 1;
	transition: opacity 1.5s;
}

form:not(:last-of-type):valid,
form:invalid + form {
	opacity: 0;
	pointer-events: none;
}

form:invalid + form {
	transition: opacity 0.5s;
}

input {
	display: block;
}

[type='radio'] {
	position: fixed;
	opacity: 0;
}

.option {
	display: grid;
	place-content: center;
	min-height: 0;
	cursor: pointer;
}

.option img {
	object-fit: contain;
	min-height: 0;
	max-width: 100%;
	max-height: 100%;
	line-height: 1;
	background-color: white;
}

form:not(:last-of-type):valid :not(:checked) + img {
	opacity: 0;
}

@media (orientation: landscape) {
	form {
		grid-template:
			'1️⃣ 2️⃣' 1fr
			'🦶 🦶' max-content
			/ 1fr 1fr;
	}

	.controls {
		grid-area: 🦶;
	}
}
</style>
