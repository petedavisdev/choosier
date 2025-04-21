import { mountSuspended } from '@nuxt/test-utils/runtime';
import { it, expect, describe } from 'vitest';
import IconLock from './IconLock.vue';

describe('IconLock', () => {
	it('renders correctly', async () => {
		const component = await mountSuspended(IconLock);
		expect(component.html()).toContain('Private');
	});
});
