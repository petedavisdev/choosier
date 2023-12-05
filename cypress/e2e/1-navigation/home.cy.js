describe('template spec', () => {
	it('displays a list of choices', () => {
		cy.visit('http://localhost:3000');
		cy.get('.grid a.card[href^="/"]').should('have.length.above', 2);
		cy.get('a[href="/"]').should('exist');
		cy.get('a[href="/@"]').should('exist');
		cy.get('a[href="/!"]').should('exist');
	});
});
