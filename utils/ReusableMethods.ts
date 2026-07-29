// utils/ReusableMethods.ts
import { Page, Locator, expect } from '@playwright/test';

/**
 * Terminal renk kodları için enum
 */
enum ConsoleColors {
    Blue = '\x1b[34m',
    Green = '\x1b[32m',
    Yellow = '\x1b[33m',
    Red = '\x1b[31m',
    Cyan = '\x1b[36m',
    Reset = '\x1b[0m',
    Bold = '\x1b[1m'
}

/**
 * Log seviyeleri
 */
enum LogLevel {
    INFO = 'ℹ️',
    SUCCESS = '✅',
    WARNING = '⚠️',
    ERROR = '❌',
    DEBUG = '🔍'
}

/**
 * Buton doğrulama seçenekleri
 */
interface ButtonVerifyOptions {
    timeout?: number;
    visible?: boolean;
    enabled?: boolean;
    screenshotOnFail?: boolean;
}

/**
 * URL doğrulama seçenekleri
 */
interface UrlVerifyOptions {
    timeout?: number;
    exactMatch?: boolean;
    screenshotOnFail?: boolean;
}

/**
 * Tekrar kullanılabilir test metodları
 * @class ReusableMethods
 */
export class ReusableMethods {
    private page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    /**
     * Özel log mesajı oluşturur
     */
    private log(message: string, level: LogLevel = LogLevel.INFO, color: ConsoleColors = ConsoleColors.Cyan): void {
        const separator = '═'.repeat(60);
        console.log(`${ConsoleColors.Bold}${color}${separator}${ConsoleColors.Reset}`);
        console.log(`${ConsoleColors.Bold}${color}${level} ${message}${ConsoleColors.Reset}`);
        console.log(`${ConsoleColors.Bold}${color}${separator}${ConsoleColors.Reset}`);
    }

    /**
     * Hata logu
     */
    private logError(message: string): void {
        console.log(`${ConsoleColors.Red}❌ ${message}${ConsoleColors.Reset}`);
    }

    /**
     * Başarı logu
     */
    private logSuccess(message: string): void {
        console.log(`${ConsoleColors.Green}✅ ${message}${ConsoleColors.Reset}`);
    }

    /**
     * Bilgi logu
     */
    private logInfo(message: string): void {
        console.log(`${ConsoleColors.Cyan}ℹ️ ${message}${ConsoleColors.Reset}`);
    }

    /**
     * Butonun görünür ve tıklanabilir olduğunu doğrular
     */
    async verifyButton(
        selector: string | Locator,
        options: ButtonVerifyOptions = {}
    ): Promise<void> {
        const {
            timeout = 5000,
            visible = true,
            enabled = true,
            screenshotOnFail = true
        } = options;

        this.logInfo(`Buton doğrulanıyor: ${typeof selector === 'string' ? selector : 'Locator'}`);

        const button = typeof selector === 'string' ? this.page.locator(selector) : selector;

        try {
            if (visible) {
                await expect(button).toBeVisible({ timeout });
                this.logSuccess('Buton görünür ✔');
            }

            if (enabled) {
                await expect(button).toBeEnabled({ timeout });
                this.logSuccess('Buton tıklanabilir ✔');
            }

            try {
                const buttonText = await button.textContent();
                if (buttonText) {
                    this.logInfo(`Buton metni: "${buttonText.trim()}"`);
                }
            } catch (error) {
                // Text alınamazsa sessizce geç
            }

            this.log('Buton doğrulama başarılı!', LogLevel.SUCCESS, ConsoleColors.Green);

        } catch (error: any) {
            this.logError(`Buton doğrulama başarısız: ${error.message}`);

            if (screenshotOnFail) {
                try {
                    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
                    await this.page.screenshot({
                        path: `screenshots/button-verify-fail-${timestamp}.png`,
                        fullPage: true
                    });
                    this.logInfo(`Ekran görüntüsü kaydedildi: screenshots/button-verify-fail-${timestamp}.png`);
                } catch (ssError) {
                    this.logError('Ekran görüntüsü alınamadı');
                }
            }

            throw error;
        }
    }

