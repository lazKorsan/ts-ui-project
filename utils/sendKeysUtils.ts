import { Page, Locator } from '@playwright/test';

// ============================================
// CONFIGURATION
// ============================================
const CONFIG = {
    DEFAULT_TIMEOUT: 30000,
    SHORT_TIMEOUT: 5000,
    HIGHLIGHT_DURATION: 300,
    CHAR_DELAY: 50,
    SCROLL_ATTEMPTS: 10,
    SCROLL_AMOUNT: 300,
    WAIT_AFTER_SEND: 300,
};

// ============================================
// ANA CLASS
// ============================================
export class SendKeysUtils {
    private page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    // ============================================
    // ANA METHODLAR (KULLANICIYA ÖZEL)
    // ============================================

    /**
     * ⌨️ Elemente text gönderir (EN ÇOK KULLANILACAK METHOD)
     * @param selector - CSS selector, text, xpath, id hepsi olabilir
     * @param text - Gönderilecek metin
     * @param options - Opsiyonel ayarlar
     */
    async sendKeys(selector: string, text: string, options?: SendKeysOptions): Promise<boolean> {
        const opts = { ...this.getDefaultOptions(), ...options };
        this.log(`🔍 Elemente text gönderilmeye hazırlanıyor: "${selector}"`);

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

            // 6. Input alanını temizle
            if (opts.clearBefore) {
                await this.clearFieldWithFallback(element);
            }

            // 7. Text gönderme işlemini dene (8 aşamalı)
            const sent = await this.performSendKeysWithFallback(element, text, opts);

            // 8. Highlight'ı kaldır
            if (opts.highlight) {
                await this.unhighlightElement(element);
            }

            if (sent) {
                this.log(`✅ TEXT GÖNDERİLDİ - '${text}'`);
                await this.page.waitForTimeout(opts.waitAfterSend || CONFIG.WAIT_AFTER_SEND);

                // 9. Doğrulama
                if (opts.verify) {
                    await this.verifyTextEntered(element, text);
                }
                return true;
            } else {
                this.log(`❌ TEXT GÖNDERİLEMEDİ - '${text}'`);
                return false;
            }

        } catch (error: any) {
            this.log(`❌ HATA: ${error.message}`);
            return false;
        }
    }

    /**
     * ⌨️ By/Locator ile text gönderir
     */
    async sendKeysOnLocator(locator: Locator, text: string, options?: SendKeysOptions): Promise<boolean> {
        const opts = { ...this.getDefaultOptions(), ...options };

        try {
            await this.waitForElement(locator, opts);
            await this.smartScroll(locator, opts);
            await this.smartHover(locator, opts);

            if (opts.highlight) {
                await this.highlightElement(locator);
            }

            if (opts.clearBefore) {
                await this.clearFieldWithFallback(locator);
            }

            const sent = await this.performSendKeysWithFallback(locator, text, opts);

            if (opts.highlight) {
                await this.unhighlightElement(locator);
            }

            if (sent) {
                this.log(`✅ TEXT GÖNDERİLDİ - '${text}'`);
                if (opts.verify) {
                    await this.verifyTextEntered(locator, text);
                }
                return true;
            }
            return false;
        } catch (error: any) {
            this.log(`❌ HATA: ${error.message}`);
            return false;
        }
    }

    /**
     * ⌨️ XPath ile text gönderir
     */
    async sendByXpath(xpath: string, text: string, options?: SendKeysOptions): Promise<boolean> {
        this.log(`📌 XPath ile text gönderiliyor: ${xpath}`);
        return this.sendKeys(`xpath=${xpath}`, text, options);
    }

    /**
     * ⌨️ Label veya placeholder metnine göre input alanını bulur ve text gönderir
     */
    async sendKeysByText(boxName: string, text: string, options?: SendKeysOptions): Promise<boolean> {
        this.log(`⌨️ '${boxName}' isimli kutuya metin gönderiliyor: ${text}`);

        // Önce label ile dene
        const labelSelector = `label:has-text("${boxName}")`;
        const label = this.page.locator(labelSelector);

        if (await label.count() > 0) {
            // Label'in ilişkili olduğu input'u bul
            const forAttr = await label.getAttribute('for');
            if (forAttr) {
                return this.sendKeys(`#${forAttr}`, text, options);
            }

            // Label'in yanındaki input'u bul
            const inputSelector = `label:has-text("${boxName}") >> xpath=following-sibling::input`;
            return this.sendKeys(inputSelector, text, options);
        }

        // Placeholder ile dene
        const placeholderSelector = `input[placeholder="${boxName}"]`;
        if (await this.page.locator(placeholderSelector).count() > 0) {
            return this.sendKeys(placeholderSelector, text, options);
        }

        // Name ile dene
        const nameSelector = `input[name="${boxName}"]`;
        if (await this.page.locator(nameSelector).count() > 0) {
            return this.sendKeys(nameSelector, text, options);
        }

        this.log(`❌ '${boxName}' isimli input bulunamadı`);
        return false;
    }

    /**
     * ⌨️ Input alanına text ekler (temizlemeden)
     */
    async appendToElement(selector: string, text: string, options?: SendKeysOptions): Promise<boolean> {
        const opts = { ...this.getDefaultOptions(), ...options, clearBefore: false };
        this.log(`➕ Text ekleniyor: '${text}'`);
        return this.sendKeys(selector, text, opts);
    }

    // ============================================
    // TEMİZLEME METHODLARI
    // ============================================

    /**
     * 🧹 Input alanını temizle (4 aşamalı)
     */
    async clearField(selector: string): Promise<boolean> {
        this.log(`🧹 Input alanı temizleniyor: "${selector}"`);

        try {
            const element = this.page.locator(selector);
            const result = await this.clearFieldWithFallback(element);
            if (result) {
                this.log(`✅ Input alanı temizlendi`);
            } else {
                this.log(`❌ Input alanı temizlenemedi`);
            }
            return result;
        } catch (error: any) {
            this.log(`❌ HATA: ${error.message}`);
            return false;
        }
    }

    /**
     * 🧹 Input alanını temizle (Locator ile)
     */
    async clearFieldOnLocator(locator: Locator): Promise<boolean> {
        return this.clearFieldWithFallback(locator);
    }

    // ============================================
    // SMART SCROLL METHODLARI
    // ============================================

    /**
     * 📜 Akıllı Scroll - Element görünürdeyse scroll yapmaz
     */
    private async smartScroll(locator: Locator, options: SendKeysOptions): Promise<void> {
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

    // ============================================
    // SMART HOVER METHODLARI
    // ============================================

    /**
     * 🖱️ Akıllı Hover - Element üzerine gel
     */
    private async smartHover(locator: Locator, options: SendKeysOptions): Promise<void> {
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
    // TEMİZLEME METHODLARI (4 AŞAMALI)
    // ============================================

    private async clearFieldWithFallback(locator: Locator): Promise<boolean> {
        this.log(`   🧹 Input alanı temizleniyor...`);
        const selector = await this.getSelectorFromLocator(locator);

        // METHOD 1: Normal clear
        try {
            await locator.clear();
            this.log(`   ✓ Normal clear başarılı`);
            return true;
        } catch (error: any) {
            this.log(`   ✗ Normal clear başarısız: ${error.message}`);
        }

        // METHOD 2: CTRL+A + DELETE
        try {
            await locator.press('Control+a');
            await locator.press('Delete');
            this.log(`   ✓ CTRL+A + DELETE ile temizleme başarılı`);
            return true;
        } catch (error: any) {
            this.log(`   ✗ CTRL+A + DELETE başarısız: ${error.message}`);
        }

        // METHOD 3: JavaScript ile temizleme
        try {
            await this.page.evaluate((sel) => {
                const el = document.querySelector(sel) as HTMLInputElement;
                if (el) {
                    el.value = '';
                    el.dispatchEvent(new Event('input', { bubbles: true }));
                    el.dispatchEvent(new Event('change', { bubbles: true }));
                }
            }, selector);
            this.log(`   ✓ JavaScript ile temizleme başarılı`);
            return true;
        } catch (error: any) {
            this.log(`   ✗ JavaScript temizleme başarısız: ${error.message}`);
        }

        // METHOD 4: Backspace ile temizleme
        try {
            const value = await locator.inputValue();
            if (value && value.length > 0) {
                for (let i = 0; i < value.length; i++) {
                    await locator.press('Backspace');
                }
                this.log(`   ✓ Backspace ile temizleme başarılı`);
                return true;
            }
        } catch (error: any) {
            this.log(`   ✗ Backspace temizleme başarısız: ${error.message}`);
        }

        return false;
    }

    // ============================================
    // TEXT GÖNDERME METHODLARI (8 AŞAMALI)
    // ============================================

    private async performSendKeysWithFallback(
        locator: Locator,
        text: string,
        options: SendKeysOptions
    ): Promise<boolean> {
        const selector = await this.getSelectorFromLocator(locator);

        const methods = [
            {
                name: 'Normal sendKeys',
                fn: () => locator.fill(text, { timeout: options.timeout })
            },
            {
                name: 'Type (char by char)',
                fn: () => locator.type(text, { delay: options.charDelay || CONFIG.CHAR_DELAY })
            },
            {
                name: 'Press Sequentially',
                fn: async () => {
                    for (const char of text) {
                        await locator.press(char);
                    }
                    return true;
                }
            },
            {
                name: 'JavaScript value atama',
                fn: () => this.page.evaluate(([sel, value]) => {
                    const el = document.querySelector(sel) as HTMLInputElement;
                    if (el) {
                        el.value = value;
                        el.dispatchEvent(new Event('input', { bubbles: true }));
                        el.dispatchEvent(new Event('change', { bubbles: true }));
                        return true;
                    }
                    return false;
                }, [selector, text])
            },
            {
                name: 'Click + fill',
                fn: async () => {
                    await locator.click({ force: true });
                    await this.page.waitForTimeout(200);
                    return locator.fill(text);
                }
            },
            {
                name: 'Focus + fill',
                fn: async () => {
                    await locator.focus();
                    await this.page.waitForTimeout(200);
                    return locator.fill(text);
                }
            },
            {
                name: 'Scroll + fill',
                fn: async () => {
                    await locator.scrollIntoViewIfNeeded();
                    await this.page.waitForTimeout(300);
                    return locator.fill(text);
                }
            },
            {
                name: 'Paste ile yapıştırma',
                fn: async () => {
                    await this.page.evaluate(([sel, value]) => {
                        const el = document.querySelector(sel) as HTMLInputElement;
                        if (el) {
                            el.focus();
                            el.value = value;
                            el.dispatchEvent(new Event('input', { bubbles: true }));
                            el.dispatchEvent(new Event('change', { bubbles: true }));
                        }
                    }, [selector, text]);
                    await locator.press('Control+V');
                    return true;
                }
            }
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
    // DOĞRULAMA METHODLARI
    // ============================================

    /**
     * ✅ Text'in gerçekten elemente yazıldığını doğrular
     */
    async verifyTextEntered(locator: Locator, expectedText: string): Promise<boolean> {
        try {
            const actualText = await this.getElementValue(locator);

            if (expectedText === actualText) {
                this.log(`   ✓ Text doğrulaması başarılı: '${actualText}'`);
                return true;
            } else {
                this.log(`   ⚠️ Text doğrulaması: Beklenen='${expectedText}', Gerçekleşen='${actualText}'`);
                return false;
            }
        } catch (error: any) {
            this.log(`   ⚠️ Text doğrulaması yapılamadı: ${error.message}`);
            return false;
        }
    }

    /**
     * 📝 Elementin değerini alır
     */
    async getElementValue(locator: Locator): Promise<string> {
        try {
            const selector = await this.getSelectorFromLocator(locator);
            // Önce inputValue dene
            let value = await locator.inputValue().catch(() => '');

            if (!value) {
                // Text content dene
                value = await locator.textContent().catch(() => '') || '';
            }

            if (!value) {
                // JavaScript ile dene
                value = await this.page.evaluate((sel) => {
                    const el = document.querySelector(sel) as HTMLInputElement;
                    return el ? el.value || el.textContent || '' : '';
                }, selector);
            }

            return value || '';
        } catch (error: any) {
            return '';
        }
    }

    /**
     * 📝 Elementin değerini alır (selector ile)
     */
    async getElementValueBySelector(selector: string): Promise<string> {
        return this.getElementValue(this.page.locator(selector));
    }

    // ============================================
    // HIGHLIGHT METHODLARI
    // ============================================

    private async highlightElement(locator: Locator): Promise<void> {
        try {
            const selector = await this.getSelectorFromLocator(locator);
            await this.page.evaluate((sel) => {
                const el = document.querySelector(sel);
                if (el) {
                    const originalStyle = el.getAttribute('style');

                    // Input alanı için farklı renk
                    const tagName = el.tagName.toLowerCase();
                    const highlightColor = tagName === 'input' || tagName === 'textarea'
                        ? 'border: 3px solid #4A90D9 !important; background-color: #D6EAF8 !important; box-shadow: 0 0 15px rgba(74, 144, 217, 0.5) !important; transition: all 0.2s !important;'
                        : 'border: 3px solid #F39C12 !important; background-color: #FDEBD0 !important; box-shadow: 0 0 15px rgba(243, 156, 18, 0.5) !important; transition: all 0.2s !important;';

                    el.setAttribute('style', highlightColor);
                    // @ts-ignore
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
                const el = document.querySelector(sel);
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
    // KEYBOARD METHODLARI
    // ============================================

    /**
     * ⏎ Enter tuşuna basar
     */
    async pressEnter(selector: string): Promise<void> {
        try {
            await this.page.locator(selector).press('Enter');
            this.log(`⏎ ENTER tuşuna basıldı: "${selector}"`);
        } catch (error: any) {
            this.log(`❌ ENTER basılamadı: ${error.message}`);
        }
    }

    /**
     * ⇆ Tab tuşuna basar
     */
    async pressTab(selector: string): Promise<void> {
        try {
            await this.page.locator(selector).press('Tab');
            this.log(`⇆ TAB tuşuna basıldı: "${selector}"`);
        } catch (error: any) {
            this.log(`❌ TAB basılamadı: ${error.message}`);
        }
    }

    /**
     * ⬇️ Arrow Down tuşuna basar
     */
    async pressArrowDown(selector: string): Promise<void> {
        try {
            await this.page.locator(selector).press('ArrowDown');
            this.log(`⬇️ ARROW_DOWN tuşuna basıldı: "${selector}"`);
        } catch (error: any) {
            this.log(`❌ ARROW_DOWN basılamadı: ${error.message}`);
        }
    }

    /**
     * ⬆️ Arrow Up tuşuna basar
     */
    async pressArrowUp(selector: string): Promise<void> {
        try {
            await this.page.locator(selector).press('ArrowUp');
            this.log(`⬆️ ARROW_UP tuşuna basıldı: "${selector}"`);
        } catch (error: any) {
            this.log(`❌ ARROW_UP basılamadı: ${error.message}`);
        }
    }

    /**
     * ⎋ Escape tuşuna basar
     */
    async pressEscape(selector: string): Promise<void> {
        try {
            await this.page.locator(selector).press('Escape');
            this.log(`⎋ ESCAPE tuşuna basıldı: "${selector}"`);
        } catch (error: any) {
            this.log(`❌ ESCAPE basılamadı: ${error.message}`);
        }
    }

    // ============================================
    // WAIT METHODLARI
    // ============================================

    private async waitForElement(locator: Locator, options: SendKeysOptions): Promise<void> {
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

    private getDefaultOptions(): SendKeysOptions {
        return {
            timeout: CONFIG.DEFAULT_TIMEOUT,
            highlight: true,
            clearBefore: true,
            skipScroll: false,
            skipHover: false,
            verify: true,
            waitAfterSend: CONFIG.WAIT_AFTER_SEND,
            charDelay: CONFIG.CHAR_DELAY,
        };
    }

    private async getSelectorFromLocator(locator: Locator): Promise<string> {
        try {
            const str = locator.toString();
            const match = str.match(/"([^"]+)"/);
            return match ? match[1] : 'body';
        } catch {
            return 'body';
        }
    }

    private log(message: string): void {
        console.log(`[SendKeysUtils] ${message}`);
    }
}

// ============================================
// TYPES
// ============================================
export interface SendKeysOptions {
    timeout?: number;
    highlight?: boolean;
    clearBefore?: boolean;
    skipScroll?: boolean;
    skipHover?: boolean;
    verify?: boolean;
    waitAfterSend?: number;
    charDelay?: number;
}

// ============================================
// HOOKS - Kolay kullanım için
// ============================================
export async function createSendKeysUtils(page: Page): Promise<SendKeysUtils> {
    return new SendKeysUtils(page);
}