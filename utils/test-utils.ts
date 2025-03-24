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

type HeaderConfiguration = {
    name: string;
    value: string;
}

export type Configuration = {
    errorTextsInPages?: string[];
    authentication?: AuthenticationConfiguration;
    notVisitLinkUrls?: string[];
    doNotPushButtons?: string[];
    headers?: HeaderConfiguration[];
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

    const openAiModel = process.env.OPENAI_API_MODEL;
    if (!openAiModel) {
        throw new Error('OpenAI model not configured!');
    }

    if (debug) {
        console.log('  ***********pageContent***********');
        console.log('  ' + pageContent);
        console.log('  *******************************');
    }

    const response = await openai.chat.completions.create({
        max_completion_tokens: 1, // eslint-disable-line camelcase
        messages: [
            {
                "content": `Analyze the provided text content and determine if it includes any error message that could indicate a technical issue on a webpage.
                             This includes programming-related errors (e.g., "NullPointerException", "SyntaxError", "500 Internal Server Error") and
                             general user-facing error messages (e.g., "Server error: Unable to process your request at this time.", "Something went wrong"). 
                             Messages that simply inform users that data was not found or is unavailable (e.g., "No results found" or "No data available") 
                             are not considered errors in this context. Additionally, any validation errors related to user input, such as missing, 
                             incorrect, invalid, or otherwise unacceptable input data (e.g., "Validation error: Address is missing", 
                             "Validation error: Credit card number wrong format", "Validation error: Input exceeds maximum length"), 
                             are not considered errors and should return 'false'. If the content contains an error message indicating a technical issue, 
                             respond with 'true'. Otherwise, respond with 'false'.`,
                "role": "system"
            },
            { "content": "Registration page Error 404 Page not found. The page you are looking for might have been removed or is temporarily unavailable.", "name": "example_user", "role": "system" },
            { "content": "true", "name": "example_assistant", "role": "system" },
            { "content": "Information page An error occurred, please try again later.", "name": "example_user", "role": "system" },
            { "content": "true", "name": "example_assistant", "role": "system" },
            { "content": "Registration page Your name Address Phonenumber Food selection Card number Driving license Register now", "name": "example_user", "role": "system" },
            { "content": "false", "name": "example_assistant", "role": "system" },
            { "content": "Vacation search No flights found", "name": "example_user", "role": "system" },
            { "content": "false", "name": "example_assistant", "role": "system" },
            { "content": "Test page Registration page Name Address Phonenumber Credit card number Validation error: Address is missing Validation error: Credit card number wrong format.", "name": "example_user", "role": "system" },
            { "content": "false", "name": "example_assistant", "role": "system" },
            { "content": "Test page Name Phonenumber Validation error: Input exceeds maximum length.", "name": "example_user", "role": "system" },
            { "content": "false", "name": "example_assistant", "role": "system" },
            { "content": `${pageContent}`, "role": "user" },
        ],
        model: openAiModel
    });

    const openAiResponse = response.choices[0]?.message?.content?.trim().toLowerCase();

    if (debug) {
        console.log('  openAiResponse:', openAiResponse);
    }

    return Boolean(openAiResponse === 'true').valueOf();
};

export const addSpacesToCamelCaseText = (text: string): string => text.replaceAll(/([A-Za-z])(\d)/g, '$1 $2').replaceAll(/(\d)([A-Za-z])/g, '$1 $2').replaceAll(/([a-z])([A-Z])/g, '$1 $2')

export const truncateString = (str: string, maxLength: number): string => str.length > maxLength ? str.slice(0, maxLength) : str;

