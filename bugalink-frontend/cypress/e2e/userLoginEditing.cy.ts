

describe('spec.cy.js', () => {

  let email = '';
  const randomEmail = () => {
    const email = `${Math.random().toString(36).substring(2, 15)}@mail.com`;
    return email;
  };

  beforeEach(() => {
    email = randomEmail();
    cy.visit('/signup');
    cy.get('input[name="email"]').type(email);
    cy.get('input[name="name"]').type('Lorem');
    cy.get('input[name="surname"]').type('Ipsum');
    cy.get('input[name="password"]').type('1234Ejemplo?');
    cy.contains('REGISTRARSE').click();
    cy.intercept('POST', '/api/v1/auth/registration').as('register');
  });

  afterEach(() => {
    cy.clearCookies();
    cy.reload();
  });

  // Login
  it('Login Test', () => {
    cy.wait('@register');
    cy.visit('/login');
    cy.get('input[id="Correo electrónico"]').type(email);
    cy.get('input[id="Contraseña"]').type('1234Ejemplo?');
    cy.contains('INICIAR SESIÓN').click();
    cy.contains('Mis próximos viajes').should('be.visible');
  });

  // Edit Profile
  it('Edit Profile Test', () => {
    cy.wait('@register');
    cy.visit('/login');
    cy.get('input[id="Correo electrónico"]').type(email);
    cy.get('input[id="Contraseña"]').type('1234Ejemplo?');
    cy.contains('INICIAR SESIÓN').click();
    cy.get('img[alt="Profile picture"]', { timeout: 30000 }).should(
      'be.visible'
    );
    cy.get('img[alt="Profile picture"]').click();
    cy.url({ timeout: 60000 }).should('include', '/users');
    cy.get('a[href*="/edit"]', { timeout: 15000 }).click();

    // Getting the src of the profile picture of the anonymous user
    const srcPhoto = cy.get('img[alt="Profile picture"]').invoke('attr', 'src');
    cy.get('input[name="name"]', { timeout: 60000 }).clear().type('Juan');
    cy.get('input[name="surname"]').clear().type('Vásquez');
    cy.get('label[for="uploadProfilePicture"]').selectFile(
      'cypress/images/hombre.png'
    );
    cy.get('button').contains('GUARDAR').click();
    cy.url({ timeout: 60000 }).should('include', '/login');
    cy.get('input[id="Correo electrónico"]', { timeout: 10000 }).type(email);
    cy.get('input[id="Contraseña"]').type('1234Ejemplo?');
    cy.contains('INICIAR SESIÓN').click();
    cy.get('img[alt="Profile picture"]', { timeout: 30000 }).should(
      'be.visible'
    );
    cy.get('img[alt="Profile picture"]').click();
    cy.url({ timeout: 60000 }).should('include', '/users');
    cy.contains('Juan Vásquez');
    cy.get('img').should('not.have.value', srcPhoto);
  });
});
