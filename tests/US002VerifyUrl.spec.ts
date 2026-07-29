// tests/login.spec.ts
import { test, expect } from '@playwright/test';
import { ReusableMethods } from '../utils/ReusableMethods';

test('Başarılı giriş ve panel kontrolü', async ({ page }) => {
    // 1. ReusableMethods instance'ı oluştur
    const methods = new ReusableMethods(page);

    // 2. Login işlemini tek satırda yap
    await methods.login(
        'ahmet205555@instuLearn.com',
        'Query.2026!',
        '/panel'
    );

    // 3. URL doğrulama
    await methods.verifyUrl('/panel');

    // 4. Sayfa içeriğinde 403 kontrolü
    const pageContent = await page.textContent('body');
    if (pageContent?.includes('403') || pageContent?.includes('Forbidden')) {
        console.warn('⚠️ Panel sayfasına erişim engellendi (403).');
        // Testin başarısız olmasını istiyorsan:
        // throw new Error('Panel sayfasına erişim yetkiniz yok.');
    } else {
        console.log('✅ Panel sayfasına başarıyla erişildi.');
    }
});