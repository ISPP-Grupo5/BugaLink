// https://docs.cypress.io/guides/references/best-practices#Selecting-Elements

describe('Navigation tests', () => {
  // /users/<userId>
  it('should navigate to user profile page', () => {
    cy.visit('/');
    cy.get('[data-cy="profile-link"]').click();
    cy.location('pathname').should('match', /^\/users\/[\w-]+$/);
  });

  // /routines
  it('should navigate to user routine page', () => {
    cy.visit('/');
    cy.contains('Mi horario').click();
    cy.location('pathname').should('match', /^\/routines$/);
  });

  // /chats
  it('should navigate to user routine page', () => {
    cy.visit('/');
    cy.contains('Chats').click();
    cy.location('pathname').should('match', /^\/$/);
  });

  // /requests/pending
  it('should navigate to user requests page', () => {
    cy.visit('/');
    cy.contains('Solicitudes').click();
    cy.location('pathname').should('match', /^\/requests\/pending$/);
  });
  // /search/result
  it('should navigate to search page', () => {
    cy.visit('/');
    cy.get('[data-cy="search-btn"]').click();
    cy.location('pathname').should('match', /^\/search\/result$/);
  });

  // /history
  it('should navigate to user history page', () => {
    cy.visit('/');
    cy.get('[data-cy="history-link"]').click();
    cy.location('pathname').should('match', /^\/history$/);
  });

  // /request/<userId>/accept
  it('should navigate to request accept page', () => {
    cy.visit('/requests/pending');
    cy.get('[data-cy="request-accept"]').click();
    cy.location('pathname').should('match', /^\/request\/[\w-]+\/accept$/);
  });

  // /ride/<rideId>/detailsOne
  it('should navigate to ride details one page', () => {
    cy.visit('/');
    cy.get('[data-cy="ride-details"]').first().click();
    cy.location('pathname').should('match', /^\/ride\/[\w-]+\/detailsOne$/);
  });

  // /ride/<rideId>/detailsTwo
  it('should navigate to ride details two page', () => {
    cy.visit('/ride/1/detailsOne?requested=false');
    cy.get('button').contains('CONTINUAR').click();
    cy.location('pathname').should('match', /^\/ride\/[\w-]+\/detailsTwo$/);
  });

  // /ride/<rideId>/map
  it('should navigate to ride map page', () => {
    cy.visit('/ride/1/detailsOne?requested=false');
    cy.get('[data-cy="map-link"]').click();
    cy.location('pathname').should('match', /^\/ride\/[-\w]+\/map$/);
  });

  // TODO: login flow test
  // /login
  // it('should navigate to login page', () => {
  //   cy.visit('/');
  //   cy.get('[data-cy="login-link"]').click();
  //   cy.location('pathname').should('match', /^\/login$/);
  // });

  // TODO: register flow test
  // /signup
  // it('should navigate to register page', () => {
  //   cy.visit('/');
  //   cy.get('[data-cy="register-link"]').click();
  //   cy.location('pathname').should('match', /^\/signup$/);
  // });

  // TODO: unaccessible yet
  // /users/<userId>/rating/new
  // it('should navigate to new rating page', () => {
  //   cy.visit('/');
  //   cy.get('[data-cy="new-rating"]').click();
  //   cy.location('pathname').should('match', /^\/users\/\w+\/rating\/new$/);
  // });

  // /routines/driver/new
  it('should navigate to new driver routine page', () => {
    cy.visit('/routines');
    cy.get('[data-cy="add-routine-menu"]').click();
    cy.get('[data-cy="new-driver-routine"]').click();
    cy.location('pathname').should('match', /^\/routines\/driver\/new$/);
  });

  // /routines/passenger/new
  it('should navigate to new passenger routine page', () => {
    cy.visit('/routines');
    cy.get('[data-cy="add-routine-menu"]').click();
    cy.get('[data-cy="new-passenger-routine"]').click();
    cy.location('pathname').should('match', /^\/routines\/passenger\/new$/);
  });
});

export {};
