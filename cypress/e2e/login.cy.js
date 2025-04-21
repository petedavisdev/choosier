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
		cy.get('[data-testid=email]').click().wait(100).type('bad-email');
		cy.get('[data-testid=submit-email]').click();
		cy.get('[data-testid=token]').should('not.exist');
	});

	it('allows retry bad token', () => {
		cy.get('[data-testid=email]').type('test@example.com');
		cy.get('[data-testid=submit-email]').click();
		cy.get('[data-testid=token]').should('exist');

		// enter token
		cy.get('[data-testid=token]').type('123456');
		cy.get('[data-testid=submit-token]').click();

		// bad code modal
		cy.get('[data-testid=enter-correct-code]').click();
		cy.get('[data-testid=enter-correct-code]').should('not.exist');
		cy.get('[data-testid=token]').should('be.empty');

		// reenter token
		cy.get('[data-testid=token]').type('123456');
		cy.get('[data-testid=submit-token]').click();

		// request new code
		cy.get('[data-testid=request-new-code]').click();
		cy.get('[data-testid=request-new-code]').should('not.exist');
		cy.get('[data-testid=token]').should('not.exist');
		cy.get('[data-testid=submit-email]').should('exist');
	});

	it('allows login', () => {
		cy.intercept(
			'POST',
			'https://fbyhdhmmctwoorirepai.supabase.co/auth/v1/verify',
			{ body: { data: 'intercepted verify request' } }
		).as('login-verify');

		cy.get('[data-testid=email]').type('test@example.com');
		cy.get('[data-testid=submit-email]').click();
		cy.get('[data-testid=token]').should('exist');

		// enter token
		cy.get('[data-testid=token]').type('123456');
		cy.get('[data-testid=submit-token]').click();

		cy.get('[data-testid=request-new-code]').should('not.exist');
	});
});
