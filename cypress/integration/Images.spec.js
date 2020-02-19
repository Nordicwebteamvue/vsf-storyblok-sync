/// <reference types="Cypress" />

context('Images', () => {
  it('can render images', () => {
    cy.visit('images')
    cy.get('[data-testid="storyblok-page"]').find('img').should('have.length', 3)
    cy.get('[data-testid="storyblok-page"]')
      .find('img')
      .first()
      .should('have.attr', 'src')
      .should('include', 'https://img2.storyblok.com')
  })
})
