// Gernerates a random date with each used format
export function getRandomDate() {
    const randomTimestamp = Math.floor(Math.random() * Date.now());
    const randomDate = new Date(randomTimestamp);
    const year = randomDate.getFullYear();
    const month = (randomDate.getMonth() + 1).toString();
    const paddedMonth = month.padStart(2, '0');
    const day = randomDate.getDate().toString()
    const paddedDay = day.padStart(2, '0');
    const minutes = randomDate.getMinutes().toString().padStart(2, '0');
    return {
        fullFormat: `${year}-${paddedMonth}-${paddedDay}T12:${minutes}`,
        shortFormat: `${year}-${paddedMonth}-${paddedDay}`,
        displayFormat: `${month}/${day}/${year} 12:${minutes}:00 PM`
    };
}

// Test Debug to see contents of apis responses/objects
export function spellOutObject(obj) {
    let spellOut = "";

    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            const value = obj[key];

            if (typeof value === 'object' && value !== null) {
                // If the value is an object, recursively call spellOutObject
                spellOut += `${key}: { ${spellOutObject(value)} }, `;
            } else {
                spellOut += `${key}: ${value}, `;
            }
        }
    }

    return spellOut.slice(0, -2); // Remove the last comma and space
}

// Generates random Test Account Info
export function testStudentInfo() {
    return {
        Username: Math.random().toString(20).substring(2, 12),
        FirstName: Math.random().toString(20).substring(2, 22),
        LastName: Math.random().toString(20).substring(2, 22)
    };
}

// Generates random Test Case Info
export function testCaseInfo(userName, format = 'default') {
    const initialDate = getRandomDate();
    if (format === 'default') {
        return {
            Casename: Math.random().toString(20).substring(2, 22),
            DateTime: initialDate.fullFormat,
            Duration: Cypress._.random(0, 31),
            Username: userName
        };
    } else if (format === 'fullSet') {
        return {
            name: Math.random().toString(20).substring(2, 22),
            startDate: initialDate.fullFormat,
            shortShortDate: initialDate.shortFormat,
            displayDate: initialDate.displayFormat,
            duration: Cypress._.random(0, 31),
            userName: userName
        };
    } else {
        throw new Error('Invalid format specified');
    }
}

// Strip Full Set Case Info for Api Route
export function caseInfoStrip(caseInfo) {
    return {
        Casename: caseInfo.name,
        DateTime: caseInfo.startDate,
        Duration: caseInfo.duration,
        Username: caseInfo.userName
    }
}

// Generates random Device Info
export function testDeviceInfo() {
    return {
        deviceName: Math.random().toString(20).substring(2, 22),
        deviceType: Math.random().toString(20).substring(2, 22),
        rackRow: Cypress._.random(0, 31),
        rackCol: Cypress._.random(0, 31),
        operatingSystem: Math.random().toString(20).substring(2, 22),
        softwareVersion: Math.random().toString(20).substring(2, 22),
        vendor: Math.random().toString(20).substring(2, 22),
        isCheckedOut: false
    }
}