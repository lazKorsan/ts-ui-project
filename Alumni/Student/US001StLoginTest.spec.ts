import {test} from '@playwright/test';
import {LoggerHelper} from "../../utils/LoggerHelper";
import {StudentPage} from "../../pages/StudentPage";
import {ReusableMethods} from "../../utils/ReusableMethods";
import {ClickUtils} from "../../utils/ClickUtils";
import {SendKeysUtils} from "../../utils/SendKeysUtils";

const studentMail = 'ahmet486@IntuLearn.com';
const studentPassword = 'Query.2026!';


test('US001StLoginTestTC06', async ({page}) => {

    /*
     * Student kullanicisi anaSayfaya gider
     * Student kullanicisi "Login" butona tiklar
     * Student kullanicisi "Email" kutusuna "studentMail yazar
     * Student kullanicis "Password" kutuusna "studentPassword" yazar
     * Student kullanicisi "Login Submit" butona tiklar
     *
     * @Given("Student kullanicisi "String" butona tiklar")
     * public void studenyKullanicisi (String elementName){
     * }
     */

    const studentPage = new StudentPage(page);
    const clickUtils = new ClickUtils(page);
    const sendKeyUtils = new SendKeysUtils(page);

    // * Kullanici anaSayfaya gider
    await page.goto('https://qa.instulearn.com/');
    LoggerHelper.logInfo("Kullanici anaSayfaya gider");

    // * Kullanici 'Login" butona tiklar

    //await studentPage.getElementByName('login').click();
    //await clickUtils.clickOnLocator(studentPage.getElementByName('login'));
    await clickUtils.smartClick(
        'Login',
        () => studentPage.getElementByName('login')
    )
    LoggerHelper.logInfo('Kullanici \'Login" butona tiklar');

    // * Kullanici 'mailBox" kutusna mail girer
    //await sendKeyUtils.sendKeysOnLocator(studentPage.getElementByName("email"), studentMail);

    await sendKeyUtils.smartSendKeys(
        'Email:',
        studentMail,
        () => studentPage.getElementByName('email')
    );


    //await studentPage.getElementByName('email').fill(studentMail);
    LoggerHelper.logInfo('Kullanici \'mailBox" kutusna mail girer');

    // * Kullanici 'passwordBox" kutusuna password girer
   // await sendKeyUtils.sendKeysOnLocator(studentPage.getElementByName("password"), studentPassword);
    await sendKeyUtils.smartSendKeys(
        'Password:',
        studentPassword,
        () => studentPage.getElementByName('password')
    );


    //await studentPage.getElementByName('password').fill(studentPassword);
    LoggerHelper.logInfo("Kullanici 'passwordBox\" kutusuna password girer");

    // * Kullanici 'Login Form Submit" butona tiklar
    //await clickUtils.clickOnLocator(studentPage.getElementByName('login submit'));
    await clickUtils.smartClick(
        'Login',
        () => studentPage.getElementByName('login submit')
    );




    //await studentPage.getElementByName('login submit').click();
    LoggerHelper.logInfo("Kullanici 'Login Form Submit\" butona tiklar ");
});

test('US001StLoginTestTC05',{tag:'@googgay'}, async ({page}) => {

    /*
     * Student kullanicisi anaSayfaya gider
     * Student kullanicisi "Login" butona tiklar
     * Student kullanicisi "Email" kutusuna "studentMail yazar
     * Student kullanicis "Password" kutuusna "studentPassword" yazar
     * Student kullanicisi "Login Submit" butona tiklar
     *
     * @Given("Student kullanicisi "String" butona tiklar")
     * public void studenyKullanicisi (String elementName){
     * }
     */

    const studentPage = new StudentPage(page);
    const clickUtils = new ClickUtils(page);
    const sendKeyUtils = new SendKeysUtils(page);

    // * Kullanici anaSayfaya gider
    await page.goto('https://qa.instulearn.com/');
    LoggerHelper.logInfo("Kullanici anaSayfaya gider");

    // * Kullanici 'Login" butona tiklar

    //await studentPage.getElementByName('login').click();
    await clickUtils.clickOnLocator(studentPage.getElementByName('login'));
    LoggerHelper.logInfo('Kullanici \'Login" butona tiklar');

    // * Kullanici 'mailBox" kutusna mail girer
    await sendKeyUtils.sendKeysOnLocator(studentPage.getElementByName("email"), studentMail);
    //await studentPage.getElementByName('email').fill(studentMail);
    LoggerHelper.logInfo('Kullanici \'mailBox" kutusna mail girer');

    // * Kullanici 'passwordBox" kutusuna password girer
    await sendKeyUtils.sendKeysOnLocator(studentPage.getElementByName("password"), studentPassword);
    //await studentPage.getElementByName('password').fill(studentPassword);
    LoggerHelper.logInfo("Kullanici 'passwordBox\" kutusuna password girer");

    // * Kullanici 'Login Form Submit" butona tiklar
    await clickUtils.clickOnLocator(studentPage.getElementByName('login submit'));
    //await studentPage.getElementByName('login submit').click();
    LoggerHelper.logInfo("Kullanici 'Login Form Submit\" butona tiklar ");
});

