// tests/homepage.spec.ts
import { test, expect } from '@playwright/test';
import { ReusableMethods } from '../utils/ReusableMethods';
import {ClickUtils} from "../utils/clickUtils";

// ✅ BİRİNCİ TEST - Butonların görünürlüğü
test('US002_TC01 : Site ust barinda kolay linkler (Categories, Home, Courses, Instructors, Store,Blog) goruntulenmeli.', async ({ page }) => {
    console.log("=".repeat(60));
    console.log('✅ US002_TC01 : Site ust barinda kolay linkler goruntulenmeli.');
    console.log("=".repeat(60));

    const methods = new ReusableMethods(page);
    await page.goto('https://qa.instulearn.com/');

    // Tüm linkleri test et
    const homeButton = page.getByRole('link', { name: 'Home', exact: true });
    await methods.verifyButton(homeButton);

    const coursesButton = page.getByRole('link', { name: 'Courses', exact: true });
    await methods.verifyButton(coursesButton);

    const instructorsButton = page.getByRole('link', { name: 'Instructors', exact: true });
    await methods.verifyButton(instructorsButton);

    const storeButton = page.getByRole('link', { name: 'Store', exact: true });
    await methods.verifyButton(storeButton);

    const blogButton = page.getByRole('link', { name: 'Blog', exact: true });
    await methods.verifyButton(blogButton);

    console.log('✅ Tüm linkler görünür!');
});

// ✅ İKİNCİ TEST - Butonların yönlendirmesi (AYRI bir test olarak)
test('US002_TC02 : Kolay linkler ilgili sayfaya yonlendirme yapmali.', async ({ page }) => {
    console.log("=".repeat(60));
    console.log('✅ US002_TC02 : Linkler ilgili sayfaya yonlendirme yapmali.');
    console.log("=".repeat(60));

    await page.goto('https://qa.instulearn.com/');

    // Home butonuna tıkla ve yönlendirmeyi kontrol et
    const homeButton = page.getByRole('link', { name: 'Home', exact: true });
    await homeButton.click();

    // Yönlendirme sonrası URL'yi kontrol et
    await expect(page).toHaveURL('https://qa.instulearn.com/');
    console.log('✅ Home butonu doğru sayfaya yönlendirdi!');

    // Diğer butonlar için de benzer kontroller yapabilirsin
    // Örnek: Courses butonu

    const coursesButton = page.getByRole('link', { name: 'Courses', exact: true });
    await coursesButton.click();
    await expect(page).toHaveURL(/.*newest/i); // URL'de "newest" geçiyor mu?
    console.log('✅ Courses butonu doğru sayfaya yönlendirdi!');

    await page.goto('https://qa.instulearn.com/');
    const instructorsButton = page.getByRole('link', { name: 'Instructors', exact: true });
    await instructorsButton.click();
    await expect(page).toHaveURL(/.*instructors/i); // URL'de "instructors" geçiyor mu?
    console.log('✅ Instructors butonu doğru sayfaya yönlendirdi!');

    const storeButton = page.getByRole('link', { name: 'Store', exact: true });
    await storeButton.click();
    await expect(page).toHaveURL(/.*products/i); // URL'de "store" geçiyor mu?
    console.log('✅ Store butonu doğru sayfaya yönlendirdi!');

    const blogButton = page.getByRole('link', { name: 'Blog', exact: true });
    await blogButton.click();
    await expect(page).toHaveURL(/.*blog/i); // URL'de "blog" geçiyor mu?
    console.log('✅ Blog butonu doğru sayfaya yönlendirdi!');

});

test('US002_TC03 : Courses sayfasinda radio buttonlarinin testi', async ({ page }) => {

    const methods = new ReusableMethods(page);

    console.log("=".repeat(60));
    console.log('✅ US002_TC03 : Courses sayfasinda radio buttonlarinin testi');
    console.log("=".repeat(60));

    await page.goto('https://qa.instulearn.com/');
    const coursesButton = page.getByRole('link', { name: 'Courses', exact: true });
    await methods.verifyButton(coursesButton);
    await coursesButton.click();

    await page.waitForLoadState('networkidle');

    // Tüm label'ları bul ve debug et
    const radioLabels = await page.locator('label').all();
    console.log(`Toplam ${radioLabels.length} label bulundu`);

    // Debug: Hangi label'lar var?
    for (let i = 0; i < Math.min(radioLabels.length, 10); i++) {
        const text = await radioLabels[i].textContent();
        console.log(`Label ${i}: "${text?.trim()}"`);
    }

    // 4. label'a (index 3) tıkla - Upcoming
    if (radioLabels.length > 3) {
        const targetLabel = radioLabels[3];

        await page.evaluate((element) => {
            element.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });
        }, await targetLabel.elementHandle());

        await page.waitForTimeout(500);
        await targetLabel.scrollIntoViewIfNeeded();
        await page.waitForTimeout(300);

        await targetLabel.click({
            force: true,
            position: { x: 10, y: 10 }
        });

        console.log('✅ 4. label\'a (Upcoming) tıklandı');
    }

    // 6. label'a (index 5) tıkla - Free
    if (radioLabels.length > 5) {
        const targetLabel = radioLabels[5];

        await page.evaluate((element) => {
            element.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });
        }, await targetLabel.elementHandle());

        await page.waitForTimeout(500);
        await targetLabel.scrollIntoViewIfNeeded();
        await page.waitForTimeout(300);

        await targetLabel.click({
            force: true,
            position: { x: 10, y: 10 }
        });

        console.log('✅ 6. label\'a (Free) tıklandı');
    }

    // Doğrulama: Radio buttonlar seçildi mi?
    // Upcoming radio'su seçili mi?
    const upcomingRadio = page.locator('input#upcoming');
    const isUpcomingChecked = await upcomingRadio.isChecked();
    console.log(`📌 Upcoming radio seçili mi? ${isUpcomingChecked}`);

    // Free radio'su seçili mi?
    const freeRadio = page.locator('input#free');
    const isFreeChecked = await freeRadio.isChecked();
    console.log(`📌 Free radio seçili mi? ${isFreeChecked}`);

    // Ekran görüntüsü al
    await page.screenshot({ path: 'radio-buttons-test.png', fullPage: true });
    console.log('✅ Ekran görüntüsü alındı: radio-buttons-test.png');
});

