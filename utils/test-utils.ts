/* eslint-disable perfectionist/sort-object-types */

import axios from 'axios';
import fse from 'fs-extra'; // eslint-disable-line import/default
import { OpenAI } from 'openai';

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

export const shuffleArray = (array: any[]): any[] => { // eslint-disable-line @typescript-eslint/no-explicit-any
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

export const generateNumberArrayFrom0ToMax = (max: number): number[] => Array.from({ length: max + 1 }, (_, i) => i);

export const generateRandomUrl = (): string => {
    const domainSuffixes = [".com", ".net", ".org", ".info", ".biz"];
    const randomSuffix = domainSuffixes[Math.floor(Math.random() * domainSuffixes.length)];
    const randomDomain = generateRandomString(5, 10, "abcdefghijklmnopqrstuvwxyz0123456789");
    return "https://" + randomDomain + randomSuffix;
};

export const generateRandomDate = (addYearMin: number, addYearMax: number, separator: string): string => {
    const currentDate = new Date();
    const startYear = currentDate.getFullYear() + addYearMin;
    const endYear = currentDate.getFullYear() + addYearMax;

    const randomYear = startYear + Math.floor(Math.random() * (endYear - startYear + 1));
    const randomMonth = Math.floor(Math.random() * 12);
    const daysInMonth = new Date(randomYear, randomMonth + 1, 0).getDate();
    const randomDay = Math.floor(Math.random() * daysInMonth) + 1;

    const formattedMonth = (randomMonth + 1).toString().padStart(2, '0');
    const formattedDay = randomDay.toString().padStart(2, '0');
    return `${formattedDay}${separator}${formattedMonth}${separator}${randomYear}`;
};

export const generateRandomInteger = (min: number, max: number): number => Math.floor(Math.random() * (max - min + 1)) + min;

export const aiDetectsError = async (pageContent: string, debug: boolean): Promise<boolean> => {
    const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
    });
    
    const openAiModel = process.env.OPENAI_MODEL;
    if (!openAiModel) {
        throw new Error('OpenAI model not configured!');
    }

    const response = await openai.chat.completions.create({
        max_tokens: 50, // eslint-disable-line camelcase
        messages: [
            {"content": `Analyze the provided text content and determine if it includes any error message that could indicate a technical issue on a webpage.
                         This includes both programming-related errors (e.g. "NullPointerException", "SyntaxError", "500 Internal Server Error") and 
                         general user-facing error messages (e.g. "Server error: Unable to process your request at this time.", "Something went wrong"). 
                         Messages that simply inform users that data was not found or is unavailable are not considered errors 
                         (e.g., "No results found" or "No data available" are not errors in this context). If the content contains an error message, 
                         respond with 'true'. If it does not, respond with 'false'.`, "role": "system"},
            {"content": "Registration page Error 404 Page not found. The page you are looking for might have been removed or is temporarily unavailable.", "name":"example_user", "role": "system"},
            {"content": "true", "name":"example_assistant", "role": "system"},
            {"content": "Information page An error occurred, please try again later.", "name":"example_user", "role": "system"},
            {"content": "true", "name":"example_assistant", "role": "system"},
            {"content": "Registration page Your name Address Phonenumber Food selection Card number Driving license Register now", "name":"example_user", "role": "system"},
            {"content": "false", "name":"example_assistant", "role": "system"},
            {"content": "Vacation search No flights found", "name":"example_user", "role": "system"},
            {"content": "false", "name":"example_assistant", "role": "system"},
            {"content": `${pageContent}`, "role": "user"},
        ],
        model: openAiModel,
    });

    const openAiResponse =  response.choices[0]?.message?.content?.trim().toLowerCase();

    if (debug) {
        console.log('  openAiResponse:', openAiResponse);
    }

    return Boolean(openAiResponse === 'true').valueOf(); 
};

export const addSpacesToCamelCaseText = (text: string): string => text.replaceAll(/([A-Za-z])(\d)/g, '$1 $2').replaceAll(/(\d)([A-Za-z])/g, '$1 $2').replaceAll(/([a-z])([A-Z])/g, '$1 $2')
