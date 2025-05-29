describe('Register Page', () => {
  beforeEach(() => {
    cy.visit('/register');
  });

  it('should register a new user with valid data', () => {
    cy.get('input[name="email"]').type('testuser@example.com');
    cy.get('input[name="username"]').type('testuser');
    cy.get('input[name="password"]').type('securePassword123');

    cy.get('form').submit();

    cy.url().should('include', '/posts');
  });

  it('should show error message on invalid submission (missing fields)', () => {
    cy.get('form').submit();

    cy.contains('Something went wrong! Please verify credentials and try again.').should('be.visible');
  });

  it('should clear fields after successful registration', () => {
    cy.get('input[name="email"]').type('testclear@example.com');
    cy.get('input[name="username"]').type('testclear');
    cy.get('input[name="password"]').type('12345678');

    cy.get('form').submit();

    cy.url().should('include', '/posts');

    cy.visit('/register');
    cy.get('input[name="email"]').should('have.value', '');
    cy.get('input[name="username"]').should('have.value', '');
    cy.get('input[name="password"]').should('have.value', '');
  });
});
