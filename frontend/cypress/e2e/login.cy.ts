describe('template spec', () => {
  it('passes', () => {
    cy.visit('/login')
    cy.get('.text-7xl', { timeout: 100000 }).should('be.visible') 
    cy.wait(300)
    cy.get('#username').type("hello")
  })
})
