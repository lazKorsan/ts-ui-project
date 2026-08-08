import { test, expect } from '@playwright/test';
import { ReusableMethods } from '../utils/ReusableMethods';
import {ClickUtils} from "../utils/clickUtils";
import {SendKeysUtils} from "../utils/SendKeysUtils";
import { logger } from '../utils/logger';

test('test', async ({ page }) => {
    await page.goto('https://qa.instulearn.com/');

    const click = new ClickUtils(page);
    const methods = new ReusableMethods(page);
    const sendKeys = new SendKeysUtils(page);

    await click.clickByText('Register');

    await click.clickByText('Student')

    await sendKeys.sendKeysByText('Email', 'ahmet.student0808222944@instuLearn.com');

    await sendKeys.sendKeysByText('full_name', 'ahmet');

    await page.getByRole('textbox', { name: 'Password:', exact: true }).fill('Query.2026!');

    await page.getByRole('textbox', { name: 'Retype Password:', exact: true }).scrollIntoViewIfNeeded();

    await page.getByRole('textbox', { name: 'Retype Password:', exact: true }).fill('Query.2026!');











   // await click.clickByText('Instructor')


    //  await click.clickByText('Organization')


});

