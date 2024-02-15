/* eslint-disable perfectionist/sort-object-types */

import axios from 'axios';
import fse from 'fs-extra'; // eslint-disable-line import/default

export const hostIsSame = ({ rootUrl, url }: { rootUrl: string, url: string }): boolean => getHost({ url: rootUrl }) === getHost({ url });

export const getHost = ({ url }: { url: string }): string => {
    const parts = url.split("/");
    return parts.slice(0, 3).join("/").trim();
};

export const generateRandomString = (): string => {
    // Generate a random length between 1 and 55
    const length = Math.floor(Math.random() * 55) + 1;

    let randomString = '';
    for (let i = 0; i < length; i++) {
        let codePoint: number;

        // Decide whether to generate a western character or a non-western character
        // Approximately 5% chance to pick a non-western character
        if (Math.random() < 0.95) {
            // Western character ranges (mainly ASCII including letters, digits, and some punctuation)
            const ranges = [
                [0x30, 0x39], // Digits 0-9
                [0x41, 0x5A], // Uppercase A-Z
                [0x61, 0x7A], // Lowercase a-z
                [0x20, 0x2F], // Punctuation and space
            ];

            // Select a random range and generate a code point within that range
            const range = ranges[Math.floor(Math.random() * ranges.length)];
            codePoint = Math.floor(Math.random() * (range[1] - range[0] + 1)) + range[0];
        } else {
            // Non-western character range (e.g., Chinese characters)
            // This range includes a part of the CJK Unified Ideographs block
            const min = 0x4E_00;
            const max = 0x9F_AF;
            codePoint = Math.floor(Math.random() * (max - min + 1)) + min;
        }

        // Append the character to the string
        randomString += String.fromCodePoint(codePoint);
    }

    return randomString;
};

export const shuffleArray = (array: string[]): string[] => {
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