export const generateInputContentWithAi = async (pageContent: string, inputType: string, inputAutocomplete: string, inputPlaceholder: string,
    inputLabel: string, lastAiGeneratedValues: string[], debug: boolean):
    Promise<string> => {
    const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
    });

    const openAiModel = process.env.OPENAI_API_MODEL;
    if (!openAiModel) {
        throw new Error('OpenAI model not configured!');
    }

    if (debug) {
        console.log('  ***********generateInputContentWithAi***********');
        console.log('  pageContent:' + pageContent);
        console.log('  inputType:' + inputType);
        console.log('  inputAutocomplete:' + inputAutocomplete);
        console.log('  inputPlaceholder:' + inputPlaceholder);
        console.log('  inputLabel:' + inputLabel);
        console.log('  lastAiGeneratedValues' + JSON.stringify(lastAiGeneratedValues));
        console.log('  *******************************');
    }

    const lastAiGeneratedValuesAsString = JSON.stringify(lastAiGeneratedValues);

    const response = await openai.chat.completions.create({
        messages: [
            {
                "content": `You are a system that generates realistic and contextually appropriate fake input values for HTML input fields based on the 
                            given page content (pageContent), input element type (inputType), input element autocomplete (inputAutocomplete), 
                            input element placeholder (inputPlaceholder) and label (inputLabel). 
                            You get also last previously generated values (lastAiGeneratedValues). 
                
                Consider the following:
                1. Generate inputs that match the cultural and linguistic context of the provided page content. For instance, if the page is in French, use French names, addresses, and date formats.
                2. Match the format and data type of the input field. For example:
                    - For "date" fields, follow regional date formats like DD/MM/YYYY or MM/DD/YYYY.
                      -Exception: If the type attribute of an input element is set to date, always use the ISO standard format YYYY-MM-DD 
                    - For "email" fields, generate realistic email addresses with common domain names.
                    - For "text" fields with labels like "Name", generate realistic names for the region implied by the content.
                3. If inputType or inputLabel is missing, infer the most appropriate data type and content from the context of the pageContent.
                4. Prioritize realism and consistency with the page's context and intended audience.
                5. The variable lastAiGeneratedValues contains previously generated values. Make use of them as needed in appropriate situations. 
                   For example if lastAiGeneratedValues contains entries "James" and "Harrison" and current field is "email" field,
                   the generated email could be james.harrison@example.com.
                6. Generate all names so that they begin with an uppercase letter. For example, people’s names, street names, etc. For example
                   "James", "Harrison", "1234 Maple Street". 
                
                Output only the generated fake input value.`,
                "role": "system"
            },
            {
                "content": "pageContent: Registration page Please fill your information here. Name Address Email Driving license Date of birth Food selection Pet's name" +
                    "inputType: text" +
                    "inputAutocomplete: no autocomplete" +
                    "inputPlaceholder: no placeholder" +
                    "inputLabel: Date of birth" +
                    "lastAiGeneratedValues ['James','Harrison']", 
                "name": "example_user",
                "role": "system"
            },
            { "content": "25/12/2000", "name": "example_assistant", "role": "system" },
            {
                "content": "pageContent: Rekisteröintisivu Täytä tiedot tähän. Nimi Osoite Sähköposti Ajokortti Syntymäaika Ruokavalinta Lemmikkieläimen nimi" +
                    "inputType: no type" +
                    "inputAutocomplete: no autocomplete" +
                    "inputPlaceholder: 01.01.1990" +
                    "inputLabel: no label" +
                    "lastAiGeneratedValues ['Keijo','Kolmonen']",
                "name": "example_user",
                "role": "system"
            },
            { "content": "05.11.2020", "name": "example_assistant", "role": "system" },
            {
                "content": "pageContent: Registration page Please fill your information here. Name Address Email Driving license Date of birth Food selection Pet's name" +
                    "inputType: no type" +
                    "inputAutocomplete: email" +
                    "inputPlaceholder: no placeholder" +
                    "inputLabel: no label" +
                    "lastAiGeneratedValues ['James','Harrison']",
                "name": "example_user",
                "role": "system"
            },
            { "content": "james.harrison@gmail.com", "name": "example_assistant", "role": "system" },
            {
                "content": `pageContent: ${pageContent}, inputType: ${inputType}, inputAutocomplete: ${inputAutocomplete}, inputPlaceholder: ${inputPlaceholder},  
                            inputLabel: ${inputLabel}, lastAiGeneratedValues: ${lastAiGeneratedValuesAsString}`, 
                "role": "user"
            }
        ],
        model: openAiModel
    });

    const generatedInputValue = response.choices[0]?.message?.content?.trim().toLowerCase() || '';

    if (debug) {
        console.log('  ***********generateInputContentWithAi***********');
        console.log('  generatedInputValue:' + generatedInputValue);
        console.log('  *******************************');
    }

    return generatedInputValue;
};

