/* eslint-disable perfectionist/sort-object-types */

import axios from 'axios';
import fse from 'fs-extra'; // eslint-disable-line import/default

export const hostIsSame = ({ rootUrl, url }: { rootUrl: string, url: string }): boolean => getHost({ url: rootUrl }) === getHost({ url });

export const getHost = ({ url }: { url: string }): string => {
    const parts = url.split("/");
    return parts.slice(0, 3).join("/").trim();
};

export const generateRandomString = (
    minLength: number,
    maxLength: number,
    charset: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:\'",.<>/?`~'
): string => {
    const length = Math.floor(Math.random() * (maxLength - minLength + 1)) + minLength;

    let randomString = '';
    for (let i = 0; i < length; i++) {
        const randomPos = Math.floor(Math.random() * charset.length);
        randomString += charset[randomPos];
    }

    return randomString;
};

export const generateRandomIndex = (min: number, max: number): number => Math.floor(Math.random() * (max - min + 1)) + min;

export const shuffleStringArray = (array: string[]): string[] => {
    const result = [...array];
    for (let i = result.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [result[i], result[j]] = [result[j], result[i]];
    }

    return result;
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
    errorTextsInPages?: string[];
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

export const generateRandomEmail = (): string => {
    const chars = 'abcdefghijklmnopqrstuvwxyz';
    return generateRandomString(6, 12, chars) + '.' + generateRandomString(6, 12, chars) + '@' + 
           generateRandomString(6, 12, chars) + '.' + getRandomDomain();
};

const getRandomDomain = (): string => {
    const domains = ['com', 'net', 'org', 'gov', 'edu'];
    return domains[Math.floor(Math.random() * domains.length)];
};
