import { test, expect } from '@playwright/test';
import { ReusableMethods } from '../utils/ReusableMethods';
import { ClickUtils } from "../utils/clickUtils";
import { SendKeysUtils } from "../utils/SendKeysUtils";
import { logger } from '../utils/logger';


export type UserRole = 'student' | 'teacher' | 'organizer';
test('US004_TC01--Randomly register test', async ({ page }) => {

    const click = new ClickUtils(page);
    const sendKeys = new SendKeysUtils(page);
    const methods = new ReusableMethods(page);

    logger.info("=".repeat(90));
    logger.info("US004_TC01 Test Koşuluyor")
    logger.info("=".repeat(90));

    // Kullanici anaSayfa gider
    await page.goto('https://qa.instulearn.com/');

    // Kullanici Register Butonuna Basar
    await click.clickByText('Register');
    logger.info('Kullanici Register Butonuna Basti')

    // register sayfasinda olduğunu doğrular
    await methods.verifyUrl('register');
    logger.info('Kullanici Register sayfasinda oldugunu dogrular')

    // 1 ile 100 arasında rastgele bir tam sayı üretmekliklik
    const randomNumber = Math.floor(Math.random() * 100) + 1;
    logger.info(`Üretilen Rastgele Sayı: ${randomNumber}`);

    // 2. Sayı aralığına göre rolü belirlemekliklik
    let selectedRole: UserRole;

    if (randomNumber >= 1 && randomNumber <= 40) {
        selectedRole = 'student';
    } else if (randomNumber >= 41 && randomNumber <= 90) {
        selectedRole = 'teacher';
    } else {
        selectedRole = 'organizer';
    }

    // Uretilen randomly role
    logger.info(`Üretilen Rastgele Role: ${selectedRole}`);

    // Gelen sayiya gore hesap uretmek islemleri once zaman damgası olusturmakliklik
    const timeString = new Date().toLocaleTimeString('tr-TR');
    const lastSixDigits = timeString.replace(/:/g, '');

    // Formda kullanılacak nihai e-posta değişkeni
    let finalEmail: string = '';

    // Seçilen role göre hem butona basma hem de mail seçme işlemlerini tek bir yerde yönetiyoruz
    switch (selectedRole) {
        case 'student':
            // 1. İşlem: Öğrenci butonuna basmak
            await click.clickByText('Student');
            logger.info('Kayıt türü olarak Student seçildi.');

            // 2. İşlem: Öğrenci mailini belirlemek
            finalEmail = `ahmet.student${lastSixDigits}@instuLearn.com`;
            break;

        case 'teacher':
            // 1. İşlem: Öğretmen butonuna basmak (Instulearn arayüzünde Instructor olarak geçer)
            await click.clickByText('Instructor');
            logger.info('Kayıt türü olarak Instructor seçildi.');

            // 2. İşlem: Öğretmen mailini belirlemek
            finalEmail = `ahmet.teacher${lastSixDigits}@instuLearn.com`;
            break;

        case 'organizer':
            // 1. İşlem: Organizatör butonuna basmak (Instulearn arayüzünde Organization olarak geçer)
            await click.clickByText('Organization');
            logger.info('Kayıt türü olarak Organization seçildi.');

            // 2. İşlem: Organizatör mailini belirlemek
            finalEmail = `ahmet.organizator${lastSixDigits}@instuLearn.com`;
            break;
    }

    // Seçilen dinamik e-postayı logla
    logger.info(`Formda kullanılacak e-posta adresi: ${finalEmail}`);

    // Bundan sonraki adımlarda tek bir 'finalEmail' değişkenini input alanına gönderebilirsiniz
    // Örnek kullanım:
    // await sendKeys.fillInput('#email', finalEmail);


    await sendKeys.sendKeysByText('Email', finalEmail);

    await sendKeys.sendKeysByText('full_name', 'ahmet');

    await sendKeys.sendByXpath('//input[@id="password"]','Query.2026!')

    //    await page.getByRole('textbox', { name: 'Password:', exact: true }).fill('Query.2026!');
    await page.getByRole('textbox', { name: 'Retype Password:', exact: true }).scrollIntoViewIfNeeded();

    await sendKeys.sendByXpath('//input[@id="confirm_password"]','Query.2026!');


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

    logger.info('✅ Test tamamlandı!');

    await click.click('#app > div.container > div > div:nth-child(2) > div > form > button');

});
