import {expect, test} from '@playwright/test';
import {ClickUtils} from "../utils/clickUtils";
import {ReusableMethods} from "../utils/ReusableMethods";
import {SendKeysUtils} from "../utils/SendKeysUtils";
import {logger} from "../utils/logger";

test('US006TC01--> Anasayfa body bölümünde Featured Courses baslıgı altında öne cıkan kurslar görüntülenebilmeli ve tıklandıgında ilgili sayfaya yönlendirmelidir.', async ({ page }) => {

    const click = new ClickUtils(page);
    const sendKeys = new SendKeysUtils(page);
    const methods = new ReusableMethods(page);

    logger.info("=".repeat(90));
    logger.info("US006--> Anasayfa body bölümünde Featured Courses baslıgı altında öne cıkan kurslar görüntülenebilmeli ve tıklandıgında ilgili sayfaya yönlendirmelidir.")
    logger.info("=".repeat(90));

    await page.goto('https://qa.instulearn.com/');

    //
    //const featuredCoursesText= page.getByText('Featured Courses #Browse');
    await expect(page.getByText('Featured Courses #Browse')).toBeVisible();

    logger.info("=".repeat(90));
    logger.info("featured Courses element gorunurlugu dogrulandi");
    logger.info("=".repeat(90));

    await page.getByRole('link', { name: 'Mastering Java Programming' }).first().click();

    await methods.verifyUrl('/course/Java');

});

test('US006TC02-->Anasayfa body bölümünde Newest Courses baslıgı altında yeni cıkan kurslar ,' +
    '(Kurs kartlarında fiyat,saat,tarih,instructor bilgileri ) goruntulenebilmeli ' +
    've tıklandıgında ilgili sayfaya yönlendirmelidir.' +
    'Sayfada bulunan view all ikonu görünür ve aktif olmalıdır.' +
    'Kartların altında go to card ikonları sayfa geçişini saglamalıdır.', async ({ page }) => {


    const click = new ClickUtils(page);
    const sendKeys = new SendKeysUtils(page);
    const methods = new ReusableMethods(page);

    logger.info("=".repeat(90));
    logger.info("US006TC02-->Test basliyor")

    // ana sayfaya gitmekliklik
    await page.goto('https://qa.instulearn.com/');

    // NewestCourses text elementi dogrulama
    await expect(page.getByText('Newest Courses #Recently')).toBeVisible();
    await expect(page.getByRole('link', { name: 'Mustafa Emre' })).toBeVisible();
    await expect(page.locator('a').filter({ hasText: 'Scratch' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Programming Language' }).first()).toBeVisible();
    await expect(page.locator('div:nth-child(5) > .webinar-card > figure > .webinar-card-body > .webinar-price-box')).toBeVisible();
    await page.locator('a').filter({ hasText: 'Scratch' }).click();
    await expect(page.getByText('Information Content (0)')).toBeVisible();
    await expect(page.getByText('Start Date:')).toBeVisible();
    await expect(page.getByText('Capacity:')).toBeVisible();
    await expect(page.getByText('Students:')).toBeVisible();

    await methods.verifyUrl('/course/Scratch');
});
test('US006TC03-->Anasayfa body bölümünde Latest bundles baslıgı altında son cıkan paketler ' +
    '(Kurs kartlarında fiyat,saat,tarih,instructor bilgileri ) goruntulenebilmeli ve ' +
    'tıklandıgında ilgili sayfaya yönlendirmelidir.' +
    'Sayfada bulunan view all ikonu görünür ve aktif olmalıdır.' +
    'Kartların altında go to card ikonları sayfa geçişini saglamalıdır.', async ({ page }) => {


    const click = new ClickUtils(page);
    const sendKeys = new SendKeysUtils(page);
    const methods = new ReusableMethods(page);

    logger.info("=".repeat(90));
    logger.info("US006TC03-->Test basliyor")

    // ana sayfaya gitmekliklik
    await page.goto('https://qa.instulearn.com/');





});

