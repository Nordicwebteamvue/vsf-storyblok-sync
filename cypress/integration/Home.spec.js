/// <reference types="Cypress" />

context('CI', () => {
  it('can render blok', () => {
    cy.visit('ci')
    cy.contains('ci=working')
    cy.get('a').first().click()
    cy.contains('ci=startpage')
  })

  it('redirects to 404 page', () => {
    cy.visit('dead-link')
  cy.url().should('contain', '/page-not-found')
  })
})
