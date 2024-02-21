import * as _ from '../../support/util'

describe('Create Cases', () => {


    let testStudent = _.testStudentInfo();
    let testKase = _.testCaseInfo(testStudent.Username, 'fullSet');

    before(function () {
        cy.createStudent(testStudent)
    })

    beforeEach(function () {
        cy.visit('/Cases')
    })

    it('Create Case --cancel', () => {
        // Open Create Case Page
        cy.get('[data-testid="createCase"]').should('exist').click().then(() => {
            cy.url({ timeout: 5000 })
                .should('include', 'Cases/Create');
        })
        // Ensure fields are empty
        cy.get('[data-testid="caseName"]').should('exist').should('have.value', '');
        cy.get('[data-testid="startDate"]').should('exist').should('have.value', '');
        cy.get('[data-testid="duration"]').should('exist').should('have.value', '');
        cy.get('[data-testid="userName"]').should('exist').should('have.value', '');

        // Input case data
        cy.get('[data-testid="caseName"]').type(testKase.name)
        cy.get('[data-testid="startDate"]').type(testKase.startDate)
        cy.get('[data-testid="duration"]').type(testKase.duration)
        cy.get('[data-testid="userName"]').type(testKase.userName)

        //Cancel Input and Validate act
        cy.get('[data-testid="cancelCreate"]').click().then(() => {
            cy.url({ timeout: 5000 })
                .should('include', 'Cases')
                .and('not.include', 'Cases/Create');
        })

        cy.get('[data-testid="searchCase"]').click().then(() => {
            cy.get('[data-testid="searchCasename"]').type(testKase.name)
            cy.get('[data-testid="searchStartdate"]').type(testKase.shortShortDate)
            cy.get('[data-testid="searchDuration"]').type(testKase.duration)
            cy.get('[data-testid="searchUsername"]').type(testKase.userName)
            cy.get('[data-testid="searchCaselist"]').click().then(() => {
                cy.url({ timeout: 5000 })
                    .should('include', 'Cases?');
            })
        })

        cy.get('[data-testid="caseListRow-1"]').should('not.exist')
    })

    it('Create Case --create', () => {
        // Open Create Case Page
        cy.get('[data-testid="createCase"]').should('exist').click().then(() => {
            cy.url({ timeout: 5000 })
                .should('include', 'Cases/Create');
        })
        // Ensure fields are empty
        cy.get('[data-testid="caseName"]').should('exist').should('have.value', '');
        cy.get('[data-testid="startDate"]').should('exist').should('have.value', '');
        cy.get('[data-testid="duration"]').should('exist').should('have.value', '');
        cy.get('[data-testid="userName"]').should('exist').should('have.value', '');

        // Input case data
        cy.get('[data-testid="caseName"]').type(testKase.name)
        cy.get('[data-testid="startDate"]').type(testKase.startDate)
        cy.get('[data-testid="duration"]').type(testKase.duration)
        cy.get('[data-testid="userName"]').type(testKase.userName)

        //Confirm Creation
        cy.get('[data-testid="createCase"]').click().then(() => {
            cy.url({ timeout: 5000 })
                .should('include', 'Cases')
                .and('not.include', 'Cases/Create');
        })

        cy.get('[data-testid="searchCase"]').click().then(() => {
            cy.get('[data-testid="searchCasename"]').type(testKase.name)
            cy.get('[data-testid="searchStartdate"]').type(testKase.shortShortDate)
            cy.get('[data-testid="searchDuration"]').type(testKase.duration)
            cy.get('[data-testid="searchUsername"]').type(testKase.userName)
            cy.get('[data-testid="searchCaselist"]').click().then(() => {
                cy.url({ timeout: 5000 })
                    .should('include', 'Cases?');
            })
        })

        cy.get('[data-testid="caseListRow-1"]').then(() => {
            cy.get('[data-testid="listCasename"]').should('contain', testKase.name)
            cy.get('[data-testid="listStartdate"]').should('contain', testKase.displayDate)
            cy.get('[data-testid="listDuration"]').should('contain', testKase.duration)
            cy.get('[data-testid="listUsername"]').should('contain', testKase.userName)
        })
    })

    after(function () {
        cy.getCase({ casename: testKase.name }).then((response) => {
            testKase.id = response.caseId
            cy.deleteCase(testKase.id).then(() => {
                cy.deleteStudent(testStudent.id).then(() => {
                    cy.reload()
                })
            })
        })
    });

});