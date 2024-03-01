describe('Check Information Hub', () => {
    beforeEach(function () {
        cy.visit('/')
    })

    it('Information Hub', () => {
        cy.get('[data-testid="Info"]').click().then(() => {
            cy.url({ timeout: 5000 })
                .should('include', 'Information');
        });
        cy.get('[data-testid="infoHub_body"]').then(() => {
            cy.get('[data-testid="infoHub_sidebar"]').should('exist')
            cy.get('[data-testid="infoHub_content"]').should('exist')
        })
        cy.get('[data-testid="home_tab"]').click().then(() => {
            cy.get('[id="home-content"]').should('be.visible');
            cy.get('[id="acceptable-use-content"]').should('not.be.visible')
        })
        cy.get('[data-testid="acceptUse_tab"]').click().then(() => {
            cy.get('[id="acceptable-use-content"]').should('be.visible');
            cy.get('[id="home-content"]').should('not.be.visible')
        })
    })


})