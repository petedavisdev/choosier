import { setup, createPage, url } from '@nuxt/test-utils/e2e';
import { describe, test } from 'vitest';
import { expect } from '@nuxt/test-utils/playwright';

describe('browse categories', async () => {
	await setup();

	test('shows correct h1 and choices on each category page', async () => {
		const page = await createPage();
		await page.goto(url('/'), { waitUntil: 'hydration' });

		const choices = await page.getByTestId('choice');
		const choiceCount = await choices.count();
		await expect(choiceCount).toBeGreaterThanOrEqual(6);

		const categories = await page.getByTestId('categories-nav-item');
		const categoryCount = await categories.count();
		await expect(categoryCount).toBeGreaterThanOrEqual(4);

		for (let i = 0; i < categoryCount; i++) {
			const category = categories.nth(i);
			const categoryText = await category.textContent();
			if (!categoryText) continue;

			await category.click();
			await expect(
				page.locator(`h1:has-text("${categoryText}")`)
			).toBeVisible();

			const categoryChoices = await page.getByTestId('choice');
			const categoryChoiceCount = await categoryChoices.count();
			await expect(categoryChoiceCount).toBeGreaterThanOrEqual(1);

			await categoryChoices.nth(0).click();
			await expect(page.getByRole('heading')).toBeVisible();

			await page.goBack();

			await page.goBack();
		}
	});
});
