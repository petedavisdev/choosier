/* eslint-disable no-undef */
describe('vote on a choice', () => {
	beforeEach(() => {
		// cy.intercept(
		// 	'GET',
		// 	'https://fbyhdhmmctwoorirepai.supabase.co/rest/v1/choices?select=visibility&id=eq.0',
		// 	{ body: { visibility: 'promoted' } }
		// ).as('get-choice-visibility');

		// cy.intercept(
		// 	'GET',
		// 	'https://fbyhdhmmctwoorirepai.supabase.co/rest/v1/choices?select=profiles%21choices_user_id_fkey%28username%29%2Ctitle%2Cimage_urls%2Ccategory%2Ccreated_at%2Cclose_at%2Cremove_at%2Cvotes%28image_urls%2Cuser_id%2Cprofiles%28username%2Cfirst_vote%29%29%2Cuuid%2Cvisibility%2Cvoting_system&id=eq.0',
		// 	{ fixture: 'choice_0.json' }
		// ).as('get-choice');

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

		// cy.visit('/0');
		cy.visit('/1');
	});

	it('shows 2 options at a time and allows top 2 to be submitted', () => {
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

		// bad email
		cy.getInput('[data-cy=email]').type('bad-email');
		cy.get('[data-cy=submit-email]').click();
		cy.get('[data-cy=token]').should('not.exist');

		// submit choices
		cy.getInput('[data-cy=email]').clear().type('test@example.com');
		cy.get('[data-cy=submit-email]').click();

		// enter token
		cy.getInput('[data-cy=token]').type('123456');
		cy.get('[data-cy=submit-token]').click();

		// retry
		cy.get('[data-cy=retry]').click();
		cy.get('[data-cy=email]').should('have.value', '');

		// undo
		cy.get('[data-cy=undo]').click();
		cy.get('[data-cy=email]').should('not.exist');
	});
});
