/* eslint-disable no-undef */
describe('login', () => {
	beforeEach(() => {
		cy.intercept(
			'POST',
			'https://fbyhdhmmctwoorirepai.supabase.co/auth/v1/otp',
			{ body: { data: 'intercepted otp request' } }
		).as('login-otp');

		cy.intercept(
			'POST',
			'https://fbyhdhmmctwoorirepai.supabase.co/auth/v1/verify',
			{ body: { data: 'intercepted verify request' } }
		).as('login-verify');

		cy.visit('/@');
	});

	it('fails with bad email', () => {
		cy.get('[data-cy=email]').click().wait(100).type('bad-email');
		cy.get('[data-cy=submit-email]').click();
		cy.get('[data-cy=token]').should('not.exist');
	});

	it('allows login', () => {
		cy.getInput('[data-cy=email]').type('test@example.com');
		cy.get('[data-cy=submit-email]').click();
		cy.get('[data-cy=token]').should('exist');

		// enter token
		cy.getInput('[data-cy=token]').type('123456');
		cy.get('[data-cy=submit-token]').click();
	});
});
