/* eslint-disable no-await-in-loop */

import { Locator, Page, expect, test } from '@playwright/test';
import { config as dotenvConfig } from 'dotenv';
dotenvConfig();
import { fail } from 'node:assert';

import {
    Configuration, addSpacesToCamelCaseText, aiDetectsError, generateBrokenInputContentWithAi, generateInputContentWithAi, generateNumberArrayFrom0ToMax, generateRandomDate, generateRandomEmail,
    generateRandomIndex, generateRandomInteger, generateRandomString, generateRandomUrl, getStringUntilQuestionMark, hostIsSame, probabilityCheck,
    readConfiguration, readFileContent, shuffleArray, truncateString
} from '../utils/test-utils';

const wait: number = process.env.WAIT ? Number(process.env.WAIT) : 5000;
const timeout: number = process.env.TIMEOUT ? Number(process.env.TIMEOUT) * 1000 : 120_000;
const visitedUrlsOrNotVisitLinkUrls: string[] = [];
const rootUrl = process.env.ROOT_URL;
const configuration: Configuration = process.env.CONFIGURATION_FILE_PATH ?
    await readConfiguration({ path: process.env.CONFIGURATION_FILE_PATH }) : null;
const onlyLinks: boolean = Boolean(process.env.ONLY_LINKS);
const debug: boolean = Boolean(process.env.DEBUG);
const bypassHttpErrors = Boolean(process.env.BYPASS_HTTP_ERRORS);
const bypassBrowserConsoleErrors = Boolean(process.env.BYPASS_BROWSER_CONSOLE_ERRORS);
const randomInputTextsMinLength = process.env.RANDOM_INPUT_TEXTS_MIN_LENGTH ? Number(process.env.RANDOM_INPUT_TEXTS_MIN_LENGTH) : 1;
const randomInputTextsMaxLength = process.env.RANDOM_INPUT_TEXTS_MAX_LENGTH
    ? Number(process.env.RANDOM_INPUT_TEXTS_MAX_LENGTH) : randomInputTextsMinLength + 59;
const randomInputTextsCharset = process.env.RANDOM_INPUT_TEXTS_CHARSET;
const inputTexts: string[] = process.env.INPUT_TEXTS_FILE_PATH ?
    await readFileContent({ path: process.env.INPUT_TEXTS_FILE_PATH }) : [generateRandomString(randomInputTextsMinLength, randomInputTextsMaxLength,
        randomInputTextsCharset)];
const openAiApiKeyGiven = Boolean(process.env.OPENAI_API_KEY);
const ignoreAiInTest = Boolean(process.env.IGNORE_AI_IN_TEST);
const bypassAiErrors = Boolean(process.env.BYPASS_AI_ERRORS);
const maxPageContentChars = process.env.MAX_PAGE_CONTENT_CHARS ? Number(process.env.MAX_PAGE_CONTENT_CHARS) : 3000;
const aiGeneratedInputTexts = process.env.AI_GENERATED_INPUT_TEXTS === 'true';
const ignoreAiGeneratedInputTextsInTests = Boolean(process.env.IGNORE_AI_GENERATED_INPUT_TEXTS_IN_TEST);
const brokenInputValues = Boolean(process.env.BROKEN_INPUT_VALUES);
const brokenInputValuesPercentage = process.env.BROKEN_INPUT_VALUES_PERCENTAGE ? Number(process.env.BROKEN_INPUT_VALUES_PERCENTAGE) : 100;

const addUrlToVisitedUrlsOrNotVisitLinkUrls = (url: string) => {
    visitedUrlsOrNotVisitLinkUrls.push(getStringUntilQuestionMark(url));
}

const visitedUrlsOrNotVisitLinkUrlsIncludesUrl = (url: string): boolean =>
    visitedUrlsOrNotVisitLinkUrls.includes(getStringUntilQuestionMark(url))

if (!rootUrl) {
    throw new Error('ROOT_URL environment variable is not set');
}

