// C:\Users\user\WebstormProjects\ts-ui-project\tests\US002LoggerClassExample.spec.ts
import {test} from '@playwright/test';


import {LoggerHelper} from "../utils/LoggerHelper";

test('InstuLearn Ana Sayfa Log Testi', async ({ page }) => {
    LoggerHelper.logInfo('=== TEST BAŞLADI ===');

    LoggerHelper.logInfo('InstuLearn ana sayfasına gidiliyor...');
    await page.goto('https://qa.instulearn.com/');

    LoggerHelper.logInfo('Ana sayfaya başarıyla gidildi.');
    LoggerHelper.logInfo('=== TEST TAMAMLANDI ===');
});
