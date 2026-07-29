// tests/homepage.spec.ts
import { test, expect } from '@playwright/test';
import { ReusableMethods } from '../utils/ReusableMethods';

test('Button fonksiyonlari testi', async ({ page }) => {
    // ✅ Her testte methods nesnesi oluştur
    const methods = new ReusableMethods(page);

    await page.goto('https://qa.instulearn.com/');

    const homeButton = page.getByRole('link', { name: 'Home', exact: true });
    await methods.verifyButton(homeButton);
});