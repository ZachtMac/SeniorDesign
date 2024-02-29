import * as _ from '../../support/util';

describe('Delete Devices', () => {

    let testDevice = _.testDeviceInfo();

    before(function () {
        cy.createDevice(testDevice);
    })

    beforeEach(function () {
        cy.visit('/Devices')
    })

    it('Delete Device --cancel', () => {
        // Locate the Device to be Editted
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
        // Check info then Delete
        cy.get('[data-testid="deviceListRow-1"]').then(() => {
            cy.get('[data-testid="listDeviceName"]').should('contain', testDevice.deviceName)
            cy.get('[data-testid="listDeviceType"]').should('contain', testDevice.deviceType)
            cy.get('[data-testid="listRackRow"]').should('contain', testDevice.rackRow)
            cy.get('[data-testid="listRackCol"]').should('contain', testDevice.rackCol)
            cy.get('[data-testid="listCheckedOut"]').should('contain', String(testDevice.isCheckedOut).charAt(0).toUpperCase() + String(testDevice.isCheckedOut).slice(1));
            cy.get('[data-testid^="delete-"]').click().then(() => {
                cy.url({ timeout: 5000 })
                    .should('include', 'Devices/Delete/')
            })
        })

        // Check Info on Delete Confirmation
        cy.get('[data-testid="deviceName"]').should('contain', testDevice.deviceName)
        cy.get('[data-testid="deviceType"]').should('contain', testDevice.deviceType)
        cy.get('[data-testid="checkedOut"]').should('contain', String(testDevice.isCheckedOut).charAt(0).toUpperCase() + String(testDevice.isCheckedOut).slice(1));

        // Cancel and make sure the device is still listed
        cy.get('[data-testid="cancelDelete"]').click().then(() => {
            cy.url({ timeout: 5000 })
                .should('include', 'Devices')
                .and('not.include', 'Devices/Delete')
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

    it('Delete Device --delete', () => {
        // Locate the Device to be Editted
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
        // Check info then Delete
        cy.get('[data-testid="deviceListRow-1"]').then(() => {
            cy.get('[data-testid="listDeviceName"]').should('contain', testDevice.deviceName)
            cy.get('[data-testid="listDeviceType"]').should('contain', testDevice.deviceType)
            cy.get('[data-testid="listRackRow"]').should('contain', testDevice.rackRow)
            cy.get('[data-testid="listRackCol"]').should('contain', testDevice.rackCol)
            cy.get('[data-testid="listCheckedOut"]').should('contain', String(testDevice.isCheckedOut).charAt(0).toUpperCase() + String(testDevice.isCheckedOut).slice(1));
            cy.get('[data-testid^="delete-"]').click().then(() => {
                cy.url({ timeout: 5000 })
                    .should('include', 'Devices/Delete/')
            })
        })

        // Check Info on Delete Confirmation
        cy.get('[data-testid="deviceName"]').should('contain', testDevice.deviceName)
        cy.get('[data-testid="deviceType"]').should('contain', testDevice.deviceType)
        cy.get('[data-testid="checkedOut"]').should('contain', String(testDevice.isCheckedOut).charAt(0).toUpperCase() + String(testDevice.isCheckedOut).slice(1));

        // Delete and ensure removal
        cy.get('[data-testid="deleteDevice"]').click().then(() => {
            cy.url({ timeout: 5000 })
                .should('include', 'Devices')
                .and('not.include', 'Devices/Delete')
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
        cy.get('[data-testid="deviceListRow-1"]')
            .should('not.exist')
    })


})