    /**
     * URL'nin beklenen kısmı içerdiğini doğrular
     */
    async verifyUrl(
        expectedUrlPart: string | RegExp,
        options: UrlVerifyOptions = {}
    ): Promise<void> {
        const {
            timeout = 7000,
            screenshotOnFail = true
        } = options;

        this.logInfo(`URL doğrulanıyor: ${expectedUrlPart}`);

        try {
            let regex: RegExp;

            if (typeof expectedUrlPart === 'string') {
                regex = new RegExp(expectedUrlPart);
            } else {
                regex = expectedUrlPart;
            }

            await expect(this.page).toHaveURL(regex, { timeout });

            const actualUrl = this.page.url();
            this.logSuccess(`URL doğrulama başarılı ✔`);
            this.logInfo(`Mevcut URL: ${actualUrl}`);

            try {
                const url = new URL(actualUrl);
                if (url.searchParams.toString()) {
                    this.logInfo(`URL parametreleri: ${url.searchParams.toString()}`);
                }
            } catch (error) {
                // URL parse edilemezse sessizce geç
            }

            this.log('URL doğrulama başarılı!', LogLevel.SUCCESS, ConsoleColors.Green);

        } catch (error: any) {
            this.logError(`URL doğrulama başarısız: ${error.message}`);
            this.logError(`Beklenen: ${expectedUrlPart}`);
            this.logError(`Mevcut URL: ${this.page.url()}`);

            if (screenshotOnFail) {
                try {
                    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
                    await this.page.screenshot({
                        path: `screenshots/url-verify-fail-${timestamp}.png`,
                        fullPage: true
                    });
                    this.logInfo(`Ekran görüntüsü kaydedildi: screenshots/url-verify-fail-${timestamp}.png`);
                } catch (ssError) {
                    this.logError('Ekran görüntüsü alınamadı');
                }
            }

            throw error;
        }
    }

    /**
     * Sayfa başlığını doğrular
     */
    async verifyTitle(expectedTitle: string | RegExp, timeout: number = 5000): Promise<void> {
        this.logInfo(`Sayfa başlığı doğrulanıyor: ${expectedTitle}`);

        try {
            if (typeof expectedTitle === 'string') {
                await expect(this.page).toHaveTitle(expectedTitle, { timeout });
            } else {
                const title = await this.page.title();
                expect(title).toMatch(expectedTitle);
            }

            const actualTitle = await this.page.title();
            this.logSuccess(`Başlık doğrulama başarılı ✔`);
            this.logInfo(`Başlık: ${actualTitle}`);

        } catch (error: any) {
            this.logError(`Başlık doğrulama başarısız: ${error.message}`);
            throw error;
        }
    }

    /**
     * Elementin text içeriğini doğrular
     */
    async verifyText(
        selector: string | Locator,
        expectedText: string | RegExp,
        timeout: number = 5000
    ): Promise<void> {
        this.logInfo(`Text doğrulanıyor: ${expectedText}`);

        const element = typeof selector === 'string' ? this.page.locator(selector) : selector;

        try {
            if (typeof expectedText === 'string') {
                await expect(element).toHaveText(expectedText, { timeout });
            } else {
                const actualText = await element.textContent();
                expect(actualText).toMatch(expectedText);
            }

            this.logSuccess(`Text doğrulama başarılı ✔`);
            const text = await element.textContent();
            if (text) {
                this.logInfo(`Text: "${text.trim()}"`);
            }

        } catch (error: any) {
            this.logError(`Text doğrulama başarısız: ${error.message}`);
            throw error;
        }
    }

    /**
     * Sayfa yönlendirmesini bekle ve doğrula
     */
    async waitForNavigationAndVerify(
        expectedUrl: string | RegExp,
        timeout: number = 10000
    ): Promise<void> {
        this.logInfo(`Sayfa yönlendirmesi bekleniyor: ${expectedUrl}`);

        try {
            await this.page.waitForURL(expectedUrl, { timeout });
            this.logSuccess(`Sayfa başarıyla yönlendirildi ✔`);
            this.logInfo(`Mevcut URL: ${this.page.url()}`);

        } catch (error: any) {
            this.logError(`Sayfa yönlendirmesi başarısız: ${error.message}`);
            throw error;
        }
    }

    /**
     * Login işlemi
     */
    async login(
        email: string,
        password: string,
        expectedUrl: string = '/panel'
    ): Promise<void> {
        this.logInfo(`Login işlemi başlatılıyor: ${email}`);

        try {
            await this.page.goto('https://qa.instulearn.com/');
            this.logSuccess('Ana sayfa açıldı ✔');

            await this.page.getByRole('link', { name: 'Login' }).click();
            this.logSuccess('Login sayfasına gidildi ✔');

            await this.page.getByRole('textbox', { name: 'Email:' }).fill(email);
            this.logInfo('Email girildi');

            await this.page.getByRole('textbox', { name: 'Password:' }).fill(password);
            this.logInfo('Password girildi');

            await Promise.all([
                this.page.waitForURL(new RegExp(expectedUrl), { timeout: 10000 }),
                this.page.getByRole('button', { name: 'Login' }).click()
            ]);

            this.logSuccess(`Login başarılı! Yönlendirildi: ${this.page.url()}`);

        } catch (error: any) {
            this.logError(`Login başarısız: ${error.message}`);
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            await this.page.screenshot({
                path: `screenshots/login-fail-${timestamp}.png`,
                fullPage: true
            });
            throw error;
        }
    }
}