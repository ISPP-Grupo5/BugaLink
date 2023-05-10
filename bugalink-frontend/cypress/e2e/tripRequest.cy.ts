describe('template spec', () => {
  let email = '';
  let email2 = '';

  let name = '';
  let surname = '';

  let name2 = '';
  let surname2 = '';

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


  it('Initial Config', () => {
    email = randomEmail();
    email2 = randomEmail();
    name = randomName();
    surname = randomSurname();
    name2 = randomName();
    surname2 = randomSurname();
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
  });

  it('Solicitar', () => {
    cy.visit('/signup');
    cy.get('input[name="email"]').type(email2);
    cy.get('input[name="name"]').type(name2);
    cy.get('input[name="surname"]').type(surname2);
    cy.get('input[name="password"]').type('1234Ejemplo?');
    cy.contains('REGISTRARSE').click();
    cy.intercept('POST', '/api/v1/auth/registration').as('register');
    cy.wait('@register');
    cy.wait(15000);
    cy.visit('http://127.0.0.1:8000/admin');
    cy.get('input[name="username"]').type('superuser@mail.com');
    cy.get('input[name="password"]').type('4dm1n');
    cy.get('input[type="submit"]').click();
    cy.wait(2000);
    cy.get('a').contains("Balances").click();
    cy.get('a').contains("Balance object").first().click();
    cy.get('input[name="amount"]').clear().type('10');
    cy.get('input[name="_save"]').click();
    cy.wait(2000);
    cy.visit('/');
    cy.get('input[type="search"]').type('C. Genaro');
    cy.get('strong').contains('C. Genaro Parladé').click();
    cy.wait(2000);
    cy.get('button[data-cy="search-btn"]').click();
    cy.url({ timeout: 60000 }).should('include', '/search');
    cy.wait(8000);
    cy.get('input[value="Mi ubicación"]').clear().type('Dos Her');
    cy.get('strong').contains('Dos Hermanas').click();
    cy.wait(10000);
    const string = "" + name.toString();
    cy.contains('p', string).click();
    cy.wait(8000);
    cy.get('button', {timeout: 60000}).contains('SOLICITAR').should('be.visible')
    cy.get('button[data-cy="submit"]').click();
    cy.url({ timeout: 60000 }).should('include', '/pay');
    cy.wait(5000);
    cy.get('p[data-cy="Saldo"]').click();
    cy.wait(2000);
  });

  it('Aceptar', () => {
    cy.visit('/login');
    cy.get('input[id="Correo electrónico"]').type(email);
    cy.get('input[id="Contraseña"]').type('1234Ejemplo?');
    cy.contains('INICIAR SESIÓN').click();
    cy.get('img[alt="Profile picture"]', { timeout: 30000 }).should(
      'be.visible'
    );
    cy.wait(60000);
    cy.get("a[href='/requests/pending']").click();
    cy.wait(5000);
    const string = "" + name2.toString();
    cy.contains('p', string).click();
    cy.wait(10000);
    cy.get('button[data-cy="submit"]').click();
  });

})

export {};