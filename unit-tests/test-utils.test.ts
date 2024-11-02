import { expect } from 'chai';

import {
    addSpacesToCamelCaseText, generateNumberArrayFrom0ToMax, generateRandomDate, generateRandomEmail, generateRandomIndex,
    generateRandomInteger, generateRandomString, generateRandomUrl, getHost, hostIsSame, shuffleArray
} from '../utils/test-utils.js';

describe('getHost', () => {
    it('http://localhost:3000/', () => {
        expect(getHost({ url: 'http://localhost:3000/' })).equal('http://localhost:3000');
    });

    it('http://localhost:3000/x', () => {
        expect(getHost({ url: 'http://localhost:3000/x' })).equal('http://localhost:3000');
    });

    it('https://github.com/mikesmallhelp', () => {
        expect(getHost({ url: 'https://github.com/mikesmallhelp' })).equal('https://github.com');
    });
});

describe('hostIsSame', () => {
    it('true: in the localhost', () => {
        expect(hostIsSame({ rootUrl: 'http://localhost:3000/', url: 'http://localhost:3000/x' })).equal(true);
    });

    it('true: in the remote host', () => {
        expect(hostIsSame({
            rootUrl: 'https://mikesmallhelp-test-application.vercel.app/',
            url: 'https://mikesmallhelp-test-application.vercel.app/working-page'
        })).equal(true);
    });

    it('false: different hosts', () => {
        expect(hostIsSame({ rootUrl: 'http://localhost:3000/', url: 'https://github.com/mikesmallhelp' })).equal(false);
    });
});

describe('generateRandomString', () => {
    it('generateRandomString', () => {
        expect(generateRandomString(1, 3, 'abc').length).greaterThanOrEqual(1).and.lessThanOrEqual(3);
    });

    it('generateRandomString without charset', () => {
        expect(generateRandomString(1, 3).length).greaterThanOrEqual(1).and.lessThanOrEqual(3);
    });
});

describe('shuffleArray function', () => {
    it('should contain all original elements after shuffling', () => {
        const originalArray = ['a', 'b', 'c', 'd', 'e'];
        const shuffledArray = shuffleArray(originalArray);
        console.log(shuffledArray);

        for (const element of originalArray) {
            expect(shuffledArray).to.include(element);
        }

        for (const element of shuffledArray) {
            expect(originalArray).to.include(element);
        }

        expect(shuffledArray.length).to.equal(originalArray.length);
    });
});

describe('generateRandomEmail', () => {
    it('should generate a valid email address', () => {
        const email = generateRandomEmail();
        expect(validateEmail(email)).to.equal(true);
    });

    it('should generate an email with a valid domain', () => {
        const email = generateRandomEmail();
        const domain = email.split('@')[1].split('.')[1];
        const validDomains = ['com', 'net', 'org', 'gov', 'edu'];
        expect(validDomains).to.include(domain);
    });
});

const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

describe('generateRandomIndex', () => {
    it('should generate a random index within the specified range 0..2', () => {
        const min = 0;
        const max = 2;
        const randomIndex = generateRandomIndex(min, max);
        expect(randomIndex).to.be.a('number').and.to.be.at.least(min).and.at.most(max);
    });

    it('should generate a random index within the specified range 1..3', () => {
        const min = 1;
        const max = 3;
        const randomIndex = generateRandomIndex(min, max);
        expect(randomIndex).to.be.a('number').and.to.be.at.least(min).and.at.most(max);
    });

    it('should return min when min and max are equal', () => {
        const min = 3;
        const max = 3;
        const randomIndex = generateRandomIndex(min, max);
        expect(randomIndex).to.equal(min);
    });
});

describe('generateNumberArrayFrom0ToMax', () => {
    it('should generate an array from 0 to 5', () => {
        const result = generateNumberArrayFrom0ToMax(5);
        console.log(result);
        expect(result).to.deep.equal([0, 1, 2, 3, 4, 5]);
    });

    it('should return an array with only 0 when max is 0', () => {
        const result = generateNumberArrayFrom0ToMax(0);
        console.log(result);
        expect(result).to.deep.equal([0]);
    });

    it('should generate an array from 0 to 1 when max is 1', () => {
        const result = generateNumberArrayFrom0ToMax(1);
        console.log(result);
        expect(result).to.deep.equal([0, 1]);
    });
});

