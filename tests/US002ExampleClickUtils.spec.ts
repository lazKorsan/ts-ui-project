import { test, expect } from '@playwright/test';
import { ClickUtils } from '../utils/clickUtils';

test('Süper ClickUtils ile tüm elementlere tıkla', async ({ page }) => {
    const click = new ClickUtils(page);

    // 🌐 Sayfaya git
    await page.goto('https://qa.instulearn.com/register');
    await click.waitForPageLoad();

    // ============================================
    // 🎯 HER TÜRLÜ TIKLAMA
    // ============================================

    // 1. Normal buton tıkla
    await click.click('button:has-text("Register")');

    // 2. Text ile tıkla (tam eşleşme)
    await click.clickByText('Login');

    // 3. Text ile tıkla (kısmi eşleşme)
    await click.clickByPartialText('agree with terms');

    // 4. ID ile tıkla
    await click.clickById('submit-btn');

    // 5. Role ile tıkla
    await click.clickByRole('button', 'Submit');

    // 6. Checkbox tıkla (özel method)
    await click.checkCheckbox('I agree with terms & rules');

    // 7. Radio tıkla
    await click.checkCheckbox('available_for_meetings');

    // 8. Özel ayarlarla tıkla
    await click.click('button', {
        timeout: 10000,
        highlight: true,
        skipHover: true,
        waitAfterClick: 500
    });

    // 9. Locator ile tıkla
    const locator = page.locator('.custom-class');
    await click.clickOnLocator(locator);

    console.log('✅ Tüm tıklamalar başarılı!');
});