import * as _ from '../../support/util';

describe('Device Booking through Case Details', () => {

    let testDevices1 = Array.from({ length: 3 }, _.testDeviceInfo);
    let testStudent1 = _.testStudentInfo();
    let testKase1 = _.testCaseInfo(testStudent1.Username, 'fullSet');

    let testDevices2 = Array.from({ length: 3 }, _.testDeviceInfo);
    let testStudent2 = _.testStudentInfo();
    let testKase2 = _.testCaseInfo(testStudent2.Username, 'fullSet');

    before(function () {
        // Create Test Devices, Cases, and Students
        testDevices1.forEach(async (device) => {
            await cy.createDevice(device).then(async (res) => {
                const { deviceId } = res.body
                device.id = deviceId;
                return device.id
            })
        })
        cy.createStudent(testStudent1).then((student) => {
            const { studentId } = student.body
            testStudent1.id = studentId;
            cy.createCase(_.caseInfoStrip(testKase1)).then((kase) => {
                const { caseId } = kase.body
                testKase1.id = caseId
            })
        })
        testDevices2.forEach(async (device) => {
            await cy.createDevice(device).then(async (res) => {
                const { deviceId } = res.body
                device.id = deviceId;
                return device.id
            })
        })
        cy.createStudent(testStudent2).then((student) => {
            const { studentId } = student.body
            testStudent2.id = studentId;
            cy.createCase(_.caseInfoStrip(testKase2)).then((kase) => {
                const { caseId } = kase.body
                testKase2.id = caseId
            })
        })
    })

    beforeEach(function () {
        cy.visit('/Cases')
    })

    it('Book Device by Case Details Page --cancel', () => {
        // Search for test case
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
            cy.get('[data-testid^="details-"]').click().then(() => {
                cy.url({ timeout: 5000 })
                    .should('include', 'Cases/Details/');
                cy.get('[data-testid="bookDevices"]').click().then(() => {
                    cy.url({ timeout: 5000 })
                        .should('include', 'Devices/DeviceBooking/')
                })
            })
        })
        // Add devices to book
        testDevices1.forEach(async (device, index) => {
            // Search for Device
            await cy.get('[data-testid="searchDevice"]').click().then(() => {
                cy.get('[data-testid="searchDeviceName"]').clear().type(device.deviceName)
                cy.get('[data-testid="searchDeviceType"]').clear().type(device.deviceType)
                cy.get('[data-testid="searchRackRow"]').clear().type(device.rackRow)
                cy.get('[data-testid="searchRackCol"]').clear().type(device.rackCol)
                cy.get('[data-testid="searchDeviceList"]').click().then(async () => {
                    cy.url({ timeout: 5000 })
                        .should('include', 'Devices/DeviceBooking/')
                    // Check and Book Device
                    await cy.get('[data-testid="deviceListRow-1"]').then(() => {
                        cy.get('[data-testid="listDeviceName"]').should('contain', device.deviceName)
                        cy.get('[data-testid="listDeviceType"]').should('contain', device.deviceType)
                        cy.get('[data-testid="listOS"]').should('contain', device.operatingSystem)
                        cy.get('[data-testid="listVendor"]').should('contain', device.vendor)
                        cy.get('[data-testid="listSoftwareVersion"]').should('contain', device.softwareVersion)
                        cy.get('[data-testid="listRackRow"]').should('contain', device.rackRow)
                        cy.get('[data-testid="listRackCol"]').should('contain', device.rackCol)
                        cy.get('[data-testid^="bookDevice-"]').click().then(async () => {
                            cy.url({ timeout: 5000 })
                                .should('include', 'Devices/DeviceBooking/')
                            // Check Booked Devices
                            await cy.get(`[data-testid="bookedListRow-${device.id}"]`).within(() => {
                                cy.get('[data-testid="listBookDeviceName"]').should('contain', device.deviceName)
                                cy.get('[data-testid="listBookDeviceType"]').should('contain', device.deviceType)
                                cy.get('[data-testid="listBookOS"]').should('contain', device.operatingSystem)
                                cy.get('[data-testid="listBookVendor"]').should('contain', device.vendor)
                                cy.get('[data-testid="listBookSoftwareVersion"]').should('contain', device.softwareVersion)
                                cy.get('[data-testid="listBookRackRow"]').should('contain', device.rackRow)
                                cy.get('[data-testid="listBookRackCol"]').should('contain', device.rackCol)
                                // Remove 3rd device for removal testing
                                if (index === 2) {
                                    cy.get(`[data-testid="remove-${device.id}"]`).click().then(() => {
                                        // Ensure the row is removed
                                        cy.get(`[data-testid="bookedListRow-${device.id}"]`).should('not.exist');
                                    });

                                }
                            });
                        })
                    })
                })
            })
        })
        // Cancel Booking
        cy.get('[data-testid="cancelBook"]').click().then(() => {
            cy.url({ timeout: 5000 }).should('include', 'Cases/CaseSelection')
        });
        // Check Case Details to ensure Devices added
        cy.visit('/Cases')

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
            cy.get('[data-testid^="details-"]').click().then(() => {
                cy.url({ timeout: 5000 })
                    .should('include', 'Cases/Details/');
            })
        });
        testDevices1.forEach((device, index) => {
            cy.get(`[data-testid="${device.id}"]`).should('not.exist')
        })
        // Check Devices weren't checkout in Device tab
        testDevices1.forEach((device) => {
            cy.visit('/Devices').then(() => {

                cy.get('[data-testid="searchDevice"]').click().then(() => {
                    cy.get('[data-testid="searchDevicename"]').type(device.deviceName)
                    cy.get('[data-testid="searchDeviceType"]').type(device.deviceType)
                    cy.get('[data-testid="searchRackRow"]').type(device.rackRow)
                    cy.get('[data-testid="searchRackCol"]').type(device.rackCol)
                    cy.get('[data-testid="searchCheckOut"]').select(`False`)
                    cy.get('[data-testid="searchDeviceList"]').click().then(() => {
                        cy.url({ timeout: 5000 })
                            .should('include', 'Devices?');
                        cy.get('[data-testid="deviceListRow-1"]').then(() => {
                            cy.get('[data-testid="listCheckedOut"]').should('contain', 'False');
                            cy.get('[data-testid^="details-"]').click().then(() => {
                                cy.url({ timeout: 5000 })
                                    .should('include', 'Devices/Details/')
                                cy.get('[data-testid="checkedOut"]').should('contain', 'False')
                                cy.get('[data-testid="caseName"]').should('not.exist')
                                cy.get('[data-testid="username"]').should('not.exist')
                            })
                        })
                    })
                })
            })
        })
    })
    it('Book Device by Case Details Page  --success', () => {
        // Search for test case
        cy.get('[data-testid="searchCase"]').click().then(() => {
            cy.get('[data-testid="searchCasename"]').type(testKase2.name)
            cy.get('[data-testid="searchStartdate"]').type(testKase2.shortShortDate)
            cy.get('[data-testid="searchDuration"]').type(testKase2.duration)
            cy.get('[data-testid="searchUsername"]').type(testKase2.userName)
            cy.get('[data-testid="searchCaselist"]').click().then(() => {
                cy.url({ timeout: 5000 })
                    .should('include', 'Cases?');
            })
        })
        cy.get('[data-testid="caseListRow-1"]').then(() => {
            cy.get('[data-testid="listCasename"]').should('contain', testKase2.name)
            cy.get('[data-testid="listStartdate"]').should('contain', testKase2.displayDate)
            cy.get('[data-testid="listDuration"]').should('contain', testKase2.duration)
            cy.get('[data-testid="listUsername"]').should('contain', testKase2.userName)
            cy.get('[data-testid^="details-"]').click().then(() => {
                cy.url({ timeout: 5000 })
                    .should('include', 'Cases/Details/');
                cy.get('[data-testid="bookDevices"]').click().then(() => {
                    cy.url({ timeout: 5000 })
                        .should('include', 'Devices/DeviceBooking/')
                })
            })
        })
        // Add devices to book
        testDevices2.forEach(async (device, index) => {
            // Search for Device
            await cy.get('[data-testid="searchDevice"]').click().then(() => {
                cy.get('[data-testid="searchDeviceName"]').clear().type(device.deviceName)
                cy.get('[data-testid="searchDeviceType"]').clear().type(device.deviceType)
                cy.get('[data-testid="searchRackRow"]').clear().type(device.rackRow)
                cy.get('[data-testid="searchRackCol"]').clear().type(device.rackCol)
                cy.get('[data-testid="searchDeviceList"]').click().then(async () => {
                    cy.url({ timeout: 5000 })
                        .should('include', 'Devices/DeviceBooking/')
                    // Check and Book Device
                    await cy.get('[data-testid="deviceListRow-1"]').then(() => {
                        cy.get('[data-testid="listDeviceName"]').should('contain', device.deviceName)
                        cy.get('[data-testid="listDeviceType"]').should('contain', device.deviceType)
                        cy.get('[data-testid="listOS"]').should('contain', device.operatingSystem)
                        cy.get('[data-testid="listVendor"]').should('contain', device.vendor)
                        cy.get('[data-testid="listSoftwareVersion"]').should('contain', device.softwareVersion)
                        cy.get('[data-testid="listRackRow"]').should('contain', device.rackRow)
                        cy.get('[data-testid="listRackCol"]').should('contain', device.rackCol)
                        cy.get('[data-testid^="bookDevice-"]').click().then(async () => {
                            cy.url({ timeout: 5000 })
                                .should('include', 'Devices/DeviceBooking/')
                            // Check Booked Devices
                            await cy.get(`[data-testid="bookedListRow-${device.id}"]`).within(() => {
                                cy.get('[data-testid="listBookDeviceName"]').should('contain', device.deviceName)
                                cy.get('[data-testid="listBookDeviceType"]').should('contain', device.deviceType)
                                cy.get('[data-testid="listBookOS"]').should('contain', device.operatingSystem)
                                cy.get('[data-testid="listBookVendor"]').should('contain', device.vendor)
                                cy.get('[data-testid="listBookSoftwareVersion"]').should('contain', device.softwareVersion)
                                cy.get('[data-testid="listBookRackRow"]').should('contain', device.rackRow)
                                cy.get('[data-testid="listBookRackCol"]').should('contain', device.rackCol)
                                // Remove 3rd device for removal testing
                                if (index === 2) {
                                    cy.get(`[data-testid="remove-${device.id}"]`).click().then(() => {
                                        // Ensure the row is removed
                                        cy.get(`[data-testid="bookedListRow-${device.id}"]`).should('not.exist');
                                    });
                                }
                            });
                        })
                    })
                })
            })
        })
        // Checkout Devices to Case
        cy.get('[data-testid="checkoutDevices"]').click().then(() => {
            cy.url({ timeout: 5000 })
                .should('include', `Cases/Details/${testKase2.id}`)
        })
        // Check Case Details to ensure Devices added
        cy.visit('/Cases')

        cy.get('[data-testid="searchCase"]').click().then(() => {
            cy.get('[data-testid="searchCasename"]').type(testKase2.name)
            cy.get('[data-testid="searchStartdate"]').type(testKase2.shortShortDate)
            cy.get('[data-testid="searchDuration"]').type(testKase2.duration)
            cy.get('[data-testid="searchUsername"]').type(testKase2.userName)
            cy.get('[data-testid="searchCaselist"]').click().then(() => {
                cy.url({ timeout: 5000 })
                    .should('include', 'Cases?');
            })
        })
        cy.get('[data-testid="caseListRow-1"]').then(() => {
            cy.get('[data-testid="listCasename"]').should('contain', testKase2.name)
            cy.get('[data-testid="listStartdate"]').should('contain', testKase2.displayDate)
            cy.get('[data-testid="listDuration"]').should('contain', testKase2.duration)
            cy.get('[data-testid="listUsername"]').should('contain', testKase2.userName)
            cy.get('[data-testid^="details-"]').click().then(() => {
                cy.url({ timeout: 5000 })
                    .should('include', 'Cases/Details/');
            })
        });
        testDevices2.forEach((device, index) => {
            if (index === 2) {
                cy.get(`[data-testid="${device.id}"]`).should('not.exist')
            }
            else {
                cy.get(`[data-testid="${device.id}"] > [data-testid="deviceId"]`).should('contain', device.id)
                cy.get(`[data-testid="${device.id}"] > [data-testid="deviceName"]`).should('contain', device.deviceName)
                cy.get(`[data-testid="${device.id}"] > [data-testid="deviceType"]`).should('contain', device.deviceType)
                cy.get(`[data-testid="${device.id}"] > [data-testid="operatingSystem"]`).should('contain', device.operatingSystem)
                cy.get(`[data-testid="${device.id}"] > [data-testid="vendor"]`).should('contain', device.vendor)
                cy.get(`[data-testid="${device.id}"] > [data-testid="softwareVersion"]`).should('contain', device.softwareVersion)
                cy.get(`[data-testid="${device.id}"] > [data-testid="rackRow"]`).should('contain', device.rackRow)
                cy.get(`[data-testid="${device.id}"] > [data-testid="rackCol"]`).should('contain', device.rackCol)
            }
        })
        // Check Devices were checkedout in Device tab
        testDevices2.forEach((device, index) => {
            cy.visit('/Devices').then(() => {
                cy.get('[data-testid="searchDevice"]').click().then(() => {
                    cy.get('[data-testid="searchDevicename"]').type(device.deviceName)
                    cy.get('[data-testid="searchDeviceType"]').type(device.deviceType)
                    cy.get('[data-testid="searchRackRow"]').type(device.rackRow)
                    cy.get('[data-testid="searchRackCol"]').type(device.rackCol)
                    cy.get('[data-testid="searchCheckOut"]').select(index === 2 ? 'False' : 'True')
                    cy.get('[data-testid="searchDeviceList"]').click().then(() => {
                        cy.url({ timeout: 5000 })
                            .should('include', 'Devices?');
                        cy.get('[data-testid="deviceListRow-1"]').then(() => {
                            cy.get('[data-testid="listCheckedOut"]').should('contain', index === 2 ? 'False' : 'True');
                            cy.get('[data-testid^="details-"]').click().then(() => {
                                cy.url({ timeout: 5000 })
                                    .should('include', 'Devices/Details/')
                                cy.get('[data-testid="checkedOut"]').should('contain', index === 2 ? 'False' : 'True')
                                if (index !== 2) {
                                    cy.get('[data-testid="caseName"]').should('contain', testKase2.name)
                                    cy.get('[data-testid="username"]').should('contain', testStudent2.Username)
                                }
                            })
                        })
                    })
                })
            })
        })

    })
    after(function () {
        testDevices2.forEach(async (device) => {
            await cy.deleteDevice(device.id)
        })
        cy.deleteCase(testKase2.id).then(() => {
            cy.deleteStudent(testStudent2.id)
        })

        testDevices1.forEach(async (device) => {
            await cy.deleteDevice(device.id)
        })
        cy.deleteCase(testKase1.id).then(() => {
            cy.deleteStudent(testStudent1.id)
        })
    })
})