if (!aiGeneratedInputTexts && (brokenInputValues || process.env.BROKEN_INPUT_VALUES_PERCENTAGE)) {
    throw new Error(`You are using either the broken-input-values or broken-input-values-percentage flag, but the AI_GENERATED_INPUT_TEXTS 
                     environment variable is not set.
                     Please ensure that the OPENAI_API_KEY and OPENAI_API_MODEL environment variables are also configured.`);
}

if (!brokenInputValues && process.env.BROKEN_INPUT_VALUES_PERCENTAGE) {
    throw new Error('You are using the broken-input-values-percentage flag. Please ensure that you also use the broken-input-values flag.');
}

if (configuration && configuration.notVisitLinkUrls && configuration.notVisitLinkUrls.length > 0) {
    for (const url of configuration.notVisitLinkUrls) {
        addUrlToVisitedUrlsOrNotVisitLinkUrls(url);
    }
}

if (configuration?.headers?.length) {
    const headersObject: Record<string, string> = {};

    for (const header of configuration.headers) {
        headersObject[header.name] = header.value;
    }

    test.use({
        extraHTTPHeaders: headersObject
    });
}

test('test an application', async ({ page }) => {
    test.setTimeout(timeout);
    await page.goto(rootUrl);
    await waitForTimeout({ page });

    page.on('response', response => {
        const status = response.status();

        if (status >= 400) {
            const message = `In the page: ${page.url()}: Request to ${response.url()} resulted in status code ${status}`;
            console.log(message);

            if (!bypassHttpErrors) {
                fail(message);
            }
        }
    });

    page.on('console', msg => {
        if (msg.type() === 'error') {
            const message = `In the page: ${page.url()}: Found an error message in the browser's console: ${msg.text()}`;
            console.log(message);

            if (!bypassBrowserConsoleErrors && !bypassHttpErrors) {
                fail(message);
            }
        }
    });

    if (configuration && configuration.authentication) {
        await authenticate({ page });
    }

    await handlePage({ page });
});

const authenticate = async ({ page }: { page: Page }) => {
    if (debug) {
        console.log('  authenticate');
    }

    if (!configuration || !configuration.authentication ||
        !configuration?.authentication?.usernameLabel ||
        !configuration?.authentication?.usernameValue ||
        !configuration?.authentication?.passwordLabel ||
        !configuration?.authentication?.passwordValue ||
        !configuration?.authentication?.loginButtonLabel) {
        throw new Error('Authentication configuration is not set, value: ' + JSON.stringify(configuration));
    }

    if (configuration.authentication.beforeAuthenticationLinkTexts) {
        if (debug) {
            console.log('  authenticate, beforeAuthenticationLinkTexts');
        }

        for (const linkName of configuration.authentication.beforeAuthenticationLinkTexts) {
            page.getByText(linkName).click();
        }
    }

    await page.getByLabel(configuration.authentication.usernameLabel).fill(configuration.authentication.usernameValue);

    if (configuration.authentication.usernameButtonLabel) {
        if (debug) {
            console.log('  authenticate, usernameButtonLabel');
        }

        await page.getByRole('button', { exact: true, name: `${configuration.authentication.usernameButtonLabel}` }).click();
    }

    await page.getByLabel(configuration.authentication.passwordLabel).fill(configuration.authentication.passwordValue);
    await page.getByRole('button', { exact: true, name: `${configuration.authentication.loginButtonLabel}` }).click();

    console.log('Filled the username and the password. Pushed the authentication button');
}

const handlePage = async ({ page }: { page: Page }) => {
    console.log('In the page: ' + page.url());

    await waitForTimeout({ page });
    addUrlToVisitedUrlsOrNotVisitLinkUrls(page.url());

    await checkPageForErrors({ page });

    if (onlyLinks) {
        if (debug) {
            console.log('  handlePage, onlyLinks');
        }
    } else {
        await fillDifferentTypesInputsAndClickButtons({ page });
    }

    await visitLinks({ page });
}

const getPageTextContents = async ({ page }: { page: Page }): Promise<string> => {
    const rawContent = await page.locator('body').innerText(); // eslint-disable-line unicorn/prefer-dom-node-text-content
    const rawContentWithoutLineBreaks = rawContent.replaceAll(/[\n\r]+/g, ' ');
    return addSpacesToCamelCaseText(rawContentWithoutLineBreaks);
}

