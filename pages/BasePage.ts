import {Locator, Page} from '@playwright/test';

export class BasePage {
    protected page: Page;

    constructor(page: Page) {
        this.page = page;
    }





    async maximizeWindow() {
        const screenSize = await this.page.evaluate(() => {
            return {
                width: window.screen.availWidth,
                height: window.screen.availHeight,
            };
        });

        await this.page.setViewportSize(screenSize);
    }

    // ID (#), Class (.), CSS veya XPath (//) kabul eden temel locator üretici
    getElement(selector: string): Locator  | undefined {
        return this.page.locator(selector);
    }

    // Sayfaya gitme
    async navigateTo(url: string): Promise<void> {
        await this.page.goto(url);
    }

    // Sekme başlığını (Title) alma
    async getTitle(): Promise<string> {
        return await this.page.title();
    }

    // Mevcut URL'i alma
    async getUrl(): Promise<string> {
        return this.page.url();
    }

    // Highlight ve Log destekli Click Utility
    async clickElement(selectorOrLocator: string | Locator, elementName?: string): Promise<void> {
        const locator = typeof selectorOrLocator === 'string' ? this.getElement(selectorOrLocator) : selectorOrLocator;

        await locator.highlight();
        await locator.click();

        if (elementName) {
            console.log(`[ACTION] ${elementName} elemanına tıklandı.`);
        }
    }

    // Highlight, Clear ve Write destekli SendKeys Utility
    async sendKeys(selectorOrLocator: string | Locator, text: string, elementName?: string): Promise<void> {
        const locator = typeof selectorOrLocator === 'string' ? this.getElement(selectorOrLocator) : selectorOrLocator;

        await locator.highlight();
        await locator.fill(text);

        if (elementName) {
            console.log(`[ACTION] ${elementName} alanına '${text}' yazıldı.`);
        }
    }

    // Zorlu ve overlay arkasında kalan elementler için Force Click
    async forceClick(selectorOrLocator: string | Locator): Promise<void> {
        const locator = typeof selectorOrLocator === 'string' ? this.getElement(selectorOrLocator) : selectorOrLocator;
        await locator.click({ force: true });
    }


}