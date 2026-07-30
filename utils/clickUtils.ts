import { Page, Locator } from '@playwright/test';

// ============================================
// CONFIGURATION
// ============================================
const CONFIG = {
    DEFAULT_TIMEOUT: 30000,
    SHORT_TIMEOUT: 5000,
    HIGHLIGHT_DURATION: 200,
    SCROLL_ATTEMPTS: 10,
    SCROLL_AMOUNT: 300,
    WAIT_AFTER_CLICK: 300,
};

// ============================================
// ANA CLASS
// ============================================
export class ClickUtils {
    private page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    // ============================================
    // ANA METHODLAR (KULLANICIYA ÖZEL)
    // ============================================

    /**
     * 🎯 En çok kullanılacak method - Her türlü elemente tıklar
     * @param selector - CSS selector, text, xpath, id hepsi olabilir
     * @param options - Opsiyonel ayarlar
     */
    async click(selector: string, options?: ClickOptions): Promise<boolean> {
        const opts = { ...this.getDefaultOptions(), ...options };
        this.log(`🔍 Element tıklanmaya hazırlanıyor: "${selector}"`);

        try {
            // 1. Elementi bul
            const element = this.page.locator(selector);

            // 2. Görünür olmasını bekle
            await this.waitForElement(element, opts);

            // 3. Smart Scroll
            await this.smartScroll(element, opts);

            // 4. Smart Hover
            await this.smartHover(element, opts);

            // 5. Highlight
            if (opts.highlight) {
                await this.highlightElement(element);
            }

            // 6. 8 Aşamalı Tıklama
            const clicked = await this.performClickWithFallback(element, opts);

            // 7. Highlight'ı kaldır
            if (opts.highlight) {
                await this.unhighlightElement(element);
            }

            if (clicked) {
                this.log(`✅ ELEMENT TIKLANDI: "${selector}"`);
                await this.page.waitForTimeout(opts.waitAfterClick || CONFIG.WAIT_AFTER_CLICK);
                return true;
            } else {
                this.log(`❌ TIKLAMA BAŞARISIZ: "${selector}"`);
                return false;
            }

        } catch (error: any) {
            this.log(`❌ HATA: ${error.message}`);
            return false;
        }
    }

    /**
     * 📝 Metin içeriğine göre tıkla (tam eşleşme)
     */
    async clickByText(text: string, options?: ClickOptions): Promise<boolean> {
        this.log(`🏷️ Metin ile element aranıyor: "${text}"`);
        return this.click(`text="${text}"`, options);
    }

    /**
     * 📝 Metin içeriğine göre tıkla (kısmi eşleşme)
     */
    async clickByPartialText(text: string, options?: ClickOptions): Promise<boolean> {
        this.log(`🏷️ Parçalı metin ile element aranıyor: "${text}"`);
        return this.click(`text=/.*${text}.*/`, options);
    }

    /**
     * 🆔 ID'ye göre tıkla
     */
    async clickById(id: string, options?: ClickOptions): Promise<boolean> {
        this.log(`🆔 ID ile element aranıyor: #${id}`);
        return this.click(`#${id}`, options);
    }

    /**
     * 🔘 Role'e göre tıkla (button, link, radio, checkbox vb.)
     */
    async clickByRole(role: string, name?: string, options?: ClickOptions): Promise<boolean> {
        this.log(`🎯 Role ile element aranıyor: ${role}${name ? ` (${name})` : ''}`);
        const locator = name
            ? this.page.getByRole(role as any, { name })
            : this.page.getByRole(role as any);

        const opts = { ...this.getDefaultOptions(), ...options };
        return this.clickOnLocator(locator, opts);
    }

    /**
     * 🎯 Playwright Locator ile tıkla
     */
    async clickOnLocator(locator: Locator, options?: ClickOptions): Promise<boolean> {
        const opts = { ...this.getDefaultOptions(), ...options };

        try {
            await this.waitForElement(locator, opts);
            await this.smartScroll(locator, opts);
            await this.smartHover(locator, opts);

            if (opts.highlight) {
                await this.highlightElement(locator);
            }

            const clicked = await this.performClickWithFallback(locator, opts);

            if (opts.highlight) {
                await this.unhighlightElement(locator);
            }

            if (clicked) {
                this.log(`✅ LOCATOR TIKLANDI`);
                await this.page.waitForTimeout(opts.waitAfterClick || CONFIG.WAIT_AFTER_CLICK);
                return true;
            }
            return false;
        } catch (error: any) {
            this.log(`❌ HATA: ${error.message}`);
            return false;
        }
    }