export const generateBrokenInputContentWithAi = async (pageContent: string, inputType: string, inputAutocomplete: string, inputPlaceholder: string,
    inputLabel: string, debug: boolean):
    Promise<string> => {
    const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
    });

    const openAiModel = process.env.OPENAI_API_MODEL;
    if (!openAiModel) {
        throw new Error('OpenAI model not configured!');
    }

    if (debug) {
        console.log('  ***********generateBrokenInputContentWithAi***********');
        console.log('  pageContent:' + pageContent);
        console.log('  inputType:' + inputType);
        console.log('  inputAutocomplete:' + inputAutocomplete);
        console.log('  inputPlaceholder:' + inputPlaceholder);
        console.log('  inputLabel:' + inputLabel);
        console.log('  *******************************');
    }

    const response = await openai.chat.completions.create({
        messages: [
            {
                "content": `You are a system that generates broken or invalid fake input values for HTML input fields based on the given 
                page content (pageContent), input element type (inputType), input element autocomplete (inputAutocomplete), 
                input element placeholder (inputPlaceholder) and label (inputLabel). 
                Your goal is to create input values that range in severity, including:
                
                1. **Mildly broken inputs**: Introduce **only one** error likely to disrupt parsing or validation. 
                   One third of the generated inputs should be these. 
                2. **Moderately broken inputs**: Introduce a few errors that make the input harder to parse but still somewhat plausible.
                   One third of the generated inputs should be these.
                3. **Severely broken inputs**: Create highly erroneous inputs, sometimes exceeding normal lengths (e.g., over 100 characters).
                   One third of the generated inputs should be these.
    
                When generating inputs:
                - Recognize regional and cultural context based on the page content (pageContent) and use appropriate formats for the region.
                - Modify formats in ways that mimic human errors or unusual behavior, but maintain the intention to challenge parsing and validation.
                - Example Guidelines:
                    - Dates: For mild errors, introduce one small anomaly like "25..11.2024". For moderate errors, an example is 12.25..2024.2024. For severe errors, 
                              create something like 
                             "25..11..2#02sdkldfjlsjfldsflsdjfldsjfldsjflkdsjfldsjfldjfdslfjdlfjlsfjldsfjlsdjfldsjfldskjfdlsjfldsjflfjldsjl".
                    - Emails: For mild errors, create something like "matti.makinen@gmail,com". For moderate errors, an example is john@johnsson@gmail@com@com. 
                              For severe errors, create something like 
                             "user@@example@@.comlksdkjflsdfdlsfldsfkjdslkflöksfkldsfldsjfldskfjlsdfjldsfjlkdsjfdslkfjdsflddsjlkfjdls".
                    - Text fields: Mild errors might replace one letter, e.g., "Märi€ Curie". For moderate errors, an example is Mari€ €Johs€€¥€€€€. Severe errors might 
                               include multiple invalid Unicode characters 
                                   or symbols, like "J¥hn&#@$#\uFFFF_Reynoldsddsjlfsdjlfsllslsdjflkdsjflsdkfjldskjfdslfkjdslfjlsdfjlsdjflkdsjflsdjfldsjfldslfdsldslfjdslf".
                    - Addresses: Mild errors might replace one letter, like "123 Mai¥n St". For moderate errors, an example is St$$$ree Street 754. 
                                 Severe errors might introduce completely nonsensical strings, 
                                 like "AB^DE@!!lskdkdksl¥¥¥¥¥¥¥¥¥¥¥¥¥¥¥¥¥¥¥¥¥¥¥¥¥¥¥¥¥¥¥¥¥¥¥¥¥¥¥¥¥¥¥slkiu39kledlsdldflfdjflkdsfklslsslls¥¥¥¥¥¥¥¥¥¥¥¥¥¥¥¥¥¥¥¥¥¥¥".
    
                Respond only with the generated broken input value. Do not provide explanations.`,
                "role": "system"
            },
            {
                "content": "pageContent: Registration page Please fill your information here. Name Address Email Driving license Date of birth Food selection" +
                    "Pet's name" +
                    "inputType: text" +
                    "inputAutocomplete: no autocomplete" +
                    "inputPlaceholder: no placeholder" +
                    "inputLabel: Date of birth",
                "name": "example_user",
                "role": "system"
            },
            { "content": "2#11.2024", "name": "example_assistant", "role": "system" },
            {
                "content": "pageContent: Rekisteröintisivu Täytä tiedot tähän. Nimi Osoite Sähköposti Ajokortti Syntymäaika Ruokavalinta Lemmikkieläimen nimi" +
                    "inputType: text" +
                    "inputAutocomplete: no autocomplete" +
                    "inputPlaceholder: 01.01.2025" +
                    "inputLabel: no label",
                "name": "example_user",
                "role": "system"
            },
            { "content": "25.11.2.24.20.25", "name": "example_assistant", "role": "system" },
            {
                "content": "pageContent: Registration page Please fill your information here. Name Address Email Driving license Date of birth Food selection Pet's name" +
                    "inputType: no type" +
                    "inputAutocomplete: email" +
                    "inputPlaceholder: no placeholder" +
                    "inputLabel: no label",
                "name": "example_user",
                "role": "system"
            },
            {
                "content": "mark.roberts@gmail,com", "name": "example_assistant",
                "role": "system"
            },
            {
                "content": "pageContent: Registration page Please fill your information here. Name Address Email Driving license Date of birth Food selection Pet's name" +
                    "inputType: email" +
                    "inputAutocomplete: no autocomplete" +
                    "inputPlaceholder: john.doe@example.com" +
                    "inputLabel: no label",
                "name": "example_user",
                "role": "system"
            },
            {
                "content": "ma&rk.ro&#berts@gmail,com¥dskljfklsfjlsdfjlds¥ddjklfjdslfdjlkls7575jdfjksd¥ds&klfjldklfjdslfdklfjdslfdklfjdslfdklfjdslfdklfjdslfd",
                "name": "example_assistant",
                "role": "system"
            },
            {
                "content": `pageContent: ${pageContent}, inputType: ${inputType}, inputAutocomplete: ${inputAutocomplete}, inputPlaceholder: ${inputPlaceholder},
                            inputLabel: ${inputLabel}`,
                "role": "user"
            }
        ],
        model: openAiModel
    });

    const generatedInputValue = response.choices[0]?.message?.content?.trim().toLowerCase() || '';

    if (debug) {
        console.log('  ***********generateBrokenInputContentWithAi***********');
        console.log('  generatedInputValue:' + generatedInputValue);
        console.log('  *******************************');
    }

    return generatedInputValue;
};

export const probabilityCheck = (probability: number): boolean => {
    if (probability < 0 || probability > 100) {
        throw new Error("Probability must be between 0 and 100.");
    }

    return Math.random() * 100 < probability;
};

export const getStringUntilQuestionMark = (str: string): string => {
    const questionMarkIndex = str.indexOf('?');
    return questionMarkIndex === -1
        ? str
        : str.slice(0, Math.max(0, questionMarkIndex + 1));
};