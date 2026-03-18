import {
  startMockServer,
  MockServerWithHandledRequests,
} from '../../mocks/server';

describe('auth', () => {
  let server: MockServerWithHandledRequests;

  beforeEach(() => {
    server = startMockServer(
      Cypress.env('API_BASE_URL'),
      'test'
    ) as MockServerWithHandledRequests;
  });

  afterEach(() => {
    server?.shutdown();
  });

  it('should be able to login', () => {
    const username = 'admin';
    const password = '12345678';

    server.create('user', { username, password });

    cy.visit('#/login');

    cy.get('input[data-cy=username]').type(username);
    cy.get('input[data-cy=password]').type(password);

    cy.get('button[type=submit]').click();

    cy.get('h1').should('contain', 'Dashboard');
  });

  it('should notify user if login fails', () => {
    cy.visit('#/login');

    cy.get('input[data-cy=username]').type('admin');
    cy.get('input[data-cy=password]').type('12345678');

    cy.get('button[type=submit]').click();

    cy.get('.q-notification.bg-negative').contains(
      'Invalid username or password'
    );
  });

  it('should not allow submitting empty form', () => {
    cy.visit('#/login');

    cy.get('button[type=submit]').click();

    cy.wait(100).and(() => {
      expect(server.pretender.handledRequests).to.be.empty;
    });
  });
});
