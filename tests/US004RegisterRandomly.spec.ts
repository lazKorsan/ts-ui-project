import { test, expect } from '@playwright/test';
import { ReusableMethods } from '../utils/ReusableMethods';
import {ClickUtils} from "../utils/clickUtils";
import {SendKeysUtils} from "../utils/SendKeysUtils";
import { logger } from '../utils/logger';

type UserRole = 'student' | 'teacher' | 'organizer';

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

    // Secilen Role gore butona Basmakliklik

    // butonlar
    // await click.clickByText('Student')
    // await click.clickByText('Instructor')
    //  await click.clickByText('Organization')

    // Gelen sayiya gore hesap uretmek islemleri once zaman damgası olusturmakliklik
    const timeString = new Date().toLocaleTimeString('tr-TR');

    // İki nokta üst üste (:) işaretlerini kaldırmakliklik (Sonuç: "230315")
    const lastSixDigits = timeString.replace(/:/g, '');

    // E-postayı oluşturmakliklik
    const teacherMail = `ahmet.teacher${lastSixDigits}@instuLearn.com`;
    logger.info(teacherMail);
    const studentMail = `ahmet.student${lastSixDigits}@instuLearn.com`;
    logger.info(studentMail);
    const organizatorMail = `ahmet.organizator${lastSixDigits}@instuLearn.com`;
    logger.info(organizatorMail);




















});