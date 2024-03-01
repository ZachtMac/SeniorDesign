describe('Check Navigation Works', () => {

    beforeEach(function () {
        cy.visit('/')
    })

    it('passes', () => {
        cy.get('[data-testid="Home"]').click();
        cy.get('[data-testid="launchPage"]').should('exist');
    })

    it('Information Hub', () => {
        cy.get('[data-testid="Info"]').click().then(() => {
            cy.url({ timeout: 5000 })
                .should('include', 'Information');
        });
    })

    it('Cases', () => {
        cy.get('[data-testid="Cases"]').click().then(() => {
            cy.url({ timeout: 5000 })
                .should('include', 'Cases');
        }); 
    })

    it('Device Booking', () => {
        cy.get('[data-testid="Booking"]').click().then(() => {
            cy.url({ timeout: 5000 })
                .should('include', 'Cases/CaseSelection');
        });
    })

    it('Devices - Admin', () => {
        cy.get('[data-testid="Devices"]').click().then(() => {
            cy.url({ timeout: 5000 })
                .should('include', 'Devices');
        });
    })

    it('Students - Admin', () => {
        cy.get('[data-testid="Students"]').click().then(() => {
            cy.url({ timeout: 5000 })
                .should('include', 'Students');
        });
    })
})