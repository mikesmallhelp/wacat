/* eslint-disable no-await-in-loop */

import { Page, expect, test } from '@playwright/test';
import { fail } from 'node:assert';

import { AuthenticationConfiguration, generateRandomString, hostIsSame, 
                readAuthencticationConfiguration, readFileContent } from '../utils/test-utils';

const visitedUrls: string[] = [];
const rootUrl = process.env.ROOT_URL;
const errorTexts: string[] = process.env.PAGE_ERROR_TEXTS_FILE_PATH ?
    await readFileContent({ path: process.env.PAGE_ERROR_TEXTS_FILE_PATH }) : [];
const inputTexts: string[] = process.env.INPUT_TEXTS_FILE_PATH ?
    await readFileContent({ path: process.env.INPUT_TEXTS_FILE_PATH }) : [];
const authenticationConfiguration: AuthenticationConfiguration = process.env.AUTHENTICATION_CONFIGURATION_FILE_PATH ?
    await readAuthencticationConfiguration({ path: process.env.AUTHENTICATION_CONFIGURATION_FILE_PATH }) : null;

if (!rootUrl) {
    throw new Error('ROOT_URL environment variable is not set');
}

test('test an application', async ({ page }) => {
    await page.goto(rootUrl);

    page.on('response', response => {
        const status = response.status();
        const url = response.url();

        if (status >= 400) {
            console.log(`Request to ${url} resulted in status code ${status}`);
            fail(`Request to ${url} resulted in status code ${status}`);
        }
    });

    if (authenticationConfiguration) {
        await authenticate({ authenticationConfiguration, page });
    }

    await handlePage({ page });
});

export const authenticate = async ({ authenticationConfiguration, page }:
    { authenticationConfiguration: AuthenticationConfiguration, page: Page }) => {
    if (!authenticationConfiguration ||
        !authenticationConfiguration.usernameLabel ||
        !authenticationConfiguration.usernameValue ||
        !authenticationConfiguration.passwordLabel ||
        !authenticationConfiguration.passwordValue ||
        !authenticationConfiguration.buttonValue) {
        throw new Error('Authentication configuration is not set, value: ' + authenticationConfiguration);
    }

    await page.getByLabel(authenticationConfiguration.usernameLabel).fill(authenticationConfiguration.usernameValue);
    await page.getByLabel(authenticationConfiguration.passwordLabel).fill(authenticationConfiguration.passwordValue);
    await page.getByRole('button', { exact: true, name: `${authenticationConfiguration.buttonValue}` }).click();

    console.log('Filled the username and the password. Pushed the authentication button');
}

const handlePage = async ({ page }: { page: Page }) => {
    console.log('In the page: ' + page.url());

    await page.waitForTimeout(1000);
    visitedUrls.push(page.url());

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
        await page.waitForTimeout(1000);
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
        if (!visitedUrls.includes(link) && hostIsSame({ rootUrl, url: link })) {
            await page.goto(link);
            await handlePage({ page });
        }
    }
}
