import { expect } from 'chai';

import {
    generateRandomString, getHost, hostIsSame, shuffleStringArray
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
        expect(hostIsSame({ rootUrl: 'https://mikesmallhelp-test-application.vercel.app/', 
                            url: 'https://mikesmallhelp-test-application.vercel.app/working-page' })).equal(true);
    });

    it('false: different hosts', () => {
        expect(hostIsSame({ rootUrl: 'http://localhost:3000/', url: 'https://github.com/mikesmallhelp' })).equal(false);
    });
});

describe('generateRandomString', () => {
    it('generateRandomString', () => {
        expect(generateRandomString(3,5).length).greaterThanOrEqual(3).and.lessThanOrEqual(5);
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

