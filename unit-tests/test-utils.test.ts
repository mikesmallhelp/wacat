import { expect } from 'chai';

import {
    generateNumberArrayFrom0ToMax, generateRandomEmail, generateRandomIndex, generateRandomString, 
    generateRandomUrl, getHost, hostIsSame, shuffleArray
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

