/* eslint-disable no-undef */
describe('browse categories', () => {
	it('shows correct h1 and choices on each category page', () => {
		cy.visit('/');

		cy.get('[data-cy=choice]').should('have.length.at.least', 6);
		cy.get('[data-cy=categories-nav-item]').should('have.length.at.least', 4);

		cy.get('[data-cy=categories-nav-item]').each((category) => {
			cy.visit(category.attr('href'));

			cy.get('h1').contains(category.text(), { matchCase: false });
			cy.get('[data-cy=choice]').should('have.length.at.least', 1);

			cy.get('[data-cy=choice]').each((choice) => {
				cy.visit(choice.attr('href'));

				cy.get('h1').contains(choice.text(), { matchCase: false });

				cy.go('back');
			});

			cy.go('back');
		});
	});
});
