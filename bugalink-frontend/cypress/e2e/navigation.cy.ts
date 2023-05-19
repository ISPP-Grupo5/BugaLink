// https://docs.cypress.io/guides/references/best-practices#Selecting-Elements

describe('Navigation tests', () => {
  let email = '';
  let name = '';
  let surname = '';


  const randomEmail = () => {
    const email = `${Math.random().toString(36).substring(2, 15)}@mail.com`;
    return email;
  };

  //Random set of characters for the name
  const randomName = () => {
    const name = `${Math.random().toString(36).substring(2, 15)}`;
    return name;
  };

  //Random set of characters for the surname
  const randomSurname = () => {
    const surname = `${Math.random().toString(36).substring(2, 15)}`;
    return surname;
  };

  afterEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
    cy.reload();
  });

  // /chats
  it('should navigate to user chat page', () => {
    email = randomEmail();
    name = randomName();
    surname = randomSurname();
    cy.visit('/signup');
    cy.get('input[name="email"]').type(email);
    cy.get('input[name="name"]').type(name);
    cy.get('input[name="surname"]').type(surname);
    cy.get('input[name="password"]').type('1234Ejemplo?');
    cy.contains('REGISTRARSE').click();
    cy.intercept('POST', '/api/v1/auth/registration').as('register');
    cy.wait('@register');
    cy.visit('/login');
    cy.get('input[id="Correo electrónico"]').type(email);
    cy.get('input[id="Contraseña"]').type('1234Ejemplo?');
    cy.contains('INICIAR SESIÓN').click();
    cy.wait(5000);
    cy.get('img[alt="Profile picture"]', { timeout: 30000 }).should(
      'be.visible'
    );
    cy.contains('Chats').click();
    cy.url({ timeout: 60000 }).should('include', '/chats');
  });


  // /history
  it('should navigate to user history page', () => {
    cy.visit('/login');
    cy.get('input[id="Correo electrónico"]').type(email);
    cy.get('input[id="Contraseña"]').type('1234Ejemplo?');
    cy.contains('INICIAR SESIÓN').click();
    cy.wait(5000);
    cy.get('img[alt="Profile picture"]', { timeout: 30000 }).should(
      'be.visible'
    );
    cy.get('[data-cy="history-link"]').click();
    cy.url({ timeout: 60000 }).should('include', '/history');
  });


});

export {};
