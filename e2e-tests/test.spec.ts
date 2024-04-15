/* eslint-disable no-await-in-loop */

import { Locator, Page, expect, test } from '@playwright/test';
import { fail } from 'node:assert';

import {
    Configuration, generateNumberArrayFrom0ToMax, generateRandomEmail, generateRandomIndex, generateRandomString, generateRandomUrl,
    hostIsSame,
    readConfiguration, readFileContent, shuffleArray
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

if (!rootUrl) {
    throw new Error('ROOT_URL environment variable is not set');
}

if (configuration && configuration.notVisitLinkUrls && configuration.notVisitLinkUrls.length > 0) {
    for (const url of configuration.notVisitLinkUrls) {
        visitedUrlsOrNotVisitLinkUrls.push(url);
    }
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
    visitedUrlsOrNotVisitLinkUrls.push(page.url());

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

const checkPageForErrors = async ({ page }: { page: Page }) => {
    if (debug) {
        console.log('  checkPageForErrors');
    }

    if (!configuration || !configuration.errorTextsInPages || configuration.errorTextsInPages.length === 0) {
        return;
    }

    if (debug) {
        console.log('  checkPageForErrors, errorTextsInPages.length: ' + configuration.errorTextsInPages.length);
    }

    const content = await page.locator('body').textContent();

    for (const errorText of configuration.errorTextsInPages) {
        console.log(`Check the page not contain the ${errorText} text`);
        expect(content).not.toContain(errorText);
    }
}

const fillDifferentTypesInputsAndClickButtons = async ({ page }: { page: Page }) => {
    if (debug) {
        console.log('  fillDifferentTypesInputsAndClickButtons');
    }

    const currentUrl = page.url();
    const buttonsLocator =
        page.locator('button:not([disabled]), input[type="submit"]:not([disabled]), input[type="button"]:not([disabled])');
    const buttonsCount = await buttonsLocator.count();

    if (buttonsCount === 0) {
        if (debug) {
            console.log('  buttonsCount == 0, do not fill input texts etc.');
        }

        return;
    }

    let movedToDifferentPage = false;
    let firstButtonClickIsDone = false;
    let inputTextsIndex = 0;

    while (inputTextsIndex < inputTexts.length) {
        const inputText = inputTexts[inputTextsIndex];
        const buttonIndexes = generateNumberArrayFrom0ToMax(buttonsCount - 1);
        const buttonIndexesInRandomOrder = shuffleArray(buttonIndexes);

        while (buttonIndexesInRandomOrder.length > 0) {
            if (firstButtonClickIsDone) {
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
                firstButtonClickIsDone = true;
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

    if (movedToDifferentPage && !visitedUrlsOrNotVisitLinkUrls.includes(page.url())) {
        await handlePage({ page });
    }
}

const fillDifferentTypesInputs = async ({ inputText, page }: { inputText: string, page: Page }) => {
    await fillTextInputs({ inputText, inputType: 'text', page, selector: 'input:not([type]), input[type="text"]' });
    await selectFromDropDownLists({ page });
    await fillCheckboxes({ page });
    await selectFromRadioButtons({ page });
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
}

const fillTextInputs = async ({ inputText, inputType, page, selector }: {
    inputText: string, inputType: string, page: Page
    selector: string,
}) => {
    if (debug) {
        console.log('  fillInputs');
    }

    const inputsLocator = page.locator(selector);
    const inputsCount = await inputsLocator.count();

    for (let inputIndex = 0; inputIndex < inputsCount; inputIndex++) {
        const input = inputsLocator.nth(inputIndex);

        if (await input.isVisible()) {
            inputText = await deriveTextInputFromDifferentPossibilities({ inputText, inputType, inputIndex, page, input });
            console.log('Filling the #' + (inputIndex + 1) + " " + inputType + " input field a value: " + inputText);
            await input.fill(inputText);
        }
    }
}

type DerivedInputType = {
    labelText: string;
    derivedInputText: string
}

const deriveTextInputFromDifferentPossibilities = async ({ inputText, inputType, inputIndex, page, input }:
    { inputText: string, inputType: string, inputIndex: number, page: Page, input: Locator }): Promise<string> => {
    if (inputType === 'text') {
        const derivedInputTypes: DerivedInputType[] = [{ labelText: 'Email', derivedInputText: generateRandomEmail() }];

        for (const derivedInputType of derivedInputTypes) {
            const derivedTextInput = await deriveTextInput({ inputText, inputType, inputIndex, page, input, 
                                        labelText: derivedInputType.labelText, derivedInputText: derivedInputType.derivedInputText });

            if (derivedTextInput) {
                return derivedTextInput;
            }
        }
    }

    return inputText;
}

const deriveTextInput = async ({ inputText, inputType, inputIndex, page, input, labelText, derivedInputText }:
    { inputText: string, inputType: string, inputIndex: number, page: Page, input: Locator, labelText: string, derivedInputText: string }): Promise<string | null> => {
    const label = page.locator(`label[for="${await input.getAttribute('id')}"]`);
    if (await label.count() > 0 && await label.textContent() === labelText) {
        console.log(`The label is ${labelText}, so generating appropriate random content for it.`);
        return derivedInputText;
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

        if (!visitedUrlsOrNotVisitLinkUrls.includes(link) && hostIsSame({ rootUrl, url: link })) {
            if (debug) {
                console.log('  visitLinks, for, link: ' + link);
            }

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
