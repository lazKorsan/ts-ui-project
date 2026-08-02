// C:\Users\user\WebstormProjects\ts-ui-project\tests\US002LoggerClassExample.spec.ts
import { test, expect } from '@playwright/test';

import { logger } from '../utils/logger';

test('InstuLearn Ana Sayfa Log Testi', async ({ page }) => {
    logger.info('=== TEST BAŞLADI ===');

    logger.info('InstuLearn ana sayfasına gidiliyor...');
    await page.goto('https://qa.instulearn.com/');

    logger.info('Ana sayfaya başarıyla gidildi.');
    logger.info('=== TEST TAMAMLANDI ===');
});
