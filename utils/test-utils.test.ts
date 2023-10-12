import { getHost, hostIsSame, generateRandomString } from './test-utils';

describe('getHost', () => {
    it('http://localhost:3000/', () => {
        expect(getHost({url: 'http://localhost:3000/'})).toEqual('http://localhost:3000');
    });

    it('http://localhost:3000/x', () => {
        expect(getHost({url: 'http://localhost:3000/x'})).toEqual('http://localhost:3000');
    });

    it('https://github.com/mikesmallhelp', () => {
        expect(getHost({url: 'https://github.com/mikesmallhelp'})).toEqual('https://github.com');
    });
});

describe('hostIsSame', () => {
    it('true: rootUrl: http://localhost:3000/ url: http://localhost:3000/x', () => {
        expect(hostIsSame({rootUrl: 'http://localhost:3000/', url: 'http://localhost:3000/x'})).toEqual(true);
    });

    it('false: rootUrl: http://localhost:3000/ url: https://github.com/mikesmallhelp', () => {
        expect(hostIsSame({rootUrl: 'http://localhost:3000/', url: 'https://github.com/mikesmallhelp'})).toEqual(false);
    });
});

describe('generateRandomString', () => {
    it('generateRandomString', () => {
        expect(generateRandomString().length).toEqual(8);
    });
});

