import * as _ from '../../support/util';

describe('Delete Cases', () => {

    let testStudent = _.testStudentInfo();
    let testKase = _.testCaseInfo(testStudent.Username);

    describe('Delete Case', () => {

        before(function () {
            cy.createStudent(testStudent).then(() => {
                cy.createCase(testKase)
            })
        })

        beforeEach(function () {
            cy.visit('/Cases')
        })


        it('Delete Case --cancel', () => {
            // Locate Test Case
            cy.get('[data-testid="searchCase"]').click().then(() => {
                cy.get('[data-testid="searchCasename"]').type(testKase.Casename)
                cy.get('[data-testid="searchUsername"]').type(testKase.Username)
                cy.get('[data-testid="searchCaselist"]').click().then(() => {
                    cy.url({ timeout: 5000 })
                        .should('include', 'Cases?');
                })
            })
            cy.get('[data-testid="caseListRow-1"]').then(() => {
                cy.get('[data-testid="listCasename"]').should('contain', testKase.Casename)
                cy.get('[data-testid="listUsername"]').should('contain', testKase.Username)
                cy.get('[data-testid^="delete-"]').click().then(() => {
                    cy.url({ timeout: 5000 })
                        .should('include', 'Cases/Delete')
                    // Cancel Delete
                    cy.get('[data-testid="cancelDelete"]').click().then(() => {
                        cy.url({ timeout: 5000 })
                            .should('include', 'Cases')
                            .and('not.include', 'Cases/Delete');
                    })
                })
            });
            // Ensure case still exists
            cy.get('[data-testid="searchCase"]').click().then(() => {
                cy.get('[data-testid="searchCasename"]').type(testKase.Casename)
                cy.get('[data-testid="searchUsername"]').type(testKase.Username)
                cy.get('[data-testid="searchCaselist"]').click().then(() => {
                    cy.url({ timeout: 5000 })
                        .should('include', 'Cases?');
                })
                cy.get('[data-testid="caseListRow-1"]').then(() => {
                    cy.get('[data-testid="listCasename"]').should('contain', testKase.Casename)
                    cy.get('[data-testid="listUsername"]').should('contain', testKase.Username)
                })
            })
        })

        it('Delete Case --delete', () => {
            // Locate Test Case
            cy.get('[data-testid="searchCase"]').click().then(() => {
                cy.get('[data-testid="searchCasename"]').type(testKase.Casename)
                cy.get('[data-testid="searchUsername"]').type(testKase.Username)
                cy.get('[data-testid="searchCaselist"]').click().then(() => {
                    cy.url({ timeout: 5000 })
                        .should('include', 'Cases?');
                })
            })
            cy.get('[data-testid="caseListRow-1"]').then(() => {
                cy.get('[data-testid="listCasename"]').should('contain', testKase.Casename)
                cy.get('[data-testid="listUsername"]').should('contain', testKase.Username)
                cy.get('[data-testid^="delete-"]').click().then(() => {
                    cy.url({ timeout: 5000 })
                        .should('include', 'Cases/Delete')
                    // Confirm Delete
                    cy.get('[data-testid="confirmDelete"]').click().then(() => {
                        cy.url({ timeout: 5000 })
                            .should('include', 'Cases')
                            .and('not.include', 'Cases/Delete');
                    })
                })
            });
            // Ensure case is gone
            cy.get('[data-testid="searchCase"]').click().then(() => {
                cy.get('[data-testid="searchCasename"]').type(testKase.Casename)
                cy.get('[data-testid="searchUsername"]').type(testKase.Username)
                cy.get('[data-testid="searchCaselist"]').click().then(() => {
                    cy.url({ timeout: 5000 })
                        .should('include', 'Cases?');
                })
                cy.get('[data-testid="caseListRow-1"]').should('not.exist');

            })
        })

        after(function () {
            cy.deleteStudent(testStudent.id).then(() => {
                cy.reload()
            })
        })
    });

})