    // ============================================
    // CHECKBOX / RADIO ÖZEL METHODLAR
    // ============================================

    /**
     * ☑️ Checkbox'ı işaretle (JavaScript ile zorla)
     */
    async checkCheckbox(selector: string): Promise<boolean> {
        this.log(`☑️ Checkbox işaretleniyor: "${selector}"`);

        try {
            const result = await this.page.evaluate((sel) => {
                // 1. Label ile dene
                const labels = document.querySelectorAll('label');
                for (const label of Array.from(labels)) {
                    if (label.textContent?.includes(sel) || label.textContent?.includes(sel.replace(/^#/, ''))) {
                        label.click();
                        label.dispatchEvent(new Event('change', { bubbles: true }));
                        return true;
                    }
                }

                // 2. Input ile dene
                const inputs = document.querySelectorAll('input[type="checkbox"], input[type="radio"]');
                for (const input of Array.from(inputs)) {
                    if (input.id?.includes(sel) || input.id?.includes(sel.replace(/^#/, ''))) {
                        (input as HTMLInputElement).checked = true;
                        input.dispatchEvent(new Event('change', { bubbles: true }));
                        input.dispatchEvent(new Event('click', { bubbles: true }));
                        return true;
                    }
                }

                // 3. Selector ile dene
                const el = document.querySelector(sel) as HTMLElement;
                if (el) {
                    el.click();
                    el.dispatchEvent(new Event('change', { bubbles: true }));
                    return true;
                }

                return false;
            }, selector);

            if (result) {
                this.log(`✅ Checkbox işaretlendi: "${selector}"`);
                await this.page.waitForTimeout(CONFIG.WAIT_AFTER_CLICK);
                return true;
            } else {
                this.log(`❌ Checkbox bulunamadı: "${selector}"`);
                return false;
            }
        } catch (error: any) {
            this.log(`❌ HATA: ${error.message}`);
            return false;
        }
    }

    /**
     * ☑️ Checkbox'ı işaretten kaldır (uncheck)
     */
    async uncheckCheckbox(selector: string): Promise<boolean> {
        this.log(`☑️ Checkbox işaretten kaldırılıyor: "${selector}"`);

        try {
            const result = await this.page.evaluate((sel) => {
                const el = document.querySelector(sel) as HTMLInputElement;
                if (el && (el.type === 'checkbox' || el.type === 'radio')) {
                    el.checked = false;
                    el.dispatchEvent(new Event('change', { bubbles: true }));
                    return true;
                }
                return false;
            }, selector);

            if (result) {
                this.log(`✅ Checkbox işaretten kaldırıldı: "${selector}"`);
                return true;
            }
            return false;
        } catch (error: any) {
            this.log(`❌ HATA: ${error.message}`);
            return false;
        }
    }

    // ============================================
    // SMART SCROLL METHODLARI
    // ============================================

    /**
     * 📜 Akıllı Scroll - Element görünürdeyse scroll yapmaz
     */
    async smartScroll(locator: Locator, options: ClickOptions): Promise<void> {
        if (options.skipScroll) return;

        try {
            const isVisible = await locator.isVisible();
            if (isVisible) {
                this.log(`   ✓ Element zaten görünür, scroll yapılmadı`);
                return;
            }

            this.log(`   📜 Element görünür değil, smart scroll yapılıyor...`);
            await locator.scrollIntoViewIfNeeded();
            await this.page.waitForTimeout(300);

            // Hala görünür değilse alternatif dene
            const stillNotVisible = !(await locator.isVisible());
            if (stillNotVisible) {
                await this.tryAlternativeScroll(locator);
            }

        } catch (error: any) {
            this.log(`   ⚠️ Smart scroll başarısız: ${error.message}`);
            await this.tryAlternativeScroll(locator);
        }
    }

    private async tryAlternativeScroll(locator: Locator): Promise<void> {
        try {
            const selector = await this.getSelectorFromLocator(locator);
            await this.page.evaluate((sel) => {
                const el = document.querySelector(sel);
                if (el) {
                    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }, selector);
            await this.page.waitForTimeout(500);
            this.log(`   ✓ Alternatif scroll başarılı`);
        } catch (error: any) {
            this.log(`   ✗ Alternatif scroll başarısız: ${error.message}`);
        }
    }

    /**
     * 📜 Kademeli scroll - Sayfa sonuna kadar git
     */
    async scrollUntilVisible(locator: Locator, maxAttempts: number = CONFIG.SCROLL_ATTEMPTS): Promise<boolean> {
        let attempts = 0;
        let isVisible = await locator.isVisible();

        while (!isVisible && attempts < maxAttempts) {
            await this.page.evaluate((amount) => {
                window.scrollBy(0, amount);
            }, CONFIG.SCROLL_AMOUNT);
            await this.page.waitForTimeout(500);
            isVisible = await locator.isVisible();
            attempts++;
            this.log(`   📜 Scroll deneme ${attempts}/${maxAttempts}`);
        }

        if (isVisible) {
            this.log(`   ✅ Element ${attempts} denemede bulundu`);
        } else {
            this.log(`   ❌ Element ${maxAttempts} denemede bulunamadı`);
        }
        return isVisible;
    }

    // ============================================
    // SMART HOVER METHODLARI
    // ============================================

    /**
     * 🖱️ Akıllı Hover - Element üzerine gel
     */
    async smartHover(locator: Locator, options: ClickOptions): Promise<void> {
        if (options.skipHover) return;

        try {
            this.log(`   🖱️ Element üzerine hover yapılıyor...`);
            await locator.hover();
            await this.page.waitForTimeout(300);
            this.log(`   ✓ Hover başarılı`);
        } catch (error: any) {
            this.log(`   ⚠️ Hover başarısız: ${error.message}`);
            await this.tryAlternativeHover(locator);
        }
    }

    private async tryAlternativeHover(locator: Locator): Promise<void> {
        try {
            const selector = await this.getSelectorFromLocator(locator);
            await this.page.evaluate((sel) => {
                const el = document.querySelector(sel);
                if (el) {
                    const event = new MouseEvent('mouseover', {
                        view: window,
                        bubbles: true,
                        cancelable: true
                    });
                    el.dispatchEvent(event);
                }
            }, selector);
            await this.page.waitForTimeout(300);
            this.log(`   ✓ JavaScript mouseover başarılı`);
        } catch (error: any) {
            this.log(`   ✗ Alternatif hover başarısız: ${error.message}`);
        }
    }

    // ============================================
    // 8 AŞAMALI TIKLAMA METHODLARI
    // ============================================

    private async performClickWithFallback(locator: Locator, options: ClickOptions): Promise<boolean> {
        const selector = await this.getSelectorFromLocator(locator);

        const methods = [
            { name: 'Normal Click', fn: () => locator.click({ timeout: options.timeout }) },
            { name: 'Force Click', fn: () => locator.click({ force: true, timeout: options.timeout }) },
            { name: 'Position Click', fn: () => locator.click({ position: { x: 5, y: 5 }, timeout: options.timeout }) },
            { name: 'JavaScript Click', fn: () => this.page.evaluate((sel) => {
                    const el = document.querySelector(sel) as HTMLElement;
                    if (el) {
                        el.click();
                        el.dispatchEvent(new Event('click', { bubbles: true }));
                        return true;
                    }
                    return false;
                }, selector) },
            { name: 'Dispatch Click', fn: () => this.page.evaluate((sel) => {
                    const el = document.querySelector(sel);
                    if (el) {
                        const event = new MouseEvent('click', { view: window, bubbles: true, cancelable: true });
                        el.dispatchEvent(event);
                        return true;
                    }
                    return false;
                }, selector) },
            { name: 'Check Click', fn: () => locator.check({ force: true, timeout: options.timeout }) },
            { name: 'Hover + Click', fn: async () => {
                    await locator.hover();
                    await this.page.waitForTimeout(200);
                    return locator.click({ timeout: options.timeout });
                }},
            { name: 'Keyboard Enter', fn: () => this.page.evaluate((sel) => {
                    const el = document.querySelector(sel) as HTMLElement;
                    if (el) {
                        const event = new KeyboardEvent('keydown', { key: 'Enter', bubbles: true });
                        el.dispatchEvent(event);
                        return true;
                    }
                    return false;
                }, selector) }
        ];

        for (const method of methods) {
            try {
                this.log(`   [${methods.indexOf(method) + 1}/${methods.length}] ${method.name} deneniyor...`);
                const result = await method.fn();
                if (result !== false) {
                    this.log(`   ✓ ${method.name} başarılı`);
                    return true;
                }
            } catch (error: any) {
                this.log(`   ✗ ${method.name} başarısız: ${error.message?.substring(0, 50)}`);
            }
        }

        return false;
    }

    // ============================================
    // HIGHLIGHT METHODLARI
    // ============================================

    private async highlightElement(locator: Locator): Promise<void> {
        try {
            const selector = await this.getSelectorFromLocator(locator);
            await this.page.evaluate((sel) => {
                const el = document.querySelector(sel) as HTMLElement;
                if (el) {
                    const originalStyle = el.getAttribute('style');
                    el.setAttribute('style',
                        'border: 3px solid #FF6B6B !important; ' +
                        'background-color: #FFE66D !important; ' +
                        'box-shadow: 0 0 20px rgba(255, 107, 107, 0.5) !important; ' +
                        'transition: all 0.2s !important;'
                    );
                    // @ts-ignore - Store original style for later
                    el._originalStyle = originalStyle;
                }
            }, selector);
            await this.page.waitForTimeout(CONFIG.HIGHLIGHT_DURATION);
        } catch (error: any) {
            // Silent fail
        }
    }

    private async unhighlightElement(locator: Locator): Promise<void> {
        try {
            const selector = await this.getSelectorFromLocator(locator);
            await this.page.evaluate((sel) => {
                const el = document.querySelector(sel) as HTMLElement;
                if (el) {
                    // @ts-ignore
                    const originalStyle = el._originalStyle;
                    if (originalStyle !== undefined) {
                        el.setAttribute('style', originalStyle);
                    } else {
                        el.removeAttribute('style');
                    }
                }
            }, selector);
        } catch (error: any) {
            // Silent fail
        }
    }

    // ============================================
    // WAIT METHODLARI
    // ============================================

    private async waitForElement(locator: Locator, options: ClickOptions): Promise<void> {
        try {
            await locator.waitFor({ state: 'visible', timeout: options.timeout });
            this.log(`   ✅ Element görünür hale geldi`);
        } catch (error: any) {
            this.log(`   ⚠️ Element görünür değil, force ile devam...`);
        }
    }

    /**
     * ⏳ Sayfanın tamamen yüklenmesini bekle
     */
    async waitForPageLoad(): Promise<void> {
        try {
            await this.page.waitForLoadState('networkidle', { timeout: CONFIG.DEFAULT_TIMEOUT });
            this.log(`📄 Sayfa tamamen yüklendi`);
        } catch (error: any) {
            this.log(`⚠️ Sayfa yüklenme beklemesi başarısız: ${error.message}`);
        }
    }

    // ============================================
    // YARDIMCI METHODLAR
    // ============================================

    private getDefaultOptions(): ClickOptions {
        return {
            timeout: CONFIG.DEFAULT_TIMEOUT,
            highlight: true,
            skipScroll: false,
            skipHover: false,
            waitAfterClick: CONFIG.WAIT_AFTER_CLICK,
        };
    }

    private async getSelectorFromLocator(locator: Locator): Promise<string> {
        // Locator'dan selector string'i çıkarmak için
        try {
            const str = locator.toString();
            const match = str.match(/"([^"]+)"/);
            return match ? match[1] : 'body';
        } catch {
            return 'body';
        }
    }

    private log(message: string): void {
        console.log(`[ClickUtils] ${message}`);
    }
}

// ============================================
// TYPES
// ============================================
export interface ClickOptions {
    timeout?: number;
    highlight?: boolean;
    skipScroll?: boolean;
    skipHover?: boolean;
    waitAfterClick?: number;
}

// ============================================
// HOOKS - Kolay kullanım için
// ============================================
export async function createClickUtils(page: Page): Promise<ClickUtils> {
    return new ClickUtils(page);
}