describe('generateRandomUrl function', () => {
    it('should start with "https://"', () => {
        const url = generateRandomUrl();
        console.log(url);
        expect(url).to.match(/^https:\/\//);
    });

    it('should contain a valid domain suffix', () => {
        const url = generateRandomUrl();
        console.log(url);
        const domainSuffixes = ['.com', '.net', '.org', '.info', '.biz'];
        const containsValidSuffix = domainSuffixes.some(suffix => url.endsWith(suffix));
        expect(containsValidSuffix).to.be.true;
    });

    it('should be at least 17 characters long (minimum domain length + protocol + suffix)', () => {
        const url = generateRandomUrl();
        console.log(url);
        // 8 characters for 'https://' + at least 5 characters for the domain + 1 for the dot + at least 3 for the suffix
        expect(url.length).to.be.at.least(17);
    });

    it('should only contain letters, numbers, or dot characters in the domain name', () => {
        const url = generateRandomUrl();
        console.log(url);
        // Remove the protocol and suffix to test only the domain name
        const domainName = url.replace('https://', '').split('.')[0];
        console.log(domainName);
        expect(domainName).to.match(/^[\da-z]+$/);
    });
});

describe('generateRandomDate Function', () => {
    it('should generate a date between 40 and 50 years ago', () => {
        const dateStr = generateRandomDate(-50, -40, '-');
        console.log(dateStr);

        const date = convertAndCreateDate(dateStr, '-');
        const currentYear = new Date().getFullYear();
        const yearDifference = currentYear - date.getFullYear();

        expect(yearDifference).to.be.at.least(40);
        expect(yearDifference).to.be.at.most(50);
    });

    it('should generate a date within the current year', () => {
        const dateStr = generateRandomDate(0, 0, '/');
        console.log(dateStr);

        const date = convertAndCreateDate(dateStr, '/');
        const currentYear = new Date().getFullYear();

        expect(date.getFullYear()).to.equal(currentYear);
    });

    it('should generate a date between 20 and 30 years in the future', () => {
        const dateStr = generateRandomDate(20, 30, '.');
        console.log(dateStr);

        const date = convertAndCreateDate(dateStr, '.');
        const currentYear = new Date().getFullYear();
        const yearDifference = date.getFullYear() - currentYear;

        expect(yearDifference).to.be.at.least(20);
        expect(yearDifference).to.be.at.most(30);
    });
});

const convertAndCreateDate = (dateStr: string, splitSeparator: string): Date => {
    const parts = dateStr.split(splitSeparator);
    const convertedDateStr = `${parts[2]}-${parts[1]}-${parts[0]}`;
    return new Date(convertedDateStr);
};

describe('Random integer generator', () => {
    it('should generate a random integer between 400000000 and 600000000', () => {
        const randomNumber = generateRandomInteger(400_000_000, 600_000_000);
        console.log(randomNumber);

        expect(randomNumber).to.be.a('number');
        expect(randomNumber).to.be.at.least(400_000_000);
        expect(randomNumber).to.be.at.most(600_000_000);
        expect(randomNumber % 1).to.equal(0);
    });
});

describe('addSpacesToCamelCaseText', () => {
    it('should add spaces between camel case words and between numbers and letters', () => {
        const input = 'Page2Name:YourDateOfBirthHereMenuSelection:FishMeat';
        const expectedOutput = 'Page 2 Name:Your Date Of Birth Here Menu Selection:Fish Meat';
        const result = addSpacesToCamelCaseText(input);
        expect(result).to.equal(expectedOutput);
    });

    it('should not alter text that already has spaces', () => {
        const input = 'Page 2 Name: Your Date Of Birth Here';
        const expectedOutput = 'Page 2 Name: Your Date Of Birth Here';
        const result = addSpacesToCamelCaseText(input);
        expect(result).to.equal(expectedOutput);
    });

    it('should handle an empty string', () => {
        const input = '';
        const expectedOutput = '';
        const result = addSpacesToCamelCaseText(input);
        expect(result).to.equal(expectedOutput);
    });
});

