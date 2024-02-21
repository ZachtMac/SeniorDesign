import * as _ from '../../support/util';

describe('Edit Cases', () => {

    let testStudent1 = _.testStudentInfo();
    let testKase1 = _.testCaseInfo(testStudent1.Username, 'fullSet');

    let testStudent2 = _.testStudentInfo();
    let testKase2 = _.testCaseInfo(testStudent2.Username, 'fullSet');


    // Create Case to Test Editting
    before(function () {
        cy.createStudent(testStudent1).then(() => {
            cy.createCase(_.caseInfoStrip(testKase1)).then((response) => {
                const { caseId } = response.body
                testKase1.id = caseId
                testKase2.id = caseId
            })
        })
        cy.createStudent(testStudent2)
    })

    beforeEach(function () {
        // Navigate to Create Case 
        cy.visit('/Cases')
    })

    it('Edit Case by Edit Button --cancel', () => {
        // Locate Test Case
        cy.get('[data-testid="searchCase"]').click().then(() => {
            cy.get('[data-testid="searchCasename"]').type(testKase1.name)
            cy.get('[data-testid="searchStartdate"]').type(testKase1.shortShortDate)
            cy.get('[data-testid="searchDuration"]').type(testKase1.duration)
            cy.get('[data-testid="searchUsername"]').type(testKase1.userName)
            cy.get('[data-testid="searchCaselist"]').click().then(() => {
                cy.url({ timeout: 5000 })
                    .should('include', 'Cases?');
            })
        })
        cy.get('[data-testid="caseListRow-1"]').then(() => {
            cy.get('[data-testid="listCasename"]').should('contain', testKase1.name)
            cy.get('[data-testid="listStartdate"]').should('contain', testKase1.displayDate)
            cy.get('[data-testid="listDuration"]').should('contain', testKase1.duration)
            cy.get('[data-testid="listUsername"]').should('contain', testKase1.userName)
            cy.get('[data-testid^="edit-"]').click().then(() => {
                cy.url({ timeout: 5000 })
                    .should('include', 'Cases/Edit/');
                cy.get('[data-testid="editCasename"]').clear().type(testKase2.name)
                cy.get('[data-testid="editStartDate"]').clear().type(testKase2.startDate)
                cy.get('[data-testid="editDuration"]').clear().type(testKase2.duration)
                cy.get('[data-testid="editUsername"]').clear().type(testKase2.userName)

            })
            // Ensure Details didn't change
            cy.get('[data-testid="cancelEdit"]').click().then(() => {
                cy.url({ timeout: 5000 })
                    .should('include', 'Cases/Details/');
                cy.get('[data-testid="detailCasename"]').should('contain', testKase1.name)
                cy.get('[data-testid="detailStartDate"]').should('contain', testKase1.displayDate)
                cy.get('[data-testid="detailDuration"]').should('contain', testKase1.duration)
                cy.get('[data-testid="detailUsername"]').should('contain', testKase1.userName)
                cy.get('[data-testid="backList"]').click().then(() => {
                    cy.url({ timeout: 5000 })
                        .should('include', 'Cases')
                        .and('not.include', 'Cases/Details/')
                })
            })
            // Search List
            cy.get('[data-testid="searchCase"]').click().then(() => {
                cy.get('[data-testid="searchCasename"]').type(testKase1.name)
                cy.get('[data-testid="searchStartdate"]').type(testKase1.shortShortDate)
                cy.get('[data-testid="searchDuration"]').type(testKase1.duration)
                cy.get('[data-testid="searchUsername"]').type(testKase1.userName)
                cy.get('[data-testid="searchCaselist"]').click().then(() => {
                    cy.url({ timeout: 5000 })
                        .should('include', 'Cases?');
                })
                // Ensure Case List didn't change
                cy.get('[data-testid="caseListRow-1"]').then(() => {
                    cy.get('[data-testid="listCasename"]').should('contain', testKase1.name)
                    cy.get('[data-testid="listStartdate"]').should('contain', testKase1.displayDate)
                    cy.get('[data-testid="listDuration"]').should('contain', testKase1.duration)
                    cy.get('[data-testid="listUsername"]').should('contain', testKase1.userName)
                })
            })
        })


    })

    it('Edit Case by Edit Button --edit', () => {
        // Locate Test Case
        cy.get('[data-testid="searchCase"]').click().then(() => {
            cy.get('[data-testid="searchCasename"]').type(testKase1.name)
            cy.get('[data-testid="searchStartdate"]').type(testKase1.shortShortDate)
            cy.get('[data-testid="searchDuration"]').type(testKase1.duration)
            cy.get('[data-testid="searchUsername"]').type(testKase1.userName)
            cy.get('[data-testid="searchCaselist"]').click().then(() => {
                cy.url({ timeout: 5000 })
                    .should('include', 'Cases?');
            })
        })
        cy.get('[data-testid="caseListRow-1"]').then(() => {
            cy.get('[data-testid="listCasename"]').should('contain', testKase1.name)
            cy.get('[data-testid="listStartdate"]').should('contain', testKase1.displayDate)
            cy.get('[data-testid="listDuration"]').should('contain', testKase1.duration)
            cy.get('[data-testid="listUsername"]').should('contain', testKase1.userName)
            cy.get('[data-testid^="edit-"]').click().then(() => {
                cy.url({ timeout: 5000 })
                    .should('include', 'Cases/Edit/');
                cy.get('[data-testid="editCasename"]').clear().type(testKase2.name)
                cy.get('[data-testid="editStartDate"]').clear().type(testKase2.startDate)
                cy.get('[data-testid="editDuration"]').clear().type(testKase2.duration)
                cy.get('[data-testid="editUsername"]').clear().type(testKase2.userName)

            })
            // Ensure Details Successfully Changed
            cy.get('[data-testid="editCase"]').click().then(() => {
                cy.url({ timeout: 5000 })
                    .should('include', 'Cases');
            })
            // Search List
            cy.get('[data-testid="searchCase"]').click().then(() => {
                cy.get('[data-testid="searchCasename"]').type(testKase2.name)
                cy.get('[data-testid="searchStartdate"]').type(testKase2.shortShortDate)
                cy.get('[data-testid="searchDuration"]').type(testKase2.duration)
                cy.get('[data-testid="searchUsername"]').type(testKase2.userName)
                cy.get('[data-testid="searchCaselist"]').click().then(() => {
                    cy.url({ timeout: 5000 })
                        .should('include', 'Cases?');
                })
                // Ensure Case List Successfully Changed
                cy.get('[data-testid="caseListRow-1"]').then(() => {
                    cy.get('[data-testid="listCasename"]').should('contain', testKase2.name)
                    cy.get('[data-testid="listStartdate"]').should('contain', testKase2.displayDate)
                    cy.get('[data-testid="listDuration"]').should('contain', testKase2.duration)
                    cy.get('[data-testid="listUsername"]').should('contain', testKase2.userName)
                })
                cy.get('[data-testid^="details-"]').click().then(() => {
                    cy.url({ timeout: 5000 })
                        .should('include', 'Cases/Details/')
                    cy.get('[data-testid="detailCasename"]').should('contain', testKase2.name)
                    cy.get('[data-testid="detailStartDate"]').should('contain', testKase2.displayDate)
                    cy.get('[data-testid="detailDuration"]').should('contain', testKase2.duration)
                    cy.get('[data-testid="detailUsername"]').should('contain', testKase2.userName)
                    cy.get('[data-testid="backList"]').click().then(() => {
                        cy.url({ timeout: 5000 })
                            .should('include', 'Cases')
                            .and('not.include', 'Cases/Details/')
                    })
                })
            })
        })


    })

    after(function () {
        cy.deleteCase(testKase2.id).then(() => {
            cy.deleteStudent(testStudent2.id).then(() => {
                cy.deleteStudent(testStudent1.id)
                cy.reload()
            })
        })
    });

});