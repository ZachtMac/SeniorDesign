import * as _ from '../../support/util';

describe('Create Devices', () => {

    let testDevice = _.testDeviceInfo();

    beforeEach(function () {
        cy.visit('/Devices')
    })

    it('Create Device --cancel', () => {
        cy.get('[data-testid="createDevice"]').click().then(() => {
            cy.url({ timeout: 5000 })
                .should('include', 'Devices/Create')
        })
        // Ensure fields are empty then input value
        cy.get('[data-testid="deviceName"]')
            .should('exist').should('have.value', '')
            .type(testDevice.deviceName);
        cy.get('[data-testid="deviceType"]')
            .should('exist').should('have.value', '')
            .type(testDevice.deviceType)
        cy.get('[data-testid="rackRow"]')
            .should('exist').should('have.value', '')
            .type(testDevice.rackRow)
        cy.get('[data-testid="rackCol"]')
            .should('exist').should('have.value', '')
            .type(testDevice.rackCol)
        cy.get('[data-testid="OS"]')
            .should('exist').should('have.value', '')
            .type(testDevice.operatingSystem)
        cy.get('[data-testid="softwareVersion"]')
            .should('exist').should('have.value', '')
            .type(testDevice.softwareVersion)
        cy.get('[data-testid="vendor"]')
            .should('exist').should('have.value', '')
            .type(testDevice.vendor)

        cy.get('[data-testid="cancelCreate"]').click().then(() => {
            cy.url({ timeout: 5000 })
                .should('include', 'Devices')
                .and('not.include', 'Devices/Create')
        })
        cy.get('[data-testid="searchDevice"]').click().then(() => {
            cy.get('[data-testid="searchDevicename"]').type(testDevice.deviceName)
            cy.get('[data-testid="searchDeviceType"]').type(testDevice.deviceType)
            cy.get('[data-testid="searchRackRow"]').type(testDevice.rackRow)
            cy.get('[data-testid="searchRackCol"]').type(testDevice.rackCol)
            cy.get('[data-testid="searchCheckOut"]').select(testDevice.isCheckedOut.toString())
            cy.get('[data-testid="searchDeviceList"]').click().then(() => {
                cy.url({ timeout: 5000 })
                    .should('include', 'Devices?');
            })
            cy.get('[data-testid="deviceListRow-1"]').should('not.exist');
        })

    })
    it('Create Device --create', () => {
        cy.get('[data-testid="createDevice"]').click().then(() => {
            cy.url({ timeout: 5000 })
                .should('include', 'Devices/Create')
        })
        // Ensure fields are empty then input value
        cy.get('[data-testid="deviceName"]')
            .should('exist').should('have.value', '')
            .type(testDevice.deviceName);
        cy.get('[data-testid="deviceType"]')
            .should('exist').should('have.value', '')
            .type(testDevice.deviceType)
        cy.get('[data-testid="rackRow"]')
            .should('exist').should('have.value', '')
            .type(testDevice.rackRow)
        cy.get('[data-testid="rackCol"]')
            .should('exist').should('have.value', '')
            .type(testDevice.rackCol)
        cy.get('[data-testid="OS"]')
            .should('exist').should('have.value', '')
            .type(testDevice.operatingSystem)
        cy.get('[data-testid="softwareVersion"]')
            .should('exist').should('have.value', '')
            .type(testDevice.softwareVersion)
        cy.get('[data-testid="vendor"]')
            .should('exist').should('have.value', '')
            .type(testDevice.vendor)

        cy.get('[data-testid="createDevice"]').click().then(() => {
            cy.url({ timeout: 5000 })
                .should('include', 'Devices')
                .and('not.include', 'Devices/Create')
        })
        cy.get('[data-testid="searchDevice"]').click().then(() => {
            cy.get('[data-testid="searchDevicename"]').type(testDevice.deviceName)
            cy.get('[data-testid="searchDeviceType"]').type(testDevice.deviceType)
            cy.get('[data-testid="searchRackRow"]').type(testDevice.rackRow)
            cy.get('[data-testid="searchRackCol"]').type(testDevice.rackCol)
            cy.get('[data-testid="searchCheckOut"]').select(testDevice.isCheckedOut.toString())
            cy.get('[data-testid="searchDeviceList"]').click().then(() => {
                cy.url({ timeout: 5000 })
                    .should('include', 'Devices?');
            })
        })
        cy.get('[data-testid="deviceListRow-1"]').then(() => {
            cy.get('[data-testid="listDeviceName"]').should('contain', testDevice.deviceName)
            cy.get('[data-testid="listDeviceType"]').should('contain', testDevice.deviceType)
            cy.get('[data-testid="listRackRow"]').should('contain', testDevice.rackRow)
            cy.get('[data-testid="listRackCol"]').should('contain', testDevice.rackCol)
            cy.get('[data-testid="listCheckedOut"]').should('contain', String(testDevice.isCheckedOut).charAt(0).toUpperCase() + String(testDevice.isCheckedOut).slice(1));
        })
    })

    after(function () {
        cy.getDevice(testDevice.deviceName).then((response) => {
            testDevice.id = response.deviceId
            cy.deleteDevice(testDevice.id).then(() => {
                    cy.reload()
            })
        })
    });
})