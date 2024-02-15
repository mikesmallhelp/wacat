/* eslint-disable perfectionist/sort-object-types */

import axios from 'axios';
import fse from 'fs-extra'; // eslint-disable-line import/default

export const hostIsSame = ({ rootUrl, url }: { rootUrl: string, url: string }): boolean => getHost({ url: rootUrl }) === getHost({ url });

export const getHost = ({ url }: { url: string }): string => {
    const parts = url.split("/");
    return parts.slice(0, 3).join("/").trim();
};

export const generateRandomString = (): string => {
    const length = Math.floor(Math.random() * 500) + 1;

    let randomString = '';
    for (let i = 0; i < length; i++) {
        const min = 0x20;
        const max = 0xD7_FF;

        const codePoint = Math.floor(Math.random() * (max - min + 1)) + min;

        randomString += String.fromCodePoint(codePoint);
    }

    return randomString;
};


export const readFileContent = async ({ path }: { path: string }): Promise<string[]> => {
    try {
        let response: string;

        if (path.startsWith('http://') || path.startsWith('https://')) {
            const axiosResponse = await axios.get(path);
            response = axiosResponse.data;
        } else {
            response = await fse.readFile(path.trim(), 'utf8'); // eslint-disable-line import/no-named-as-default-member
        }

        return response.split('\n');
    } catch (error: unknown) {
        console.log('Error reading file:', error);
        throw new Error('Error reading file: ' + error);
    }
}

export type AuthenticationConfiguration = {
    beforeAuthenticationLinkTexts?: string[];
    usernameLabel: string;
    usernameValue: string;
    usernameButtonLabel?: string;
    passwordLabel: string;
    passwordValue: string;
    loginButtonLabel: string
} | null;

export type Configuration = {
    errorTexts?: string[];
    authentication?: AuthenticationConfiguration;
    notVisitLinkUrls?: string[];
} | null;

export const readConfiguration = async ({ path }: { path: string }): Promise<Configuration> => {
    try {
        return await fse.readJson(path.trim()); // eslint-disable-line import/no-named-as-default-member
    } catch (error: unknown) {
        console.log('Error reading configuration:', error);
        throw new Error('Error reading file: ' + error);
    }
};