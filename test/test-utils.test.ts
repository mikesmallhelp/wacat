import { getHost, hostIsSame, generateRandomString } from '../utils/test-utils.js';
import { expect } from 'chai';

describe('getHost', () => {
    it('http://localhost:3000/', () => {
        expect(getHost({url: 'http://localhost:3000/'})).equal('http://localhost:3000');
    });

    it('http://localhost:3000/x', () => {
        expect(getHost({url: 'http://localhost:3000/x'})).equal('http://localhost:3000');
    });

    it('https://github.com/mikesmallhelp', () => {
        expect(getHost({url: 'https://github.com/mikesmallhelp'})).equal('https://github.com');
    });
});

describe('hostIsSame', () => {
    it('true: rootUrl: http://localhost:3000/ url: http://localhost:3000/x', () => {
        expect(hostIsSame({rootUrl: 'http://localhost:3000/', url: 'http://localhost:3000/x'})).equal(true);
    });

    it('false: rootUrl: http://localhost:3000/ url: https://github.com/mikesmallhelp', () => {
        expect(hostIsSame({rootUrl: 'http://localhost:3000/', url: 'https://github.com/mikesmallhelp'})).equal(false);
    });
});

describe('generateRandomString', () => {
    it('generateRandomString', () => {
        expect(generateRandomString().length).equal(8);
    });
});

