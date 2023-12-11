/* eslint-disable no-undef */
describe('template spec', () => {
	it('displays a list of choices', () => {
		cy.visit('/');
		cy.get('.grid a.card[href^="/"]').should('have.length.above', 2);
		cy.get('a[href="/"]').should('exist');
		cy.get('a[href="/@"]').should('exist');
		cy.get('a[href="/!"]').should('exist');
	});
});