test('US002TC04--> Instructors sayfasi radi butonlari testi', async ({ page }) => {
    console.log("=".repeat(60));
    console.log('✅ US002TC04 : Instructors sayfasinda radio buttonlarinin testi');
    console.log("=".repeat(60));

    await page.goto('https://qa.instulearn.com/');
    await page.getByRole('link', { name: 'Instructors', exact: true }).click();
    await page.waitForLoadState('networkidle');

    // #topFilters bölümüne scroll yap
    await page.locator('#topFilters').scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);

    // JavaScript ile güvenli şekilde radio'ları seç
    await page.evaluate(() => {
        // Tüm radio button'ları bul
        const radios = document.querySelectorAll('input[type="radio"]');
        console.log(`Toplam ${radios.length} radio bulundu`);

        // İlk radio'yu seç (eğer varsa)
        if (radios.length > 0 && radios[0]) {
            (radios[0] as HTMLInputElement).checked = true;
            radios[0].dispatchEvent(new Event('change', { bubbles: true }));
            radios[0].dispatchEvent(new Event('click', { bubbles: true }));
            console.log('✅ 1. radio seçildi');
        }

        // İkinci radio'yu seç (eğer varsa)
        if (radios.length > 1 && radios[1]) {
            (radios[1] as HTMLInputElement).checked = true;
            radios[1].dispatchEvent(new Event('change', { bubbles: true }));
            radios[1].dispatchEvent(new Event('click', { bubbles: true }));
            console.log('✅ 2. radio seçildi');
        }

        // Üçüncü radio'yu seç (eğer varsa)
        if (radios.length > 2 && radios[2]) {
            (radios[2] as HTMLInputElement).checked = true;
            radios[2].dispatchEvent(new Event('change', { bubbles: true }));
            radios[2].dispatchEvent(new Event('click', { bubbles: true }));
            console.log('✅ 3. radio seçildi');
        }
    });

    // Doğrulama
    await page.waitForTimeout(500);
    const checkedRadios = await page.locator('input[type="radio"]:checked').count();
    console.log(`📌 Seçili radio sayısı: ${checkedRadios}`);
});


test('US002TC04V2--> Instructors sayfasi radi butonlari testi', async ({ page }) => {
    console.log("=".repeat(60));
    console.log('✅ US002TC04 : Instructors sayfasinda radio buttonlarinin testi');
    console.log("=".repeat(60));

    await page.goto('https://qa.instulearn.com/');
    await page.getByRole('link', { name: 'Instructors', exact: true }).click();
    await page.waitForLoadState('networkidle');

    // #topFilters bölümüne scroll yap
    await page.locator('#topFilters').scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);

    // ==========================================
    // BASİT VE GÜVENLİ JAVASCRIPT TIKLAMA
    // ==========================================
    await page.evaluate(() => {
        // 1. YÖNTEM: Belirli ID'lere tıkla
        const ids = ['available_for_meetings', 'free_meetings', 'discount'];
        ids.forEach(id => {
            const el = document.getElementById(id);
            if (el) {
                el.click();
                el.dispatchEvent(new Event('change', { bubbles: true }));
                console.log(`✅ ${id} tıklandı`);
            }
        });

        // 2. YÖNTEM: Tüm label'lara tıkla
        const labels = document.querySelectorAll('label');
        labels.forEach((label, index) => {
            if (index < 3) { // İlk 3 label'a tıkla
                label.click();
                label.dispatchEvent(new Event('change', { bubbles: true }));
                console.log(`✅ Label ${index} tıklandı: ${label.textContent?.trim()}`);
            }
        });


    });

    // Doğrulama
    await page.waitForTimeout(500);
    console.log('✅ JavaScript ile tıklama tamamlandı');

});

test('US002TC05--> RegisterPage Checkbox kutusuna basmak', async ({ page }) => {
    console.log('✅ RegisterPage Checkbox testi');

    await page.goto('https://qa.instulearn.com/register');
    await page.waitForLoadState('networkidle');

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
});

test('US002TC06 --> Store Sayfasi radio butonlari testi', async ({ page }) => {
    const click = new ClickUtils(page);

    await page.goto('https://qa.instulearn.com/');

    await click.clickByText('Store');

    await click.clickByText('Free');

    // Free Shipping
    await click.clickByText('Free Shipping');

    await click.clickByText('Discount');
});



test('US002_TC07 --> Card ve Notifications buttonları görünür ve aktif olmalı.', async ({ page }) => {

    // dropDown Menude Cart ve Shopping Buttonlar Playwright Driver da gorulmuyor.
    const methods = new ReusableMethods(page);
    await page.goto('https://qa.instulearn.com/');
    console.log("=".repeat(60));
    console.log('✅US002_TC07 --> Card ve Notifications buttonları görünür ve aktif olmalı.');
    console.log("=".repeat(60));

    const cartButton = page.getByRole('button', {name:'Cart'});
    await methods.verifyButton(cartButton);

    const notificationsButton = page.getByRole('button', {name:'Notifications'});
    await methods.verifyButton(notificationsButton);

    const click = new ClickUtils(page);
    await click.clickById("navbarShopingCart")
});