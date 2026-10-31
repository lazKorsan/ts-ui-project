import {expect, test} from '@playwright/test';
import {LoggerHelper} from "../utils/LoggerHelper";

test('Ana sayfa erişilebilir olmalıdır', async ({ page }) => {
    // 1. Test başlangıcını logla
    LoggerHelper.logInfo('🚀 Test başlıyor: Ana sayfa erişilebilir olmalıdır');
  
    LoggerHelper.logInfo(`📍 Hedef URL: https://qa.instulearn.com/`);

    // 2. Adım: Belirtilen URL'ye gidin
    LoggerHelper.logInfo('⏳ Sayfaya gidiliyor...');
    await page.goto('https://qa.instulearn.com/');
    LoggerHelper.logInfo('✅ Sayfa yüklendi!');

    // 3. Sayfa başlığını konsola yazdır
    const pageTitle = await page.title();
    LoggerHelper.logInfo(`📄 Sayfa başlığı: "${pageTitle}"`);

    // 4. Adım: Sayfanın başarıyla yüklendiğini doğrulayın
    LoggerHelper.logInfo('🔍 Sayfa başlığı kontrol ediliyor...');
    await expect(page).toHaveTitle(/InstuLearn/);
    LoggerHelper.logInfo('✅ Sayfa başlığı doğrulandı!');

    // 5. Adım: Sayfadaki ana başlıkları bul ve logla
    LoggerHelper.logInfo('🔍 "Featured Courses" başlığı aranıyor...');
    const featuredHeader = page.getByRole('heading', { name: /Featured Courses/i });
    await expect(featuredHeader).toBeVisible();
    LoggerHelper.logInfo('✅ "Featured Courses" başlığı görünür!');

    // 6. Ek bilgi: Sayfanın URL'sini kontrol et
    const currentUrl = page.url();
    LoggerHelper.logInfo(`🌐 Mevcut URL: ${currentUrl}`);
    await expect(page).toHaveURL('https://qa.instulearn.com/');
    LoggerHelper.logInfo('✅ URL doğrulandı!');

    // 7. Test bitişini logla
    LoggerHelper.logInfo('🎉 Test başarıyla tamamlandı!');
});