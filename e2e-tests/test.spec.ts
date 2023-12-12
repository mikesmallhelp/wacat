/* eslint-disable no-await-in-loop */

import { Page, expect, test } from '@playwright/test';
import { fail } from 'node:assert';

import {
    AuthenticationConfiguration, generateRandomString, hostIsSame,
    readAuthencticationConfiguration, readFileContent
} from '../utils/test-utils';

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

    await handlePage({ authenticationConfiguration, page });
});

export const authenticate = async ({ authenticationConfiguration, page }:
    { authenticationConfiguration: AuthenticationConfiguration, page: Page }) => {
    if (!authenticationConfiguration ||
        !authenticationConfiguration.usernameLabel ||
        !authenticationConfiguration.usernameValue ||
        !authenticationConfiguration.passwordLabel ||
        !authenticationConfiguration.passwordValue ||
        !authenticationConfiguration.finishButtonLabel) {
        throw new Error('Authentication configuration is not set, value: ' + authenticationConfiguration);
    }

    if (authenticationConfiguration.beforeAuthenticationLinkNames) {
        for (const linkName of authenticationConfiguration.beforeAuthenticationLinkNames) {
            page.getByText(linkName).click();
        }
    }

    await page.getByLabel(authenticationConfiguration.usernameLabel).fill(authenticationConfiguration.usernameValue);

    if (authenticationConfiguration.usernameButtonLabel) {
        await page.getByRole('button', { exact: true, name: `${authenticationConfiguration.usernameButtonLabel}` }).click();
    }

    await page.getByLabel(authenticationConfiguration.passwordLabel).fill(authenticationConfiguration.passwordValue);
    await page.getByRole('button', { exact: true, name: `${authenticationConfiguration.finishButtonLabel}` }).click();

    console.log('Filled the username and the password. Pushed the authentication button');
}

const handlePage = async ({ authenticationConfiguration, page }:
    { authenticationConfiguration?: AuthenticationConfiguration, page: Page }) => {
    console.log('In the page: ' + page.url());

    await page.waitForTimeout(1000);
    visitedUrls.push(page.url());

    await checkPageForErrors({ page });
    await fillInputsAndSelectFromDropDownListsAndClickButtons({ page });
    await visitLinks({ authenticationConfiguration, page });
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

const visitLinks = async ({ authenticationConfiguration, page }:
    { authenticationConfiguration?: AuthenticationConfiguration, page: Page }) => {

    console.log('Visit links 1');

    let tulostus: string = '';   

    const links = await page.locator('a').evaluateAll((links: HTMLAnchorElement[], authConfig?: AuthenticationConfiguration) => {
        console.log('Visit links 2');

        if (authConfig && authConfig.noLogoutLinkOrButtonName) {
            console.log('Visit links 3');

            for (const link of links) {
                console.log('link.textContent:' + link.textContent);
                tulostus = tulostus + link.textContent;
                console.log('link.hfef:' + link.href);
                tulostus = tulostus + link.href;
            }

            return links
                .filter((link) => link.textContent && link.textContent.trim() !== 'Logout')
                .map((link) => link.href);
        }

        for (const link of links) {
            console.log('link.textContent:' + link.textContent);
            console.log('link.hfef:' + link.href);
        }

        return links.map((link) => link.href);

    }, authenticationConfiguration);

    console.log('Visit links 4');
    console.log('tulostus:' + tulostus);

    for (const link of links) {
        console.log('link:' + link);
    }

    for (const link of links) {
        console.log('Visit links 5');
        if (!visitedUrls.includes(link) && hostIsSame({ rootUrl, url: link })) {
            console.log('Visit links 6');
            await page.goto(link);
            await handlePage({ authenticationConfiguration, page });
        }
    }
}
