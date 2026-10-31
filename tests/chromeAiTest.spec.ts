import {test} from '@playwright/test';

test('InstuLearn User Login and Sidebar Navigation Test', async ({ page }) => {
    // 1. Sayfayı Aç (open)
    await page.goto('https://instulearn.com');

    // Pencere boyutunu ayarla (setWindowSize)
    await page.setViewportSize({ width: 1468, height: 693 });

    // 2. "Start learning" Butonuna Tıkla
    await page.getByRole('link', { name: 'Start learning', exact: true }).first().click();

    // 3. E-posta adresini gir (type)
    await page.getByLabel('Email', { exact: false }).or(page.locator('#email')).fill('ahmet.student.92504@InstuLearn.com');

    // 4. Şifreyi gir (type)
    await page.getByLabel('Password', { exact: false }).or(page.locator('#password')).fill('Query.2026!');

    // 5. "Login" Butonuna Tıkla (submit)
    await page.getByRole('button', { name: 'Login' }).click();

    // Giriş yapıldığını doğrulamak için bir süre bekleyebiliriz (Örn: Menünün yüklenmesi)
    await page.waitForLoadState('networkidle');

    // 6. Yan Menü (Sidebar) Navigasyon Adımları
    // Not: Selenium IDE'deki karmaşık 'nth-child' yapıları yerine doğrudan metinlerle eşleştirdim.

    // Meetings sekmesine tıkla
    await page.locator('#panel-sidebar-scroll').getByText('Meetings').click();

    // Quizzes sekmesine tıkla
    await page.locator('#panel-sidebar-scroll').getByText('Quizzes').click();

    // Certificates sekmesine tıkla
    await page.locator('#panel-sidebar-scroll').getByText('Certificates').click();

    // Financial sekmesine tıkla
    await page.locator('#panel-sidebar-scroll').getByText('Financial').click();

    // Support sekmesine tıkla
    await page.locator('#panel-sidebar-scroll').getByText('Support').click();

    // Notifications sekmesine tıkla
    await page.locator('#panel-sidebar-scroll').getByText('Notifications').click();

    // Settings sekmesine tıkla
    await page.locator('#panel-sidebar-scroll').getByText('Settings').click();
});
