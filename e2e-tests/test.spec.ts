/* eslint-disable no-await-in-loop */

import { Page, expect, test } from '@playwright/test';
import { fail } from 'node:assert';

import {
    Configuration, generateRandomString, hostIsSame,
    readConfiguration, readFileContent
} from '../utils/test-utils';

const wait: number = process.env.WAIT ? Number(process.env.WAIT) : 2000;
const timeout: number = process.env.TIMEOUT ? Number(process.env.TIMEOUT) : 120_000;
const visitedUrlsOrNotVisitLinkUrls: string[] = [];
const rootUrl = process.env.ROOT_URL;
const inputTexts: string[] = process.env.INPUT_TEXTS_FILE_PATH ?
    await readFileContent({ path: process.env.INPUT_TEXTS_FILE_PATH }) : [];
const configuration: Configuration = process.env.CONFIGURATION_FILE_PATH ?
    await readConfiguration({ path: process.env.CONFIGURATION_FILE_PATH }) : null;
const onlyLinks: boolean = Boolean(process.env.ONLY_LINKS);
const debug: boolean = Boolean(process.env.DEBUG);

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
    await page.waitForTimeout(wait);

    page.on('response', response => {
        const status = response.status();
        const url = response.url();

        if (status >= 400) {
            console.log(`Request to ${url} resulted in status code ${status}`);
            fail(`Request to ${url} resulted in status code ${status}`);
        }
    });

    if (configuration && configuration.authentication) {
        await authenticate({ page });
    }

    await handlePage({ page });
});

export const ifDebugPrintPlaywrightStartSituation = async () => {
    if (debug) {
        console.log('\nPlaywright test starts...\n');
        console.log('Parameters:');
        console.log('rootUrl:' + rootUrl);
        console.log('wait:' + wait);
        console.log('timeout:' + timeout);
        console.log('inputTexts:' + JSON.stringify(inputTexts));
        console.log('configuration:' + JSON.stringify(configuration));
        console.log('onlyLinks:' + onlyLinks);
    }
}

export const authenticate = async ({ page }: { page: Page }) => {
    if (debug) {
        console.log('authenticate');
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
            console.log('authenticate, beforeAuthenticationLinkTexts');
        }

        for (const linkName of configuration.authentication.beforeAuthenticationLinkTexts) {
            page.getByText(linkName).click();
        }
    }

    await page.getByLabel(configuration.authentication.usernameLabel).fill(configuration.authentication.usernameValue);

    if (configuration.authentication.usernameButtonLabel) {
        if (debug) {
            console.log('authenticate, usernameButtonLabel');
        }

        await page.getByRole('button', { exact: true, name: `${configuration.authentication.usernameButtonLabel}` }).click();
    }

    await page.getByLabel(configuration.authentication.passwordLabel).fill(configuration.authentication.passwordValue);
    await page.getByRole('button', { exact: true, name: `${configuration.authentication.loginButtonLabel}` }).click();

    console.log('Filled the username and the password. Pushed the authentication button');
}

const handlePage = async ({ page }: { page: Page }) => {
    console.log('In the page: ' + page.url());

    await page.waitForTimeout(wait);
    visitedUrlsOrNotVisitLinkUrls.push(page.url());

    await checkPageForErrors({ page });

    for (const inputText of inputTexts.length > 0 ? inputTexts : [generateRandomString()]) {
        if (onlyLinks) {
            if (debug) {
                console.log('handlePage, onlyLinks');
            }
        } else {
            await fillInputsAndSelectFromDropDownListsAndClickButtons({ inputText, page });
        }
    }

    await visitLinks({ page });
}

const checkPageForErrors = async ({ page }: { page: Page }) => {
    if (debug) {
        console.log('checkPageForErrors');
    }

    if (!configuration || !configuration.errorTexts || configuration.errorTexts.length === 0) {
        return;
    }

    if (debug) {
        console.log('checkPageForErrors, errorTexts.length: ' + configuration.errorTexts.length);
    }

    const content = await page.locator('body').textContent();

    for (const errorText of configuration.errorTexts) {
        console.log(`Check the page not contain the ${errorText} text`);
        expect(content).not.toContain(errorText);
    }
}

const fillInputsAndSelectFromDropDownListsAndClickButtons = async ({ inputText, page }: { inputText: string, page: Page }) => {
    if (debug) {
        console.log('fillInputsAndSelectFromDropDownListsAndClickButtons');
    }

    const buttonsLocator = page.locator('button');
    const buttonsCount = await buttonsLocator.count();

    for (let i = 0; i < buttonsCount; i++) {
        console.log('fillInputsAndSelectFromDropDownListsAndClickButtons, for loop');

        await fillInputs({ inputText, page });
        await selectFromDropDownLists({ page });

        const button = buttonsLocator.nth(i);

        if (await button.isVisible() && await button.isEnabled()) {
            console.log('Push the button #' + i);
            await button.click();
        }
        
        await page.waitForTimeout(wait);
        await checkPageForErrors({ page });
    }
}

const fillInputs = async ({ inputText, page }: { inputText: string, page: Page }) => {
    if (debug) {
        console.log('fillInputs');
    }

    const inputsLocator = page.locator('input');
    const inputsCount = await inputsLocator.count();

    for (let inputIndex = 0; inputIndex < inputsCount; inputIndex++) {
        const input = inputsLocator.nth(inputIndex);
        console.log('Fill the #' + inputIndex + " input field a value: " + inputText);
        
        if (await input.isVisible()) {
            input.fill(inputText);
        }
    }
}

const selectFromDropDownLists = async ({ page }: { page: Page }) => {
    if (debug) {
        console.log('selectFromDropDownLists');
    }

    const selectsLocator = page.locator('select');
    const selectsCount = await selectsLocator.count();

    for (let selectIndex = 0; selectIndex < selectsCount; selectIndex++) {
        const select = selectsLocator.nth(selectIndex);
        const optionsLocator = select.locator('option');
        const optionsCount = await optionsLocator.count();
        const optionNumberToSelect = optionsCount > 1 ? 1 : 0;
        console.log('#' + selectIndex + " drop-down list. Select the option #" + optionNumberToSelect);

        if (await select.isVisible()) {
            await select.selectOption({ index: optionNumberToSelect })
        }
    }
}

const visitLinks = async ({ page }: { page: Page }) => {
    if (debug) {
        console.log('visitLinks');
    }

    const links = await page.locator('a').evaluateAll((links: HTMLAnchorElement[]) =>
        links.map((link) => link.href)
    );

    for (const link of links) {
        if (debug) {
            console.log('visitLinks, for, link: ' + link);
        }

        if (!visitedUrlsOrNotVisitLinkUrls.includes(link) && hostIsSame({ rootUrl, url: link })) {
            if (debug) {
                console.log('visitLinks, for, link: ' + link);
            }

            await page.goto(link);
            await page.waitForTimeout(wait);
            await handlePage({ page });
        }
    }
}