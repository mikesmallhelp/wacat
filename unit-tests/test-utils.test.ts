import axios from 'axios';
import { expect } from 'chai';
import fs from 'node:fs';
import sinon from 'sinon';

import { generateRandomString, getHost, hostIsSame, readFileContent } from '../utils/test-utils.js';

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


describe('readFileContent', () => {
    it('should read file content from local file', async () => {
        const path = '/path/to/local/file.txt';
        const fileContent = 'Hello, World!\nThis is a test file.';
        const readFileStub = sinon.stub(fs.promises, 'readFile').resolves(fileContent);

        const result = await readFileContent({ path });

        expect(result).to.deep.equal(['Hello, World!', 'This is a test file.']);
        expect(readFileStub.calledOnceWith(path, 'utf-8')).to.be.true;

        readFileStub.restore();
    });

    it('should read file content from URL', async () => {
        const path = 'https://example.com/file.txt';
        const fileContent = 'Hello, World!\nThis is a test file.';
        const axiosGetStub = sinon.stub(axios, 'get').resolves({ data: fileContent });

        const result = await readFileContent({ path });

        expect(result).to.deep.equal(['Hello, World!', 'This is a test file.']);
        expect(axiosGetStub.calledOnceWith(path)).to.be.true;

        axiosGetStub.restore();
    });

    it('should handle error when reading file', async () => {
        const path = '/path/to/nonexistent/file.txt';
        const readFileStub = sinon.stub(fs.promises, 'readFile').rejects(new Error('File not found'));

        const result = await readFileContent({ path });

        expect(result).to.deep.equal([]);
        expect(readFileStub.calledOnceWith(path, 'utf-8')).to.be.true;

        readFileStub.restore();
    });

    it('should handle error when fetching URL', async () => {
        const path = 'https://example.com/nonexistent-file.txt';
        const axiosGetStub = sinon.stub(axios, 'get').rejects(new Error('URL not found'));

        const result = await readFileContent({ path });

        expect(result).to.deep.equal([]);
        expect(axiosGetStub.calledOnceWith(path)).to.be.true;

        axiosGetStub.restore();
    });
});




