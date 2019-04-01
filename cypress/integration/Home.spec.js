/// <reference types="Cypress" />

context('CI', () => {
  beforeEach(() => {
    cy.request('http://localhost:8080/api/ext/storyblok-sync/hook')
  })
  it('can render blok', () => {
    cy.visit('http://localhost:3000/ci')
    cy.contains('ci=working')
  })
})
