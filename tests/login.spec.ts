import { setup, createPage, url } from '@nuxt/test-utils/e2e';
import { describe, test } from 'vitest';
import { expect } from '@nuxt/test-utils/playwright';

async function interceptOtp(page: any) {
	await page.route(
		'https://fbyhdhmmctwoorirepai.supabase.co/auth/v1/otp',
		(route) => {
			route.fulfill({
				body: JSON.stringify({ data: 'intercepted otp request' }),
			});
		}
	);
}

/* eslint-disable no-undef */
describe('login', async () => {
	await setup();

	test('fails with bad email', async () => {
		const page = await createPage();
		await interceptOtp(page);
		await page.goto(url('/@'), { waitUntil: 'hydration' });

		await page.getByTestId('email').fill('bad-email');
		await page.getByTestId('submit-email').click();
		await expect(page.getByTestId('token')).not.toBeVisible();
	});

	test('allows retry bad token', async () => {
		const page = await createPage();
		await interceptOtp(page);
		await page.goto(url('/@'), { waitUntil: 'hydration' });

		await page.getByTestId('email').fill('test@example.com');
		await page.getByTestId('submit-email').click();
		await expect(page.getByTestId('token')).toBeVisible();

		// enter token
		await page.getByTestId('token').fill('123456');
		await page.getByTestId('submit-token').click();

		// bad code modal
		await page.getByTestId('enter-correct-code').click();
		await expect(page.getByTestId('enter-correct-code')).not.toBeVisible();
		await expect(page.getByTestId('token')).toBeEmpty();

		// reenter token
		await page.getByTestId('token').fill('123456');
		await page.getByTestId('submit-token').click();

		// request new code
		await page.getByTestId('request-new-code').click();
		await expect(page.getByTestId('request-new-code')).not.toBeVisible();
		await expect(page.getByTestId('token')).not.toBeVisible();
		await expect(page.getByTestId('submit-email')).toBeVisible();
	});

	test('allows login', async () => {
		const page = await createPage();
		await interceptOtp(page);
		await page.goto(url('/@'), { waitUntil: 'hydration' });

		await page.route(
			'https://fbyhdhmmctwoorirepai.supabase.co/auth/v1/verify',
			(route) => {
				route.fulfill({
					body: JSON.stringify({ data: 'intercepted verify request' }),
				});
			}
		);
		await page.getByTestId('email').fill('test@example.com');
		await page.getByTestId('submit-email').click();
		await expect(page.getByTestId('token')).toBeVisible();

		// enter token
		await page.getByTestId('token').fill('123456');
		await page.getByTestId('submit-token').click();
		await expect(page.getByTestId('request-new-code')).not.toBeVisible();
	});
});
