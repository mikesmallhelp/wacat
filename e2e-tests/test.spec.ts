/* eslint-disable no-await-in-loop */

import { Page, expect, test } from '@playwright/test';
import { fail } from 'node:assert';

import {
    Configuration, generateRandomString, hostIsSame,
    readConfiguration, readFileContent
} from '../utils/test-utils';

const waitForTimeout = 2000;
const visitedUrlsOrNotVisitLinkUrls: string[] = [];
const rootUrl = process.env.ROOT_URL;
const errorTexts: string[] = process.env.PAGE_ERROR_TEXTS_FILE_PATH ?
    await readFileContent({ path: process.env.PAGE_ERROR_TEXTS_FILE_PATH }) : [];
const inputTexts: string[] = process.env.INPUT_TEXTS_FILE_PATH ?
    await readFileContent({ path: process.env.INPUT_TEXTS_FILE_PATH }) : [];
    const configuration: Configuration = process.env.AUTHENTICATION_CONFIGURATION_FILE_PATH ?
    await readConfiguration({ path: process.env.AUTHENTICATION_CONFIGURATION_FILE_PATH }) : null;

if (!rootUrl) {
    throw new Error('ROOT_URL environment variable is not set');
}

if (configuration && configuration.notVisitLinkUrls && configuration.notVisitLinkUrls.length > 0) {
    for (const url of configuration.notVisitLinkUrls) {
        visitedUrlsOrNotVisitLinkUrls.push(url);
    }
}

test('test an application', async ({ page }) => {
    await page.goto(rootUrl);
    await page.waitForTimeout(waitForTimeout);

    page.on('response', response => {
        const status = response.status();
        const url = response.url();

        if (status >= 400) {
            console.log(`Request to ${url} resulted in status code ${status}`);
            fail(`Request to ${url} resulted in status code ${status}`);
        }
    });

    if (configuration) {
        await authenticate({ page });
    }

    await handlePage({ page });
});

export const authenticate = async ({ page }: { page: Page }) => {
    if (!configuration || !configuration.authentication ||
        !configuration?.authentication?.usernameLabel ||
        !configuration?.authentication?.usernameValue ||
        !configuration?.authentication?.passwordLabel ||
        !configuration?.authentication?.passwordValue ||
        !configuration?.authentication?.finishButtonLabel) {
        throw new Error('Authentication configuration is not set, value: ' + JSON.stringify(configuration));
    }

    if (configuration.authentication.beforeAuthenticationLinkNames) {
        for (const linkName of configuration.authentication.beforeAuthenticationLinkNames) {
            page.getByText(linkName).click();
        }
    }

    await page.getByLabel(configuration.authentication.usernameLabel).fill(configuration.authentication.usernameValue);

    if (configuration.authentication.usernameButtonLabel) {
        await page.getByRole('button', { exact: true, name: `${configuration.authentication.usernameButtonLabel}` }).click();
    }

    await page.getByLabel(configuration.authentication.passwordLabel).fill(configuration.authentication.passwordValue);
    await page.getByRole('button', { exact: true, name: `${configuration.authentication.finishButtonLabel}` }).click();

    console.log('Filled the username and the password. Pushed the authentication button');
}

const handlePage = async ({ page }: { page: Page }) => {
    console.log('In the page: ' + page.url());

    await page.waitForTimeout(waitForTimeout);
    visitedUrlsOrNotVisitLinkUrls.push(page.url());

    await checkPageForErrors({ page });
    await fillInputsAndSelectFromDropDownListsAndClickButtons({ page });
    await visitLinks({ page });
}

const checkPageForErrors = async ({ page }: { page: Page }) => {
    const content = await page.locator('body').textContent();

    for (const errorText of errorTexts) {
        console.log(`Check the page not contain the ${errorText} text`);
        expect(content).not.toContain(errorText);
    }
}

const fillInputsAndSelectFromDropDownListsAndClickButtons = async ({ page }: { page: Page }) => {
    const buttonsLocator = page.locator('button');
    const buttonsCount = await buttonsLocator.count();

    for (let i = 0; i < buttonsCount; i++) {
        await fillInputs({ page });
        await selectFromDropDownLists({ page });

        const button = buttonsLocator.nth(i);
        console.log('Push the button #' + i);
        await button.click();
        await page.waitForTimeout(waitForTimeout);
        await checkPageForErrors({ page });
    }
}

const fillInputs = async ({ page }: { page: Page }) => {
    const inputsLocator = page.locator('input');
    const inputsCount = await inputsLocator.count();

    for (const inputText of inputTexts.length > 0 ? inputTexts : [generateRandomString()]) {
        for (let inputIndex = 0; inputIndex < inputsCount; inputIndex++) {
            const input = inputsLocator.nth(inputIndex);
            console.log('Fill the #' + inputIndex + " input field a value: " + inputText);
            input.fill(inputText);
        }
    }
}

const selectFromDropDownLists = async ({ page }: { page: Page }) => {
    const selectsLocator = page.locator('select');
    const selectsCount = await selectsLocator.count();

    for (let selectIndex = 0; selectIndex < selectsCount; selectIndex++) {
        const select = selectsLocator.nth(selectIndex);
        const optionsLocator = select.locator('option');
        const optionsCount = await optionsLocator.count();
        const optionNumberToSelect = optionsCount > 1 ? 1 : 0;
        console.log('#' + selectIndex + " drop-down list. Select the option #" + optionNumberToSelect);
        await select.selectOption({ index: optionNumberToSelect })
    }
}

const visitLinks = async ({ page }: { page: Page }) => {
    const links = await page.locator('a').evaluateAll((links: HTMLAnchorElement[]) =>
        links.map((link) => link.href)
    );

    for (const link of links) {
        if (!visitedUrlsOrNotVisitLinkUrls.includes(link) && hostIsSame({ rootUrl, url: link })) {
            await page.goto(link);
            await page.waitForTimeout(waitForTimeout);
            await handlePage({ page });
        }
    }
}