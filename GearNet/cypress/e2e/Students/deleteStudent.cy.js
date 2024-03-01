import * as _ from '../../support/util';

describe('Delete Students', () => {

    let testStudent = _.testStudentInfo();

    before(function () {
        cy.createStudent(testStudent);
    })

    beforeEach(function () {
        cy.visit('/Students')
    })

    it('Delete Student --cancel', () => {
        // Locate the Student to be Editted
        cy.get('[data-testid="searchStudent"]').click().then(() => {
            cy.get('[data-testid="searchUsername"]').type(testStudent.Username)
            cy.get('[data-testid="searchFirstName"]').type(testStudent.FirstName)
            cy.get('[data-testid="searchLastName"]').type(testStudent.LastName)
            cy.get('[data-testid="searchStudentList"]').click().then(() => {
                cy.url({ timeout: 5000 })
                    .should('include', 'Students?');
            })
        })
        // Check info then Delete
        cy.get('[data-testid="studentListRow-1"]').then(() => {
            cy.get('[data-testid="listUsername"]').should('contain', testStudent.Username)
            cy.get('[data-testid="listFirstName"]').should('contain', testStudent.FirstName)
            cy.get('[data-testid="listLastName"]').should('contain', testStudent.LastName)
            cy.get('[data-testid^="delete-"]').click().then(() => {
                cy.url({ timeout: 5000 })
                    .should('include', 'Students/Delete/')
            })
        })

        // Check Info on Delete Confirmation
        cy.get('[data-testid="userName"]').should('contain', testStudent.Username)
        cy.get('[data-testid="firstName"]').should('contain', testStudent.FirstName)
        cy.get('[data-testid="lastName"]').should('contain', testStudent.LastName)

        // Cancel and make sure the student is still listed
        cy.get('[data-testid="cancelDelete"]').click().then(() => {
            cy.url({ timeout: 5000 })
                .should('include', 'Students')
                .and('not.include', 'Students/Delete')
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

    it('Delete Student --delete', () => {
        // Locate the Student to be Editted
        cy.get('[data-testid="searchStudent"]').click().then(() => {
            cy.get('[data-testid="searchUsername"]').type(testStudent.Username)
            cy.get('[data-testid="searchFirstName"]').type(testStudent.FirstName)
            cy.get('[data-testid="searchLastName"]').type(testStudent.LastName)
            cy.get('[data-testid="searchStudentList"]').click().then(() => {
                cy.url({ timeout: 5000 })
                    .should('include', 'Students?');
            })
        })
        // Check info then Delete
        cy.get('[data-testid="studentListRow-1"]').then(() => {
            cy.get('[data-testid="listUsername"]').should('contain', testStudent.Username)
            cy.get('[data-testid="listFirstName"]').should('contain', testStudent.FirstName)
            cy.get('[data-testid="listLastName"]').should('contain', testStudent.LastName)
            cy.get('[data-testid^="delete-"]').click().then(() => {
                cy.url({ timeout: 5000 })
                    .should('include', 'Students/Delete/')
            })
        })

        // Check Info on Delete Confirmation
        cy.get('[data-testid="userName"]').should('contain', testStudent.Username)
        cy.get('[data-testid="firstName"]').should('contain', testStudent.FirstName)
        cy.get('[data-testid="lastName"]').should('contain', testStudent.LastName)

        // Delete and ensure removal
        cy.get('[data-testid="deleteStudent"]').click().then(() => {
            cy.url({ timeout: 5000 })
                .should('include', 'Students')
                .and('not.include', 'Students/Delete')
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
        cy.get('[data-testid="studentListRow-1"]')
            .should('not.exist')
    })


})