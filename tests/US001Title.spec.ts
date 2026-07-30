import { test, expect } from '@playwright/test';

test('Ana sayfa erişilebilir olmalıdır', async ({ page }) => {
    // 1. Test başlangıcını logla
    console.log('🚀 Test başlıyor: Ana sayfa erişilebilir olmalıdır');
    console.log(`📍 Hedef URL: https://qa.instulearn.com/`);

    // 2. Adım: Belirtilen URL'ye gidin
    console.log('⏳ Sayfaya gidiliyor...');
    await page.goto('https://qa.instulearn.com/');
    console.log('✅ Sayfa yüklendi!');

    // 3. Sayfa başlığını konsola yazdır
    const pageTitle = await page.title();
    console.log(`📄 Sayfa başlığı: "${pageTitle}"`);

    // 4. Adım: Sayfanın başarıyla yüklendiğini doğrulayın
    console.log('🔍 Sayfa başlığı kontrol ediliyor...');
    await expect(page).toHaveTitle(/InstuLearn/);
    console.log('✅ Sayfa başlığı doğrulandı!');

    // 5. Adım: Sayfadaki ana başlıkları bul ve logla
    console.log('🔍 "Featured Courses" başlığı aranıyor...');
    const featuredHeader = page.getByRole('heading', { name: /Featured Courses/i });
    await expect(featuredHeader).toBeVisible();
    console.log('✅ "Featured Courses" başlığı görünür!');

    // 6. Ek bilgi: Sayfanın URL'sini kontrol et
    const currentUrl = page.url();
    console.log(`🌐 Mevcut URL: ${currentUrl}`);
    await expect(page).toHaveURL('https://qa.instulearn.com/');
    console.log('✅ URL doğrulandı!');

    // 7. Test bitişini logla
    console.log('🎉 Test başarıyla tamamlandı!');
});