describe('userLoginEditing.cy.js', () => {
  let email = '';
  const randomEmail = () => {
    const email = `${Math.random().toString(36).substring(2, 15)}@mail.com`;
    return email;
  };

  afterEach(() => {
    cy.clearAllCookies();
    cy.clearLocalStorage();
    cy.reload();
  });

  it('Initial Config', () => {
    email = randomEmail();
    cy.visit('/signup');
    cy.get('input[name="email"]').type(email);
    cy.get('input[name="name"]').type('Lorem');
    cy.get('input[name="surname"]').type('Ipsum');
    cy.get('input[name="password"]').type('1234Ejemplo?');
    cy.contains('REGISTRARSE').click();
    cy.intercept('POST', '/api/v1/auth/registration').as('register');
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
    cy.get('a[href="/become-driver"]').click();
    cy.url({ timeout: 60000 }).should('include', '/become-driver');
    cy.get('label[for="Declaración jurada"]')
      .find('input[type="file"]')
      .selectFile('cypress/images/hombre.png', { force: true });
    cy.wait(10000);
    cy.get('label[for="Carnet de conducir"]')
      .find('input[type="file"]')
      .selectFile('cypress/images/hombre.png', { force: true });
    cy.wait(10000);
    cy.get('label[for="Documento de identidad (anverso)"]')
      .find('input[type="file"]')
      .selectFile('cypress/images/hombre.png', { force: true });
    cy.wait(10000);
  });

  it('Routine Creation Test', () => {
    cy.visit('/login');
    cy.get('input[id="Correo electrónico"]').type(email);
    cy.get('input[id="Contraseña"]').type('1234Ejemplo?');
    cy.contains('INICIAR SESIÓN').click();
    cy.wait(10000);
    cy.get('a[href="/routines"]', { timeout: 60000 }).click();
    cy.url({ timeout: 60000 }).should('include', '/routines');
    cy.get('button[data-cy="add-routine-menu"]').click();
    cy.get('a[href="/routines/driver/new"]').click();
    cy.url({ timeout: 60000 }).should('include', '/new');
    cy.get('input[name="origin"]').type('Dos Her');
    cy.get('strong').contains('Dos Hermanas').click();
    cy.get('input[name="destination"]').type('C. Genaro');
    cy.get('strong').contains('C. Genaro Parladé').click();
    cy.get('p[data-cy="Mon"]').click();
    cy.get('input[type="checkbox"]').click();
    cy.get('input[type="number"]').type('1.2');
    cy.get('textarea').type('This is a sample description');
    cy.wait(2000);
    cy.get('button[data-cy="submit"]').click();
    cy.intercept('POST', '/api/v1/driver-routines').as('driver-routines');
    cy.wait('@driver-routines');
    cy.get('button[data-cy="Close"]').click();
    cy.url({ timeout: 60000 }).should('include', '/routines');
    cy.contains('Dos Hermanas');
  });

  it('Routine Edition Test', () => {
    cy.visit('/login');
    cy.get('input[id="Correo electrónico"]').type(email);
    cy.get('input[id="Contraseña"]').type('1234Ejemplo?');
    cy.contains('INICIAR SESIÓN').click();
    cy.wait(2000);
    cy.get('a[href="/routines"]', { timeout: 30000 }).click();
    cy.url({ timeout: 60000 }).should('include', '/routines');
    cy.wait(4000);
    cy.get('svg[aria-label="more"]').click();
    cy.get('p[data-cy="edit"]').click();
    cy.url({ timeout: 60000 }).should('include', '/new');
    cy.wait(8000);
    cy.get('input[name="origin"]').type('Utr');
    cy.get('strong').contains('Utrera').click();
    cy.wait(4000);
    cy.get('input[type="number"]').clear().type('1.1');
    cy.get('button[data-cy="submit"]').click();
    cy.get('button[data-cy="Close"]').click();
    cy.url({ timeout: 60000 }).should('include', '/routines');
    cy.contains('Utrera');
  });
});

export {};
