/// <reference types="Cypress" />

context('CI', () => {
  it('can render blok', () => {
    cy.visit('http://localhost:3000/ci')
    cy.contains('ci=working')
  })
})
