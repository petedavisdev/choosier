/* eslint-disable no-undef */
describe('vote on a choice', () => {
	it('shows 2 options at a time and allows top 2 to be submitted', () => {
		cy.visit('/1');

		cy.get('[data-cy=start]').click();

		cy.get('[data-cy=match-1]').should('have.length.at.least', 1);

		// first choice voting
		cy.get('[data-cy=match-1]').each((match) => {
			cy.wrap(match).find('[data-cy=option-image').should('have.length', 2);
			cy.wrap(match).find('[data-cy=option-image]').first().click();
		});

		// second choice voting
		cy.get('[data-cy=match-2]').each((match) => {
			cy.wrap(match).find('[data-cy=option-image').should('have.length', 2);
			cy.wrap(match).find('[data-cy=option-image]').first().click();
		});

		// confirm choices
		cy.get('[data-cy=chosen-image]').should('have.length', 2);

		// submit choices
		cy.get('[data-cy=email]').type('test@example.com');
		cy.get('[data-cy=submit-email]').click();

		// enter token
		cy.get('[data-cy=token]').type('123456');
		cy.get('[data-cy=submit-token]').click();

		// retry
		cy.get('[data-cy=retry]').click();
		cy.get('[data-cy=email]').should('have.value', '');

		// undo
		cy.get('[data-cy=undo]').click();
		cy.get('[data-cy=email]').should('not.exist');
	});
});
