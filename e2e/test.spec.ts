import { test, expect, Page } from '@playwright/test';
import { hostIsSame, generateRandomString } from '../utils/test-utils';

let visitedUrls: string[] = [];
const rootUrl = process.env.ROOT_URL;

if (!rootUrl) {
    throw new Error('ROOT_URL environment variable is not set');
}

test('test an application', async ({ page }) => {
    await page.goto(rootUrl);

    page.on('response', response => {
        const status = response.status();
        const url = response.url();

        if (status != 200) {
            console.log(`Request to ${url} resulted in status code ${status}`);
        }
        expect(status).toBe(200);
    });

    await handlePage({ page: page });
});

const handlePage = async ({ page }: { page: Page }) => {
    console.log('In the page: ' + page.url());

    await page.waitForTimeout(1000);
    visitedUrls.push(page.url());

    await checkPageForErrors({ page: page });
    await fillInputsAndSelectFromDropDownListsAndClickButtons({ page: page });
    await visitLinks({ page: page });
}

const checkPageForErrors = async ({ page }: { page: Page }) => {
    const content = await page.locator('body').textContent();

    console.log("Check the page not contain the 'Error occurred!' text");
    expect(content).not.toContain('Error occurred!');
}

const fillInputsAndSelectFromDropDownListsAndClickButtons = async ({ page }: { page: Page }) => {
    const buttonsLocator = page.locator('button');
    const buttonsCount = await buttonsLocator.count();

    for (let i = 0; i < buttonsCount; i++) {
        await fillInputs({ page: page });
        await selectFromDropDownLists({ page: page });

        const button = buttonsLocator.nth(i);
        console.log('Push the button #' + i);
        await button.click();
        await page.waitForTimeout(1000);
        await checkPageForErrors({ page: page });
    }
}

const fillInputs = async ({ page }: { page: Page }) => {
    const inputsLocator = page.locator('input');
    const inputsCount = await inputsLocator.count();

    for (let inputIndex = 0; inputIndex < inputsCount; inputIndex++) {
        const input = inputsLocator.nth(inputIndex);
        const randomString = generateRandomString();
        console.log('Fill the #' + inputIndex + " input field a value: " + randomString);
        input.fill(randomString);
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
        if (!visitedUrls.includes(link) && hostIsSame({rootUrl: rootUrl, url: link})) {
            await page.goto(link);
            await handlePage({ page: page });
        }
    }
}
