/* eslint-disable perfectionist/sort-object-types */

import axios from 'axios';
import fs from 'node:fs';

export const hostIsSame = ({ rootUrl, url }: { rootUrl: string, url: string }): boolean => getHost({ url: rootUrl }) === getHost({ url });

export const getHost = ({ url }: { url: string }): string => {
    const parts = url.split("/");
    return parts.slice(0, 3).join("/");
};

export const generateRandomString = (): string => Math.floor(Math.random() * Date.now()).toString(36);

export const readFileContent = async ({ path }: { path: string }): Promise<string[]> => {
    try {
        let response: string;

        if (path.startsWith('http://') || path.startsWith('https://')) {
            const axiosResponse = await axios.get(path);
            response = axiosResponse.data;
        } else {
            response = await fs.promises.readFile(path, 'utf8');
        }

        return response.split('\n');
    } catch (error) {
        console.error('Error reading file:', error);
        return [];
    }
}

export type AuthenticationConfiguration = {
    beforeAuthenticationLinkNames?: string[];
    usernameLabel: string;
    usernameValue: string;
    usernameButtonLabel?: string;
    passwordLabel: string;
    passwordValue: string;
    finishButtonLabel: string;
} | null;

export const readAuthencticationConfiguration = async ({ path }: { path: string }): Promise<AuthenticationConfiguration> => {
    try {
        let content: string;

        if (path.startsWith('http://') || path.startsWith('https://')) {
            const response = await axios.get(path);
            content = response.data;
        } else {
            content = fs.readFileSync(path, 'utf8');
        }

        return JSON.parse(content);
    } catch (error) {
        console.error('Error reading authentication configuration:', error);
        return null;
    }
};