const checkPageForErrors = async ({ page }: { page: Page }) => {
    if (debug) {
        console.log('  checkPageForErrors');
    }

    const content = await getPageTextContents({ page });

    if (debug) {
        console.log('  ***********content***********');
        console.log('  ' + content);
        console.log('  *******************************');
    }

    if (openAiApiKeyGiven && !ignoreAiInTest) {
        console.log(`Check with the AI that the page doesn't contain errors.`);

        if (await aiDetectsError(truncateString(content, maxPageContentChars), debug)) {
            const errorMessage = "The AI detected that current page contains error, the page contents are: " + content;

            if (bypassAiErrors) {
                console.log(errorMessage);
            } else {
                fail(errorMessage);
            }
        }
    }

    if (!configuration || !configuration.errorTextsInPages || configuration.errorTextsInPages.length === 0) {
        return;
    }

    if (debug) {
        console.log('  checkPageForErrors, errorTextsInPages.length: ' + configuration.errorTextsInPages.length);
    }

    for (const errorText of configuration.errorTextsInPages) {
        console.log(`Check that the page doesn't contain the ${errorText} text`);
        expect(content).not.toContain(errorText);
    }
}

const fillDifferentTypesInputsAndClickButtons = async ({ page }: { page: Page }) => {
    if (debug) {
        console.log('  fillDifferentTypesInputsAndClickButtons');
    }

    const currentUrl = page.url();
    const buttonsLocator = page.locator(
        'button:not([disabled]), input[type="submit"]:not([disabled]), input[type="button"]:not([disabled])'
    ).filter({
        hasNotText: new RegExp(`^(${configuration?.doNotPushButtons?.join('|')})$`)
    });
    const buttonsCount = await buttonsLocator.count();

    if (buttonsCount === 0) {
        if (debug) {
            console.log('  buttonsCount == 0, do not fill input texts etc.');
        }

        return;
    }

    let movedToDifferentPage = false;
    let firstButtonIsHandled = false;
    let inputTextsIndex = 0;

    while (inputTextsIndex < inputTexts.length) {
        const inputText = inputTexts[inputTextsIndex];
        const buttonIndexes = generateNumberArrayFrom0ToMax(buttonsCount - 1);
        const buttonIndexesInRandomOrder = shuffleArray(buttonIndexes);

        while (buttonIndexesInRandomOrder.length > 0) {
            if (firstButtonIsHandled) {
                if (debug) {
                    console.log('  fillDifferentTypesInputsAndClickButtons, inputText:' + inputText);
                }

                await fillDifferentTypesInputs({ inputText, page });
                inputTextsIndex++;
            }

            if (debug) {
                console.log('buttonIndexesInRandomOrder before shift:' + buttonIndexesInRandomOrder);
            }

            const buttonIndex = buttonIndexesInRandomOrder.shift();
            const button = buttonsLocator.nth(buttonIndex);

            if (debug) {
                console.log('buttonIndexesInRandomOrder after shift:' + buttonIndexesInRandomOrder);
                console.log('  fillDifferentTypesInputsAndClickButtons, button i:' + buttonIndex);
            }

            if (await button.isVisible() && await button.isEnabled()) {
                console.log('Push the button #' + (buttonIndex + 1));
                await button.click();
                firstButtonIsHandled = true;
            }

            await waitForTimeout({ page });
            await checkPageForErrors({ page });

            if (currentUrl !== page.url()) {
                if (!hostIsSame({ rootUrl, url: page.url() })) {
                    if (debug) {
                        console.log('  Went outside of the tested application to the page ' + page.url() +
                            ', returning back to the test application');
                    }

                    return;
                }

                movedToDifferentPage = true;

                if (debug) {
                    console.log('currentUrl:', currentUrl);
                    console.log('page.url():', page.url());
                    console.log('  break the inner loop');
                }

                break;
            }
        }

        if (movedToDifferentPage) {
            if (debug) {
                console.log('  break the outer loop');
            }

            break;
        }
    }

    if (movedToDifferentPage && !visitedUrlsOrNotVisitLinkUrlsIncludesUrl(page.url())) {
        await handlePage({ page });
    }
}