test('US001StLoginTestTC04', async ({page}) => {

    /*
     * Student kullanicisi anaSayfaya gider
     * Student kullanicisi "Login" butona tiklar
     * Student kullanicisi "Email" kutusuna "studentMail yazar
     * Student kullanicis "Password" kutuusna "studentPassword" yazar
     * Student kullanicisi "Login Submit" butona tiklar
     *
     * @Given("Student kullanicisi "String" butona tiklar")
     * public void studenyKullanicisi (String elementName){
     * }
     */

    const studentPage = new StudentPage(page);

    // * Kullanici anaSayfaya gider
    await page.goto('https://qa.instulearn.com/');
    LoggerHelper.logInfo("Kullanici anaSayfaya gider");

    // * Kullanici 'Login" butona tiklar
    //await page.getByRole('link', { name: 'Login' }).click();
    await studentPage.getElementByName('login').click();
    LoggerHelper.logInfo('Kullanici \'Login" butona tiklar');

    // * Kullanici 'mailBox" kutusna mail girer
    //await page.getByRole('textbox', { name: 'Email:' }).fill(studentMail);
    await studentPage.getElementByName('email').fill(studentMail);
    LoggerHelper.logInfo('Kullanici \'mailBox" kutusna mail girer');

    // * Kullanici 'passwordBox" kutusuna password girer
    // await page.getByRole('textbox', { name: 'Password:' }).fill(studentPassword);
    await studentPage.getElementByName('password').fill(studentPassword);
    LoggerHelper.logInfo("Kullanici 'passwordBox\" kutusuna password girer");

    // * Kullanici 'Login Form Submit" butona tiklar
    // await page.getByRole('button', { name: 'Login' }).click();
    await studentPage.getElementByName('login submit').click();
    LoggerHelper.logInfo("Kullanici 'Login Form Submit\" butona tiklar ");
});


test('US001StLoginTestTC03', async ({page}) => {

    // * Kullanici anaSayfaya gider
    await page.goto('https://qa.instulearn.com/');
    LoggerHelper.logInfo("Kullanici anaSayfaya gider");

    // * Kullanici 'Login" butona tiklar
    await page.getByRole('link', {name: 'Login'}).click();
    LoggerHelper.logInfo('Kullanici \'Login" butona tiklar');

    // * Kullanici 'mailBox" kutusna mail girer
    await page.getByRole('textbox', {name: 'Email:'}).fill(studentMail);
    LoggerHelper.logInfo('Kullanici \'mailBox" kutusna mail girer');

    // * Kullanici 'passwordBox" kutusuna password girer
    await page.getByRole('textbox', {name: 'Password:'}).fill(studentPassword);
    LoggerHelper.logInfo("Kullanici 'passwordBox\" kutusuna password girer");

    // * Kullanici 'Login Form Submit" butona tiklar
    await page.getByRole('button', {name: 'Login'}).click();
    LoggerHelper.logInfo("Kullanici 'Login Form Submit\" butona tiklar ");
});

test('US001StLoginTestTC01', async ({page}) => {

    // * Kullanici anaSayfaya gider
    await page.goto('https://qa.instulearn.com/');
    LoggerHelper.logInfo("Kullanici anaSayfaya gider");

    // * Kullanici 'Login" butona tiklar
    await page.getByRole('link', {name: 'Login'}).click();
    LoggerHelper.logInfo('Kullanici \'Login" butona tiklar');

    // * Kullanici 'mailBox" kutusna mail girer
    await page.getByRole('textbox', {name: 'Email:'}).fill('ahmet486@IntuLearn.com');
    LoggerHelper.logInfo('Kullanici \'mailBox" kutusna mail girer');

    // * Kullanici 'passwordBox" kutusuna password girer
    await page.getByRole('textbox', {name: 'Password:'}).fill('Query.2026!');
    LoggerHelper.logInfo("Kullanici 'passwordBox\" kutusuna password girer");

    // * Kullanici 'Login Form Submit" butona tiklar
    await page.getByRole('button', {name: 'Login'}).click();
    LoggerHelper.logInfo("Kullanici 'Login Form Submit\" butona tiklar ");
});

test('US001StLoginTestTC02', async ({page}) => {

    // * Kullanici anaSayfaya gider
    await page.goto('https://qa.instulearn.com/');
    LoggerHelper.logInfo("Kullanici anaSayfaya gider");

    const studentPage = new StudentPage(page);
    await studentPage.loginWithMethod('ahmet486@IntuLearn.com', 'Query.2026!');
    LoggerHelper.logInfo("Kullanici basarili bir şekilde giris yapti. ");

    const methods = new ReusableMethods(page);
    await methods.verifyUrl('panel');


});