import { test, expect } from '@playwright/test';
import { ClickUtils } from '../utils/clickUtils';
import { SendKeysUtils } from '../utils/SendKeysUtils';

test('Süper SendKeysUtils ile text gönder', async ({ page }) => {
    const click = new ClickUtils(page);
    const sendKeys = new SendKeysUtils(page);

    // 🌐 Sayfaya git
    await page.goto('https://qa.instulearn.com/register');
    await sendKeys.waitForPageLoad();

    // ============================================
    // ⌨️ HER TÜRLÜ TEXT GÖNDERME
    // ============================================

    // 1. Normal text gönder
    await sendKeys.sendKeys('#username', 'testuser123');

    // 2. Label ile text gönder
    await sendKeys.sendKeysByText('Email', 'test@example.com');

    // 3. Placeholder ile text gönder
    await sendKeys.sendKeysByText('Enter your password', 'MySecretPass123');

    // 4. XPath ile text gönder
    await sendKeys.sendByXpath('//input[@name="phone"]', '555-1234');

    // 5. Özel ayarlarla text gönder
    await sendKeys.sendKeys('#bio', 'Bu benim biyografim...', {
        clearBefore: true,
        highlight: true,
        charDelay: 100, // Karakter arası 100ms
        verify: true
    });

    // 6. Text ekle (temizlemeden)
    await sendKeys.appendToElement('#message', ' Ek metin');

    // 7. Input temizle
    await sendKeys.clearField('#username');

    // 8. Enter tuşuna bas
    await sendKeys.pressEnter('#submit-btn');

    // 9. Tab tuşuna bas
    await sendKeys.pressTab('#username');

    console.log('✅ Tüm text gönderme işlemleri başarılı!');
});