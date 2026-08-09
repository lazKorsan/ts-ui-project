import {test} from '@playwright/test';
import {ClickUtils} from "../utils/clickUtils";
import {ReusableMethods} from "../utils/ReusableMethods";
import {SendKeysUtils} from "../utils/SendKeysUtils";


test('US005_TC01 Login Pozitive Test', async ({ page }) => {

    const click = new ClickUtils(page);
    const sendKeys = new SendKeysUtils(page);
    const methods = new ReusableMethods(page);

    // anaSayfaya gitmekliklik
    await page.goto('https://qa.instulearn.com/');

    // loginButtona basmakliklik
    await click.clickByText('Login');

    // loginSayfasinda oldugunu dogrulamakliklik
    await methods.verifyUrl('login');

    // email grimekliklik
    await sendKeys.sendKeysByText('Email','ahmet205555@instuLearn.com')

    // password grimekliklik
    await sendKeys.sendKeysByText('Password','Query.2026!')

    // login butonuna basmakliklik
    const loginButton = page.getByRole('button', { name: 'Login' });
    await click.clickOnLocator(loginButton);

    // panel sayfasinda oldugunu dogrulamakliklik
    await methods.verifyUrl('panel');

});


test('US005_TC02 Login Negative Mail False Test', async ({ page }) => {
    await page.goto('https://qa.instulearn.com/');
});


test('US005_TC03 Login Negative Password False Test', async ({ page }) => {
    await page.goto('https://qa.instulearn.com/');
});


