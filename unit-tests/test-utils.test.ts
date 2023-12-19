/* eslint-disable perfectionist/sort-objects */

import axios from 'axios';
import { expect } from 'chai';
import fs from 'node:fs';
import sinon from 'sinon';

import {
    Configuration, generateRandomString, getHost, hostIsSame,
    readConfiguration, readFileContent
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
        expect(generateRandomString().length).greaterThanOrEqual(7);
    });
});

describe('readFileContent', () => {
    it('should read file content from local file', async () => {
        const path = '/path/to/local/file.txt';
        const fileContent = 'Hello, World!\nThis is a test file.';
        const readFileStub = sinon.stub(fs.promises, 'readFile').resolves(fileContent);

        const result = await readFileContent({ path });

        expect(result).to.deep.equal(['Hello, World!', 'This is a test file.']);
        expect(readFileStub.calledOnceWith(path, 'utf8')).to.be.true;

        readFileStub.restore();
    });

    it('should read file content from http URL', async () => {
        doReadFileContentTest({ path: 'http://example.com/file.txt' });
    });

    it('should read file content from https URL', async () => {
        doReadFileContentTest({ path: 'https://example.com/file.txt' });
    });

    it('should handle error when reading file', async () => {
        const path = '/path/to/nonexistent/file.txt';
        const readFileStub = sinon.stub(fs.promises, 'readFile').rejects(new Error('File not found'));

        const result = await readFileContent({ path });

        expect(result).to.deep.equal([]);
        expect(readFileStub.calledOnceWith(path, 'utf8')).to.be.true;

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

const doReadFileContentTest = async ({ path }: { path: string }) => {
    const fileContent = 'Hello, World!\nThis is a test file.';
    const axiosGetStub = sinon.stub(axios, 'get').resolves({ data: fileContent });

    const result = await readFileContent({ path });

    expect(result).to.deep.equal(['Hello, World!', 'This is a test file.']);
    expect(axiosGetStub.calledOnceWith(path)).to.be.true;

    axiosGetStub.restore();
}

describe('readAuthencticationConfiguration', () => {
    it('should read authentication configuration from local file', async () => {
        const path = '/path/to/authentication-config.json';
        const configContent = `
        {
            "authentication": {
                "usernameLabel": "Username",
                "usernameValue": "testuser",
                "passwordLabel": "Password",
                "passwordValue": "123456",
                "finishButtonLabel": "Login"
            }
        }`;
        const expectedConfig: Configuration =
        {
            authentication: {
                usernameLabel: 'Username',
                usernameValue: 'testuser',
                passwordLabel: 'Password',
                passwordValue: '123456',
                finishButtonLabel: 'Login',
            }
        };

        const readFileStub = sinon.stub(fs, 'readFileSync').returns(configContent);
        const result = await readConfiguration({ path });

        expect(result).to.deep.equal(expectedConfig);
        expect(readFileStub.calledOnceWith(path, 'utf8')).to.be.true;

        readFileStub.restore();
    });

    it('should read authentication configuration from http URL', async () => {
        doReadAuthencticationConfigurationTest({ path: 'http://example.com/authentication-config.json' });
    });

    it('should read authentication configuration from https URL', async () => {
        doReadAuthencticationConfigurationTest({ path: 'https://example.com/authentication-config.json' });
    });

    it('should handle error when reading authentication configuration from local file', async () => {
        const path = '/path/to/nonexistent/authentication-config.json';
        const readFileStub = sinon.stub(fs, 'readFileSync').throws(new Error('File not found'));

        const result = await readConfiguration({ path });

        expect(result).to.be.null;
        expect(readFileStub.calledOnceWith(path, 'utf8')).to.be.true;

        readFileStub.restore();
    });

    it('should handle error when fetching authentication configuration from URL', async () => {
        const path = 'https://example.com/nonexistent-authentication-config.json';
        const axiosGetStub = sinon.stub(axios, 'get').rejects(new Error('URL not found'));

        const result = await readConfiguration({ path });

        expect(result).to.be.null;
        expect(axiosGetStub.calledOnceWith(path)).to.be.true;

        axiosGetStub.restore();
    });
});

const doReadAuthencticationConfigurationTest = async ({ path }: { path: string }) => {
    const configContent = `
    {
        "authentication": {
            "beforeAuthenticationLinkNames": ["Login"],
            "usernameLabel": "Username",
            "usernameValue": "testuser",
            "usernameButtonLabel": "Next",
            "passwordLabel": "Password",
            "passwordValue": "123456",
            "finishButtonLabel": "Login"
        },
        "notVisitLinkUrls": ["http://localhost:3000/logout"]
      }`;
    const expectedConfig: Configuration = {
        authentication: {
            beforeAuthenticationLinkNames: ['Login'],
            usernameLabel: 'Username',
            usernameValue: 'testuser',
            usernameButtonLabel: 'Next',
            passwordLabel: 'Password',
            passwordValue: '123456',
            finishButtonLabel: 'Login'
        },
        notVisitLinkUrls: ['http://localhost:3000/logout']
    };

    const axiosGetStub = sinon.stub(axios, 'get').resolves({ data: configContent });
    const result = await readConfiguration({ path });

    expect(result).to.deep.equal(expectedConfig);
    expect(axiosGetStub.calledOnceWith(path)).to.be.true;

    axiosGetStub.restore();
}