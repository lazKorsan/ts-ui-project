import {BasePage} from "./BasePage";
import {Locator, Page} from "@playwright/test";

export class StudentPage extends BasePage {
    private elementMap: Record<string, Locator>;

    constructor(page: Page) {
        super(page);

        // Tek yer: Map. Field'lar yok!
        this.elementMap = {
            'login': page.getByRole('link', {name: 'Login'}),
            'register': page.locator('a[href="/register"]'),
            'email': page.getByRole('textbox', {name: 'Email:'}),
            'password': page.getByRole('textbox', {name: 'Password:'}),
            'login submit': page.getByRole('button', {name: 'Login'})

        };
    }

    getElementByName(elementName: string): Locator {
        if (!elementName || !elementName.trim()) {
            throw new Error(`[HATA] Element adı boş olamaz! Geçerli değerler: ${Object.keys(this.elementMap).join(', ')}`);
        }

        const key = elementName.trim().replace(/:+$/, '').toLowerCase();
        const locator = this.elementMap[key];

        if (!locator) {
            throw new Error(
                `[HATA] '${elementName}' StudentPaage içinde bulunamadı! ` +
                `Geçerli değerler: ${Object.keys(this.elementMap).join(', ')}`
            );
        }
        return locator;
    }

    async loginWithMethod(mail: string, password: string) {


        await this.getElementByName('login').click();

        await this.getElementByName('email').fill(mail);

        await this.getElementByName('password').fill(password);

        await this.getElementByName('login submit').click();



    }
























}


