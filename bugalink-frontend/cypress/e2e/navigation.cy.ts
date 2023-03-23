// https://docs.cypress.io/guides/references/best-practices#Selecting-Elements

describe('Navigation tests', () => {
  it('should navigate to user profile page', () => {
    cy.visit('/');
    cy.get('[data-cy="profile-link"]').click();
    cy.location('pathname').should('match', /^\/users\/\w+$/);
  });

  it('should navigate to user routine page', () => {
    cy.visit('/');
    cy.contains('Mi horario').click();
    cy.location('pathname').should('match', /^\/users\/\w+\/routines$/);
  });

  it('should navigate to user requests page', () => {
    cy.visit('/');
    cy.contains('Solicitudes').click();
    cy.location('pathname').should(
      'match',
      /^\/users\/\w+\/requests\/pending$/
    );
  });
});

export {};
