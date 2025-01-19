// @ts-expect-error eslint-config-prettier is not typed
import eslintConfigPrettier from 'eslint-config-prettier';
// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs';

export default withNuxt({
	rules: {
		...eslintConfigPrettier.rules,
		'vue/multi-word-component-names': 'off',
		'vue/no-multiple-template-root': 'off',
	},
});
