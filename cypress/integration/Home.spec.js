/// <reference types="Cypress" />

context('CI', () => {
  it('can render blok', () => {
    cy.visit('ci')
    cy.contains('ci=working')
  })
})
