// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
Cypress.on('uncaught:exception', (err, runnable) => {
    // returning false here prevents Cypress from
    // failing the test
    return false
})

import * as _ from './util';

// Student Commands
Cypress.Commands.add('createStudent', (studentAccount) => {
    cy.request({
        method: 'POST',
        url: 'api/StudentsApi/Create',
        body: studentAccount,
        failOnStatusCode: false // Don't fail the test if the response status code is not 2xx
    }).then((response) => {
        // Verify that the request was successful
        expect(response.status).to.be.within(200, 299);
        const { studentId } = response.body;
        studentAccount.id = studentId;
    });
})

Cypress.Commands.add('getStudent', (username) => {
    cy.request({
        method: 'GET',
        url: 'api/StudentsApi/GetAll',
        failOnStatusCode: false
    }).then((response) => {
        // Check if the request was successful
        expect(response.status).to.be.within(200, 299);

        // Find the matching student by username
        const matchingStudent = response.body.$values.find(student => student.username === username);

        // Check if a matching student record was found
        if (!matchingStudent) {
            throw new Error(`Student with username '${username}' not found.`);
        }

        // Extract the ID of the matching student record
        const studentId = matchingStudent.studentId;

        // Send a GET request to Get endpoint with the extracted ID
        return cy.request({
            method: 'GET',
            url: `api/StudentsApi/Get/${studentId}`,
            failOnStatusCode: false
        }).then((studentResponse) => {
            // Check if the request was successful
            expect(studentResponse.status).to.equal(200);

            // Return the full record of the student
            return studentResponse.body;
        });
    });
});

Cypress.Commands.add('deleteStudent', (id) => {
    cy.request({
        method: 'DELETE',
        url: `api/StudentsApi/Delete/${id}`,
        failOnStatusCode: false // This will not fail the test on server errors
    }).then((response) => {
        // Verify that the request was successful
        expect(response.status).to.be.within(200, 299);
    });
});


// Case Commands
Cypress.Commands.add('createCase', (_case) => {
    cy.request({
        method: 'POST',
        url: 'api/CasesApi/Create',
        body: _case,
        failOnStatusCode: false,
    }).then((response) => {
        expect(response.status).to.be.within(200, 299);
        const { caseId } = response.body
        _case.id = caseId
    });
});

Cypress.Commands.add('getCase', ({ username, casename }) => {
    if (username) {
        // Fetch Case by username
        cy.request({
            method: 'GET',
            url: 'api/CasesApi/GetAll',
            failOnStatusCode: false
        }).then((response) => {
            // Check if the request was successful
            expect(response.status).to.be.within(200, 299);
            // Find the matching case by casename
            const matchingCase = response.body.$values.find(_case => _case.username === username);

            // Check if a matching case was found
            if (!matchingCase) {
                throw new Error(`Case with name '${casename}' not found.`);
            }

            // Extract the ID of the matching case
            const caseId = matchingCase.caseId;

            // Send a GET request to Get endpoint with the extracted ID
            return cy.request({
                method: 'GET',
                url: `api/CasesApi/Get/${caseId}`,
                failOnStatusCode: false
            }).then((caseResponse) => {
                // Check if the request was successful
                expect(caseResponse.status).to.equal(200);

                // Return the full record of the case
                return caseResponse.body;
            });
        });
    } else if (casename) {
        // Fetch case by casename
        cy.request({
            method: 'GET',
            url: 'api/CasesApi/GetAll',
            failOnStatusCode: false
        }).then((response) => {
            // Check if the request was successful
            expect(response.status).to.be.within(200, 299);


            // Find the matching case by casename
            const matchingCase = response.body.$values.find(_case => _case.caseName === casename);

            // Check if a matching case was found
            if (!matchingCase) {
                throw new Error(`Case with name '${casename}' not found.`);
            }

            // Extract the ID of the matching case
            const caseId = matchingCase.caseId;

            // Send a GET request to Get endpoint with the extracted ID
            return cy.request({
                method: 'GET',
                url: `api/CasesApi/Get/${caseId}`,
                failOnStatusCode: false
            }).then((caseResponse) => {
                // Check if the request was successful
                expect(caseResponse.status).to.equal(200);

                // Return the full record of the case
                return caseResponse.body;
            });
        });
    } else {
        throw new Error('Either username or casename must be provided.');
    }
});

Cypress.Commands.add('deleteCase', (id) => {
    cy.request({
        method: 'DELETE',
        url: `api/CasesApi/Delete/${id}`,
        failOnStatusCode: false // This will not fail the test on server errors
    }).then((response) => {
        // Verify that the request was successful
        expect(response.status).to.be.within(200, 299);
    });
});

// Devices Commands
Cypress.Commands.add('createDevice', (device) => {
    cy.request({
        method: 'POST',
        url: 'api/DevicesApi/Create',
        body: device,
        failOnStatusCode: false,
    }).then((response) => {
        expect(response.status).to.be.within(200, 299);
        const { deviceId } = response.body
        device.id = deviceId
    })
})

Cypress.Commands.add('getDevice', (deviceName) => {
    cy.request({
        method: 'GET',
        url: 'api/DevicesApi/GetAll',
        failOnStatusCode: false
    }).then((response) => {
        // Check if the request was successful
        expect(response.status).to.be.within(200, 299);

        // Find the matching device by device name
        const matchingDevice = response.body.$values.find(device => device.deviceName === deviceName);

        // Check if a matching device record was found
        if (!matchingDevice) {
            throw new Error(`Device with device name '${deviceName}' not found.`);
        }

        // Extract the ID of the matching device record
        const deviceId = matchingDevice.deviceId;

        // Send a GET request to Get endpoint with the extracted ID
        return cy.request({
            method: 'GET',
            url: `api/DevicesApi/Get/${deviceId}`,
            failOnStatusCode: false
        }).then((response) => {
            // Check if the request was successful
            expect(response.status).to.be.within(200, 299);

            // Return the full record of the student
            return response.body;
        });
    });
})

Cypress.Commands.add('deleteDevice', (id) => {
    cy.request({
        method: 'DELETE',
        url: `api/DevicesApi/Delete/${id}`,
        failOnStatusCode: false // This will not fail the test on server errors
    }).then((response) => {
        // Verify that the request was successful
        expect(response.status).to.be.within(200, 299);
    });
})

//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })