/* eslint-disable no-undef */

// workaround for type issue https://github.com/cypress-io/cypress/issues/3817
Cypress.Commands.add('getInput', (selector) => {
	return cy.get(selector).click().type('x').clear();
});
