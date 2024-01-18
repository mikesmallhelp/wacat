/* eslint-disable perfectionist/sort-object-types */

import axios from 'axios';
import fs from 'node:fs';
import waitForExpect from 'wait-for-expect';

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
        const content: string = fs.readFileSync(path, 'utf8');
        return JSON.parse(content);
    } catch (error) {
        console.error('Error reading authentication configuration:', error);
        return null;
    }
};

export const createNetworkHelper = (page: any): any => {
    let pendingRequests: Set<any> = new Set();

    const initNetworkSettledListeners = () => {
        page.on('request', (request: any) => pendingRequests.add(request));
        page.on('requestfailed', (request: any) => pendingRequests.delete(request));
        page.on('requestfinished', (request: any) => pendingRequests.delete(request));
    };

    const waitForNetworkSettled = async (timeout: number = 30000) => {
        await waitForExpect(() => {
            if (pendingRequests.size !== 0) {
                const pendingUrls = Array.from(pendingRequests).map(req => req.url());
                throw Error(
                    `Timeout: Waiting for settled network, but there are following pending requests after ${timeout}ms.\n${pendingUrls.join('\n')}`
                );
            }
        }, timeout);
    };

    initNetworkSettledListeners();

    return {
        waitForNetworkSettled
    };
};