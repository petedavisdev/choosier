/* eslint-disable no-undef */
describe('vote on a choice', () => {
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

		cy.visit('/');
		cy.visit('/4');
	});

	it('shows 2 options at a time and allows top 2 to be submitted', () => {
		cy.wait(1000);
		cy.get('[data-testid=start]').click();

		cy.get('[data-testid=match-1]').should('have.length.at.least', 1);

		// first choice voting
		cy.get('[data-testid=match-1]').each((match) => {
			cy.wrap(match).find('[data-testid=option-image').should('have.length', 2);
			cy.wrap(match).find('[data-testid=option-image]').first().click();
		});

		// second choice voting
		cy.get('[data-testid=match-2]').each((match) => {
			cy.wrap(match).find('[data-testid=option-image').should('have.length', 2);
			cy.wrap(match).find('[data-testid=option-image]').first().click();
		});

		// confirm choices
		cy.get('[data-testid=chosen-image]').should('have.length', 2);

		// bad email
		cy.get('[data-testid=email]').type('bad-email');
		cy.get('[data-testid=submit-email]').click();
		cy.get('[data-testid=token]').should('not.exist');

		// submit choices
		cy.get('[data-testid=email]').clear().type('test@example.com');
		cy.get('[data-testid=submit-email]').click();

		// enter token
		cy.get('[data-testid=token]').type('123456');
		cy.get('[data-testid=submit-token]').click();

		// retry
		cy.get('[data-testid=retry]').click();
		cy.get('[data-testid=email]').should('have.value', '');

		// undo
		cy.get('[data-testid=undo]').click();
		cy.get('[data-testid=email]').should('not.exist');
	});
});
