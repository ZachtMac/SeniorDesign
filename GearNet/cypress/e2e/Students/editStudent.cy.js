import * as _ from '../../support/util';

describe('Edit Students', () => {

    let testStudent1 = _.testStudentInfo();
    let testStudent2 = _.testStudentInfo();

    before(function () {
        cy.createStudent(testStudent1).then((response) => {
            const { studentId } = response.body
            testStudent1.id = studentId;
            testStudent2.id = studentId;
        })
    })

    beforeEach(function () {
        cy.visit('/Students')
    })

    it('Edit Student by Edit Button --cancel', () => {
        // Locate the Student to be Editted
        cy.get('[data-testid="searchStudent"]').click().then(() => {
            cy.get('[data-testid="searchUsername"]').type(testStudent1.Username)
            cy.get('[data-testid="searchFirstName"]').type(testStudent1.FirstName)
            cy.get('[data-testid="searchLastName"]').type(testStudent1.LastName)
            cy.get('[data-testid="searchStudentList"]').click().then(() => {
                cy.url({ timeout: 5000 })
                    .should('include', 'Students?');
            })
        })
        // Check the current information to compare against
        cy.get('[data-testid="studentListRow-1"]').then(() => {
            cy.get('[data-testid="listUsername"]').should('contain', testStudent1.Username)
            cy.get('[data-testid="listFirstName"]').should('contain', testStudent1.FirstName)
            cy.get('[data-testid="listLastName"]').should('contain', testStudent1.LastName)
            cy.get('[data-testid^="edit-"]').click().then(() => {
                cy.url({ timeout: 5000 })
                    .should('include', 'Students/Edit/')
            })
        })

        // Edit the information
        cy.get('[data-testid="userName"]')
            .clear().type(testStudent2.Username)
        cy.get('[data-testid="firstName"]')
            .clear().type(testStudent2.FirstName)
        cy.get('[data-testid="lastName"]')
            .clear().type(testStudent2.LastName)


        //Cancel and ensure no changes occured on Detail Page
        cy.get('[data-testid="cancelEdit"]').click().then(() => {
            cy.url({ timeout: 5000 })
                .should('include', 'Students')
                .and('not.include', 'Students/Edit/')
        })
        cy.get('[data-testid="userName"]').should('contain', testStudent1.Username)
        cy.get('[data-testid="firstName"]').should('contain', testStudent1.FirstName)
        cy.get('[data-testid="lastName"]').should('contain', testStudent1.LastName)
    })

    it('Edit Student by Edit Button --cancel', () => {
        // Locate the Student to be Editted
        cy.get('[data-testid="searchStudent"]').click().then(() => {
            cy.get('[data-testid="searchUsername"]').type(testStudent1.Username)
            cy.get('[data-testid="searchFirstName"]').type(testStudent1.FirstName)
            cy.get('[data-testid="searchLastName"]').type(testStudent1.LastName)
            cy.get('[data-testid="searchStudentList"]').click().then(() => {
                cy.url({ timeout: 5000 })
                    .should('include', 'Students?');
            })
        })
        // Check the current information to compare against
        cy.get('[data-testid="studentListRow-1"]').then(() => {
            cy.get('[data-testid="listUsername"]').should('contain', testStudent1.Username)
            cy.get('[data-testid="listFirstName"]').should('contain', testStudent1.FirstName)
            cy.get('[data-testid="listLastName"]').should('contain', testStudent1.LastName)
            cy.get('[data-testid^="edit-"]').click().then(() => {
                cy.url({ timeout: 5000 })
                    .should('include', 'Students/Edit/')
            })
        })

        // Edit the information
        cy.get('[data-testid="userName"]')
            .clear().type(testStudent2.Username)
        cy.get('[data-testid="firstName"]')
            .clear().type(testStudent2.FirstName)
        cy.get('[data-testid="lastName"]')
            .clear().type(testStudent2.LastName)


        //Submit and validate changes
        cy.get('[data-testid="editStudent"]').click().then(() => {
            cy.url({ timeout: 5000 })
                .should('include', 'Students')
                .and('not.include', 'Students/Edit/')
        })
        cy.get('[data-testid="searchStudent"]').click().then(() => {
            cy.get('[data-testid="searchUsername"]').type(testStudent2.Username)
            cy.get('[data-testid="searchFirstName"]').type(testStudent2.FirstName)
            cy.get('[data-testid="searchLastName"]').type(testStudent2.LastName)
            cy.get('[data-testid="searchStudentList"]').click().then(() => {
                cy.url({ timeout: 5000 })
                    .should('include', 'Students?');
            })
        })
        cy.get('[data-testid="studentListRow-1"]').then(() => {
            cy.get('[data-testid="listUsername"]').should('contain', testStudent2.Username)
            cy.get('[data-testid="listFirstName"]').should('contain', testStudent2.FirstName)
            cy.get('[data-testid="listLastName"]').should('contain', testStudent2.LastName)
        })
    })


    after(function () {
        cy.deleteStudent(testStudent2.id).then(() => {
        })
    })
})
