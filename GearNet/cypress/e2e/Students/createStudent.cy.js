import * as _ from '../../support/util';

describe('Create Student', () => {

    let testStudent = _.testStudentInfo();

    beforeEach(function () {
        cy.visit('/Students')
    })

    it('Create Student --cancel', () => {
        // Open Create Student Page
        cy.get('[data-testid="createStudent"]').click().then(() => {
            cy.url({ timeout: 5000 })
                .should('include', 'Students/Create')
        })
        // Ensure fields are empty then input value
        cy.get('[data-testid="userName"]')
            .should('exist').should('have.value', '')
            .type(testStudent.Username)
        cy.get('[data-testid="firstName"]')
            .should('exist').should('have.value', '')
            .type(testStudent.FirstName)
        cy.get('[data-testid="lastName"]')
            .should('exist').should('have.value', '')
            .type(testStudent.LastName)

        cy.get('[data-testid="cancelCreate"]').click().then(() => {
            cy.url({ timeout: 5000 })
                .should('include', 'Students')
                .and('not.include', 'Students/Create')
        })
        cy.get('[data-testid="searchStudent"]').click().then(() => {
            cy.get('[data-testid="searchUsername"]').type(testStudent.Username)
            cy.get('[data-testid="searchFirstName"]').type(testStudent.FirstName)
            cy.get('[data-testid="searchLastName"]').type(testStudent.LastName)
            cy.get('[data-testid="searchStudentList"]').click().then(() => {
                cy.url({ timeout: 5000 })
                    .should('include', 'Students?');
            })
            cy.get('[data-testid="studentListRow-1"]').should('not.exist');
        })

    })
    it('Create Student --create', () => {
        cy.get('[data-testid="createStudent"]').click().then(() => {
            cy.url({ timeout: 5000 })
                .should('include', 'Students/Create')
        })
        // Ensure fields are empty then input value
        cy.get('[data-testid="userName"]')
            .should('exist').should('have.value', '')
            .type(testStudent.Username)
        cy.get('[data-testid="firstName"]')
            .should('exist').should('have.value', '')
            .type(testStudent.FirstName)
        cy.get('[data-testid="lastName"]')
            .should('exist').should('have.value', '')
            .type(testStudent.LastName)

        cy.get('[data-testid="createStudent"]').click().then(() => {
            cy.url({ timeout: 5000 })
                .should('include', 'Students')
                .and('not.include', 'Students/Create')
        })
        cy.get('[data-testid="searchStudent"]').click().then(() => {
            cy.get('[data-testid="searchUsername"]').type(testStudent.Username)
            cy.get('[data-testid="searchFirstName"]').type(testStudent.FirstName)
            cy.get('[data-testid="searchLastName"]').type(testStudent.LastName)
            cy.get('[data-testid="searchStudentList"]').click().then(() => {
                cy.url({ timeout: 5000 })
                    .should('include', 'Students?');
            })
        })
        cy.get('[data-testid="studentListRow-1"]').then(() => {
            cy.get('[data-testid="listUsername"]').should('contain', testStudent.Username)
            cy.get('[data-testid="listFirstName"]').should('contain', testStudent.FirstName)
            cy.get('[data-testid="listLastName"]').should('contain', testStudent.LastName)
        })
    })

    after(function () {
        cy.getStudent(testStudent.Username).then((response) => {
            testStudent.id = response.studentId
            cy.deleteStudent(testStudent.id).then(() => {
                cy.reload()
            })
        })
    });
})