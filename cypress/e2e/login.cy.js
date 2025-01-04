/* eslint-disable no-undef */
describe('login', () => {
	beforeEach(() => {
		cy.intercept(
			'POST',
			'https://fbyhdhmmctwoorirepai.supabase.co/auth/v1/otp',
			{ body: { data: 'intercepted otp request' } }
		).as('login-otp');

		cy.visit('/@');

		cy.wait(1000);
	});

	it('fails with bad email', () => {
		cy.get('[data-cy=email]').click().wait(100).type('bad-email');
		cy.get('[data-cy=submit-email]').click();
		cy.get('[data-cy=token]').should('not.exist');
	});

	it('allows retry bad token', () => {
		cy.getInput('[data-cy=email]').type('test@example.com');
		cy.get('[data-cy=submit-email]').click();
		cy.get('[data-cy=token]').should('exist');

		// enter token
		cy.getInput('[data-cy=token]').type('123456');
		cy.get('[data-cy=submit-token]').click();

		// bad code modal
		cy.get('[data-cy=enter-correct-code]').click();
		cy.get('[data-cy=enter-correct-code]').should('not.exist');
		cy.get('[data-cy=token]').should('be.empty');

		// reenter token
		cy.getInput('[data-cy=token]').type('123456');
		cy.get('[data-cy=submit-token]').click();

		// request new code
		cy.get('[data-cy=request-new-code]').click();
		cy.get('[data-cy=request-new-code]').should('not.exist');
		cy.get('[data-cy=token]').should('not.exist');
		cy.get('[data-cy=submit-email]').should('exist');
	});

	it('allows login', () => {
		cy.intercept(
			'POST',
			'https://fbyhdhmmctwoorirepai.supabase.co/auth/v1/verify',
			{ body: { data: 'intercepted verify request' } }
		).as('login-verify');

		cy.getInput('[data-cy=email]').type('test@example.com');
		cy.get('[data-cy=submit-email]').click();
		cy.get('[data-cy=token]').should('exist');

		// enter token
		cy.getInput('[data-cy=token]').type('123456');
		cy.get('[data-cy=submit-token]').click();

		cy.get('[data-cy=request-new-code]').should('not.exist');
	});
});
