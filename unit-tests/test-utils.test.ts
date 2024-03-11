import { expect } from 'chai';

import {
    generateRandomIndex, generateRandomString, getHost, hostIsSame, shuffleStringArray
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

describe('generateRandomIndex', () => {
    it('should return 0 when maxIndex is 0', () => {
        expect(generateRandomIndex(0)).to.equal(0);
    });

    it('should return 1 when maxIndex is 1', () => {
        expect(generateRandomIndex(1)).to.equal(1);
    });

    it('should return a number between 1 and 4, inclusive', () => {
        const result = generateRandomIndex(4);
        expect(result).to.be.at.least(1);
        expect(result).to.be.at.most(4);
    });
});


describe('shuffleStringArray function', () => {
    it('should contain all original elements after shuffling', () => {
        const originalArray = ['a', 'b', 'c', 'd', 'e'];
        const shuffledArray = shuffleStringArray(originalArray);

        for (const element of originalArray) {
            expect(shuffledArray).to.include(element);
        }

        for (const element of shuffledArray) {
            expect(originalArray).to.include(element);
        }

        expect(shuffledArray.length).to.equal(originalArray.length);
    });
});

