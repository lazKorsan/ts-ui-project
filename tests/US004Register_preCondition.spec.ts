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

    // Register Butona ismi işe tiklamakliklik
    await click.clickByText('Register');

    await click.clickByText('Student')

    await sendKeys.sendKeysByText('Email', 'ahmet.student0808222944@instuLearn.com');

    await sendKeys.sendKeysByText('full_name', 'ahmet');

    await sendKeys.sendByXpath('//input[@id="password"]','Query.2026!')

 //    await page.getByRole('textbox', { name: 'Password:', exact: true }).fill('Query.2026!');
    await page.getByRole('textbox', { name: 'Retype Password:', exact: true }).scrollIntoViewIfNeeded();

    await sendKeys.sendByXpath('//input[@id="confirm_password"]','Query.2026!')






    // Scroll yap
    await page.getByText('I agree with terms & rules').scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);

    // JavaScript ile tıkla
    await page.evaluate(() => {
        // Tüm label'ları bul
        const allLabels = document.querySelectorAll('label');

        // Her label'ı kontrol et
        allLabels.forEach(label => {
            const text = label.textContent || '';
            if (text.includes('I agree with terms') || text.includes('terms & rules')) {
                label.click();
                console.log('✅ Checkbox tıklandı!');
            }
        });
    });

    console.log('✅ Test tamamlandı!');












   // await click.clickByText('Instructor')


    //  await click.clickByText('Organization')


});

