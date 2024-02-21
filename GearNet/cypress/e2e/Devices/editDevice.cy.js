import * as _ from '../../support/util';

describe('Edit Devices', () => {

    let testDevice1 = _.testDeviceInfo();
    let testDevice2 = _.testDeviceInfo();

    before(function () {
        cy.createDevice(testDevice1).then((response) => {
            const { deviceId } = response.body
            testDevice1.id = deviceId;
            testDevice2.id = deviceId;
        })
    })

    beforeEach(function () {
        cy.visit('/Devices')
    })

    it('Edit Device by Edit Button --cancel', () => {
        // Locate the Device to be Editted
        cy.get('[data-testid="searchDevice"]').click().then(() => {
            cy.get('[data-testid="searchDevicename"]').type(testDevice1.deviceName)
            cy.get('[data-testid="searchDeviceType"]').type(testDevice1.deviceType)
            cy.get('[data-testid="searchRackRow"]').type(testDevice1.rackRow)
            cy.get('[data-testid="searchRackCol"]').type(testDevice1.rackCol)
            cy.get('[data-testid="searchCheckOut"]').select(testDevice1.isCheckedOut.toString())
            cy.get('[data-testid="searchDeviceList"]').click().then(() => {
                cy.url({ timeout: 5000 })
                    .should('include', 'Devices?');
            })
        })
        // Check the current information to compare against
        cy.get('[data-testid="deviceListRow-1"]').then(() => {
            cy.get('[data-testid="listDevicename"]').should('contain', testDevice1.deviceName)
            cy.get('[data-testid="listDeviceType"]').should('contain', testDevice1.deviceType)
            cy.get('[data-testid="listRackRow"]').should('contain', testDevice1.rackRow)
            cy.get('[data-testid="listRackCol"]').should('contain', testDevice1.rackCol)
            cy.get('[data-testid="listCheckedOut"]').should('contain', String(testDevice1.isCheckedOut).charAt(0).toUpperCase() + String(testDevice1.isCheckedOut).slice(1));
            cy.get('[data-testid^="edit-"]').click().then(() => {
                cy.url({ timeout: 5000 })
                    .should('include', 'Devices/Edit/')
            })
        })

        // Edit the information
        cy.get('[data-testid="deviceName"]')
            .clear().type(testDevice2.deviceName)
        cy.get('[data-testid="deviceType"]')
            .clear().type(testDevice2.deviceType)
        cy.get('[data-testid="rackRow"]')
            .clear().type(testDevice2.rackRow)
        cy.get('[data-testid="rackCol"]')
            .clear().type(testDevice2.rackCol)
        cy.get('[data-testid="OS"]')
            .clear().type(testDevice2.operatingSystem)
        cy.get('[data-testid="softwareVersion"]')
            .clear().type(testDevice2.softwareVersion)
        cy.get('[data-testid="vendor"]')
            .clear().type(testDevice2.vendor)


        //Cancel and ensure no changes occured on Detail Page
        cy.get('[data-testid="cancelEdit"]').click().then(() => {
            cy.url({ timeout: 5000 })
                .should('include', 'Devices/Details/')
                .and('not.include', 'Devices/Edit/')
        })
        cy.get('[data-testid="deviceName"]').should('contain', testDevice1.deviceName)
        cy.get('[data-testid="deviceType"]').should('contain', testDevice1.deviceType)
        cy.get('[data-testid="OS"]').should('contain', testDevice1.operatingSystem)
        cy.get('[data-testid="softwareVersion"]').should('contain', testDevice1.softwareVersion)
        cy.get('[data-testid="vendor"]').should('contain', testDevice1.vendor)
        cy.get('[data-testid="rackRow"]').should('contain', testDevice1.rackRow)
        cy.get('[data-testid="rackCol"]').should('contain', testDevice1.rackCol)
        cy.get('[data-testid="checkedOut"]').should('contain', String(testDevice1.isCheckedOut).charAt(0).toUpperCase() + String(testDevice1.isCheckedOut).slice(1))
    })

    it('Edit Device by Edit Button --cancel', () => {
        // Locate the Device to be Editted
        cy.get('[data-testid="searchDevice"]').click().then(() => {
            cy.get('[data-testid="searchDevicename"]').type(testDevice1.deviceName)
            cy.get('[data-testid="searchDeviceType"]').type(testDevice1.deviceType)
            cy.get('[data-testid="searchRackRow"]').type(testDevice1.rackRow)
            cy.get('[data-testid="searchRackCol"]').type(testDevice1.rackCol)
            cy.get('[data-testid="searchCheckOut"]').select(testDevice1.isCheckedOut.toString())
            cy.get('[data-testid="searchDeviceList"]').click().then(() => {
                cy.url({ timeout: 5000 })
                    .should('include', 'Devices?');
            })
        })
        // Check the current information to compare against
        cy.get('[data-testid="deviceListRow-1"]').then(() => {
            cy.get('[data-testid="listDevicename"]').should('contain', testDevice1.deviceName)
            cy.get('[data-testid="listDeviceType"]').should('contain', testDevice1.deviceType)
            cy.get('[data-testid="listRackRow"]').should('contain', testDevice1.rackRow)
            cy.get('[data-testid="listRackCol"]').should('contain', testDevice1.rackCol)
            cy.get('[data-testid="listCheckedOut"]').should('contain', String(testDevice1.isCheckedOut).charAt(0).toUpperCase() + String(testDevice1.isCheckedOut).slice(1));
            cy.get('[data-testid^="edit-"]').click().then(() => {
                cy.url({ timeout: 5000 })
                    .should('include', 'Devices/Edit/')
            })
        })

        // Edit the information
        cy.get('[data-testid="deviceName"]')
            .clear().type(testDevice2.deviceName)
        cy.get('[data-testid="deviceType"]')
            .clear().type(testDevice2.deviceType)
        cy.get('[data-testid="rackRow"]')
            .clear().type(testDevice2.rackRow)
        cy.get('[data-testid="rackCol"]')
            .clear().type(testDevice2.rackCol)
        cy.get('[data-testid="OS"]')
            .clear().type(testDevice2.operatingSystem)
        cy.get('[data-testid="softwareVersion"]')
            .clear().type(testDevice2.softwareVersion)
        cy.get('[data-testid="vendor"]')
            .clear().type(testDevice2.vendor)


        //Submit and validate changes on Detail Page
        cy.get('[data-testid="editDevice"]').click().then(() => {
            cy.url({ timeout: 5000 })
                .should('include', 'Devices/Details/')
                .and('not.include', 'Devices/Edit/')
        })
        cy.get('[data-testid="deviceName"]').should('contain', testDevice2.deviceName)
        cy.get('[data-testid="deviceType"]').should('contain', testDevice2.deviceType)
        cy.get('[data-testid="OS"]').should('contain', testDevice2.operatingSystem)
        cy.get('[data-testid="softwareVersion"]').should('contain', testDevice2.softwareVersion)
        cy.get('[data-testid="vendor"]').should('contain', testDevice2.vendor)
        cy.get('[data-testid="rackRow"]').should('contain', testDevice2.rackRow)
        cy.get('[data-testid="rackCol"]').should('contain', testDevice2.rackCol)
        cy.get('[data-testid="checkedOut"]').should('contain', String(testDevice2.isCheckedOut).charAt(0).toUpperCase() + String(testDevice2.isCheckedOut).slice(1))
    })


    after(function () {
        cy.deleteDevice(testDevice2.id).then(() => {
        })
    })
})