const fillDifferentTypesInputs = async ({ inputText, page }: { inputText: string, page: Page }) => {
    if (openAiApiKeyGiven && aiGeneratedInputTexts && !ignoreAiInTest && !ignoreAiGeneratedInputTextsInTests) {
        await fillInputsWithAi({ page });
    } else if (process.env.INPUT_TEXTS_FILE_PATH || process.env.RANDOM_INPUT_TEXTS_CHARSET || process.env.RANDOM_INPUT_TEXTS_MIN_LENGTH
        || process.env.RANDOM_INPUT_TEXTS_MAX_LENGTH
    ) {
        await fillTextInputs({
            doDerivation: false, inputText, inputType: 'text',
            page,
            selector: 'input:not([type]),input[type="text"],input[type="email"],input[type="password"],input[type="search"],input[type="url"],input[type="tel"]'
        });
    } else {
        await fillTextInputs({ inputText, inputType: 'text', page, selector: 'input:not([type]), input[type="text"]' });
        await fillTextInputs({ inputText: generateRandomEmail(), inputType: 'email', page, selector: 'input[type="email"]' });
        await fillTextInputs({
            inputText: generateRandomString(12, 20, 'abAB12#!'), inputType: 'password', page,
            selector: 'input[type="password"]'
        });
        await fillTextInputs({
            inputText: generateRandomString(8, 12, 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'),
            inputType: 'search', page,
            selector: 'input[type="search"]'
        });
        await fillTextInputs({
            inputText: generateRandomUrl(),
            inputType: 'url', page,
            selector: 'input[type="url"]'
        });
        await fillTextInputs({
            inputText: generateRandomInteger(400_000_000, 600_000_000).toString(),
            inputType: 'tel', page,
            selector: 'input[type="tel"]'
        });
    }

    await selectFromDropDownLists({ page });
    await fillCheckboxes({ page });
    await selectFromRadioButtons({ page });
}

const fillInputsWithAi = async ({ page }: { page: Page }) => {
    const inputs = page.locator('input:not([type="radio"]):not([type="checkbox"]):not([type="button"]):not([type="submit"]):not([type="reset"]):not([type="hidden"])');

    const count = await inputs.count();
    for (let i = 0; i < count; i++) {
        const input = inputs.nth(i);

        const type = await input.evaluate(el => el.getAttribute('type'));
        const autocomplete = await input.evaluate(el => el.getAttribute('autocomplete'));
        const placeholder = await input.evaluate(el => el.getAttribute('placeholder'));

        const labelText = await input.evaluate((el) => {
            const { id } = el;
            if (id) {
                const label = document.querySelector(`label[for="${id}"]`);
                if (label) {
                    return label.textContent?.trim();
                }
            }

            const parentLabel = el.closest('label');
            if (parentLabel) {
                return parentLabel.textContent?.trim();
            }

            return null;
        });

        if (await input.isVisible()) {
            const typeParameter = type || 'no type';
            const autocompleteParameter = autocomplete || 'no autocomplete';
            const placeholderParameter = placeholder || 'no placeholder';
            const labelParameter = labelText || 'no label';
            const isBrokenInputValue = brokenInputValues && probabilityCheck(brokenInputValuesPercentage);

            const generatedValue = isBrokenInputValue ?
                await generateBrokenInputContentWithAi(await getPageTextContents({ page }), typeParameter,
                    autocompleteParameter, placeholderParameter, labelParameter, debug) :
                await generateInputContentWithAi(await getPageTextContents({ page }), typeParameter,
                    autocompleteParameter, placeholderParameter, labelParameter, debug);

            const brokenInputValueText = isBrokenInputValue ? ' (the broken input value used)' : '';
            console.log('Filling the #' + (i + 1) + " input field with the AI, type: " + typeParameter + ", autocomplete: " + autocompleteParameter +
                ", placeholder: " + placeholderParameter + ", label: " + labelParameter + ", the generated value: "
                + generatedValue + brokenInputValueText);
            await input.fill(generatedValue);
        }
    }
}

const fillTextInputs = async ({ doDerivation = true, inputText, inputType, page, selector }: {
    doDerivation?: boolean, inputText: string, inputType: string
    page: Page, selector: string
}) => {
    if (debug) {
        console.log('  fillInputs');
    }

    const inputsLocator = page.locator(selector);
    const inputsCount = await inputsLocator.count();

    for (let inputIndex = 0; inputIndex < inputsCount; inputIndex++) {
        const input = inputsLocator.nth(inputIndex);
        let tempInputText = inputText;

        if (await input.isVisible()) {
            if (doDerivation) {
                tempInputText = await deriveTextInputFromDifferentPossibilities({ input, inputText: tempInputText, inputType, page });
            }

            console.log('Filling the #' + (inputIndex + 1) + " " + inputType + " input field a value: " + tempInputText);
            await input.fill(tempInputText);
        }
    }
}

type DerivedInputType = {
    derivedInputText: string
    labelTextPart: string;
}

const separators = ['-', '/', '.'];
const randomSeparator = separators[generateRandomIndex(0, 2)];

const derivedInputTypes: DerivedInputType[] = [
    { derivedInputText: generateRandomEmail(), labelTextPart: 'email' },
    { derivedInputText: generateRandomDate(-30, -20, randomSeparator), labelTextPart: 'birth' },
    { derivedInputText: generateRandomDate(-30, -20, randomSeparator), labelTextPart: 'dob' },
    { derivedInputText: generateRandomDate(0, 0, randomSeparator), labelTextPart: 'start' },
    { derivedInputText: generateRandomDate(1, 1, randomSeparator), labelTextPart: 'end' },
    { derivedInputText: generateRandomDate(0, 0, randomSeparator), labelTextPart: 'departure' },
    { derivedInputText: generateRandomDate(0, 0, randomSeparator), labelTextPart: 'arrival' },
    { derivedInputText: generateRandomDate(0, 1, randomSeparator), labelTextPart: 'expiration' },
    { derivedInputText: generateRandomDate(-1, 1, randomSeparator), labelTextPart: 'date' },
    { derivedInputText: generateRandomString(6, 10, 'abcdefghijklmnopqrstuvwxyz'), labelTextPart: 'first name' },
    { derivedInputText: generateRandomString(6, 10, 'abcdefghijklmnopqrstuvwxyz'), labelTextPart: 'given name' },
    { derivedInputText: generateRandomString(6, 10, 'abcdefghijklmnopqrstuvwxyz'), labelTextPart: 'forename' },
    { derivedInputText: generateRandomString(6, 10, 'abcdefghijklmnopqrstuvwxyz'), labelTextPart: 'last name' },
    { derivedInputText: generateRandomString(6, 10, 'abcdefghijklmnopqrstuvwxyz'), labelTextPart: 'family name' },
    { derivedInputText: generateRandomString(6, 10, 'abcdefghijklmnopqrstuvwxyz'), labelTextPart: 'surname' },
    {
        derivedInputText: generateRandomString(6, 10, 'abcdefghijklmnopqrstuvwxyz') + ' ' + generateRandomString(6, 10, 'abcdefghijklmnopqrstuvwxyz'),
        labelTextPart: 'name'
    },
    { derivedInputText: generateRandomInteger(100_000, 999_999).toString(), labelTextPart: 'otp' }
];

const deriveTextInputFromDifferentPossibilities = async ({ input, inputText, inputType, page }:
    { input: Locator, inputText: string, inputType: string, page: Page }): Promise<string> => {
    if (inputType === 'text') {
        for (const derivedInputType of derivedInputTypes) {
            const derivedTextInput = await deriveTextInput({
                derivedInputText: derivedInputType.derivedInputText, input,
                labelText: derivedInputType.labelTextPart, page
            });

            if (derivedTextInput) {
                return derivedTextInput;
            }
        }
    }

    return inputText;
}

const deriveTextInput = async ({ derivedInputText, input, labelText: labelTextPart, page }:
    { derivedInputText: string, input: Locator, labelText: string, page: Page }): Promise<null | string> => {
    const labelsLocator = page.locator(`label[for="${await input.getAttribute('id')}"]`);
    const labelsCount = await labelsLocator.count();
    if (labelsCount > 0) {
        const labelTextContent = await labelsLocator.nth(0).textContent();

        if (labelTextContent?.toLowerCase().includes(labelTextPart.toLowerCase())) {
            console.log(`The label is '${labelTextContent}', so generating an appropriate random content for the input field`);
            return derivedInputText;
        }
    }

    return null;
}

const selectFromDropDownLists = async ({ page }: { page: Page }) => {
    if (debug) {
        console.log('  selectFromDropDownLists');
    }

    const selectsLocator = page.locator('select');
    const selectsCount = await selectsLocator.count();

    if (debug) {
        console.log('  selectsCount:', selectsCount);
    }

    for (let selectIndex = 0; selectIndex < selectsCount; selectIndex++) {
        const select = selectsLocator.nth(selectIndex);
        const optionsLocator = select.locator('option');
        const optionsCount = await optionsLocator.count();

        if (debug) {
            console.log('  optionsCount:', optionsCount);
        }

        const optionIndexToSelect = generateRandomIndex(1, optionsCount - 1);

        if (await select.isVisible()) {
            console.log('The #' + (selectIndex + 1) + " drop-down list. Selecting the option #" + (optionIndexToSelect + 1));
            await select.selectOption({ index: optionIndexToSelect })
        }
    }
}

const fillCheckboxes = async ({ page }: { page: Page }) => {
    if (debug) {
        console.log('  fillCheckboxes');
    }

    const checkboxesLocator = page.locator('input[type="checkbox"]');
    const checkboxesCount = await checkboxesLocator.count();

    for (let checkboxIndex = 0; checkboxIndex < checkboxesCount; checkboxIndex++) {
        const checkbox = checkboxesLocator.nth(checkboxIndex);

        if (await checkbox.isVisible()) {
            console.log('Selecting the #' + (checkboxIndex + 1) + " checkbox");
            await checkbox.click();
        }
    }
}

const selectFromRadioButtons = async ({ page }) => {
    if (debug) {
        console.log('  selectFromRadioButtons');
    }

    const radioButtonGroups = await page.locator('input[type="radio"]').evaluateAll((radioTypeInputs: HTMLInputElement[]) =>
        [...new Set(radioTypeInputs.map((radioTypeInput) => radioTypeInput.name))]
    );

    let radioButtonGroupCount = 1;
    for (const radiobButtonGroup of radioButtonGroups) {
        if (debug) {
            console.log(`Processing radio button group: ${radiobButtonGroup}`);
        }

        const radioButtonsLocator = page.locator(`input[type="radio"][name="${radiobButtonGroup}"]`);
        const radioButtonsCount = await radioButtonsLocator.count();

        if (radioButtonsCount > 0) {
            const radioButtonIndex = generateRandomIndex(0, radioButtonsCount - 1);
            const radioButton = radioButtonsLocator.nth(radioButtonIndex);

            if (await radioButton.isVisible()) {
                console.log(`The #${radioButtonGroupCount} radio button group. Selecting the radio button #${radioButtonIndex + 1}`);
                await radioButton.check();
            }
        }

        radioButtonGroupCount++;
    }
}

const visitLinks = async ({ page }: { page: Page }) => {
    if (debug) {
        console.log('  visitLinks');
    }

    const links = await page.locator('a').evaluateAll((links: HTMLAnchorElement[]) =>
        links.map((link) => link.href)
    );

    for (const link of shuffleArray(links)) {
        if (debug) {
            console.log('  visitLinks, for, link: ' + link);
        }

        if (!visitedUrlsOrNotVisitLinkUrlsIncludesUrl(link) && hostIsSame({ rootUrl, url: link })) {
            if (debug) {
                console.log('  visitLinks, for, link: ' + link);
            }

            // this is needed, because sometimes applications forwards URLs to the different URLs
            addUrlToVisitedUrlsOrNotVisitLinkUrls(link);
            await page.goto(link);
            await waitForTimeout({ page });
            await handlePage({ page });
        }
    }
}

const waitForTimeout = async ({ page }: { page: Page }) => {
    if (debug) {
        console.log('  waitForTimeout');
    }

    await page.waitForTimeout(wait);
}


