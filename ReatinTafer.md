# 🚀 INSTULEARN UI TEST OTOMASYON PROJESİ (Playwright)

> *"Quality at the Speed of Light"* ⚡

**🌐 Test Ortamı:** [https://qa.instulearn.com/](https://qa.instulearn.com/)

---

## 📖 Proje Hakkında

Bu proje, **Instulearn** platformunun kalitesini garanti altına almak için geliştirilmiş, **Playwright** tabanlı modern bir **UI Test Otomasyon Framework'üdür**.

- **Teknoloji Stack'i:** Playwright + TypeScript
- **Yaklaşım:** BDD (Cucumber) entegrasyonu ile geliştirilebilir
- **Mimari:** Page Object Model (POM) + Reusable Methods

---

## 🎯 Hedefler

| Hedef | Açıklama |
| :--- | :--- |
| ✅ **Hız ve Performans** | Paralel test çalıştırma ile hızlı geri bildirim |
| ✅ **Çoklu Tarayıcı** | Chromium, Firefox, WebKit (Safari) desteği |
| ✅ **Gelişmiş Raporlama** | Allure / HTML raporları ile detaylı analiz |
| ✅ **Tip Güvenliği** | TypeScript ile daha sağlam ve hatasız kod |
| ✅ **CI/CD Entegrasyonu** | GitHub Actions ile otomatik test süreçleri |
| ✅ **Modülerlik** | Bakımı kolay, tekrar kullanılabilir kod yapısı |

---

## 🛠️ Teknolojiler ve Araçlar

### 🏗️ Temel Yapı
- **TypeScript:** Tip güvenli JavaScript
- **Playwright:** Modern end-to-end test framework
- **Node.js:** Runtime ortamı

### 📊 Raporlama & Loglama
- **Allure Reports:** Gelişmiş görsel raporlar
- **Playwright HTML Report:** Hızlı ve detaylı raporlama
- **Trace Viewer:** Test adımlarını izleme

### 🧪 Yardımcı Araçlar
- **dotenv:** Çevresel değişken yönetimi
- **Cucumber (opsiyonel):** BDD tabanlı test senaryoları
- **Page Object Model:** Sayfa organizasyonu

---

## 📁 Proje Yapısı

```text
js-ui-project_basic/
├── src/                       # (opsiyonel) Kaynak kodlar
├── pages/                     # Page Object Model sınıfları
│   ├── LoginPage.ts
│   ├── HomePage.ts
│   └── PanelPage.ts
├── tests/                     # Playwright test dosyaları
│   ├── login.spec.ts
│   └── homepage.spec.ts
├── utils/                     # Reusable Methods ve yardımcılar
│   ├── ReusableMethods.ts
│   ├── helpers.ts
│   └── dataGenerator.ts
├── fixtures/                  # (opsiyonel) Custom fixtures
│   └── customFixtures.ts
├── playwright-report/         # Test raporları
├── test-results/              # Test sonuçları
├── screenshots/               # Hata durumu ekran görüntüleri
├── allure-results/            # Allure rapor çıktıları
├── .env                       # Çevresel değişkenler (gitignore)
├── .gitignore
├── package.json
├── playwright.config.ts       # Playwright konfigürasyonu
├── tsconfig.json              # TypeScript konfigürasyonu
└── README.md                  # Proje dokümantasyonu
🚀 Başlangıç
Projeyi Klonlayın:

bash
git clone [repository-url]
cd js-ui-project_basic
Bağımlılıkları Yükleyin:

bash
npm install
Playwright Tarayıcılarını Yükleyin:

bash
npx playwright install
Çevresel Değişkenleri Ayarlayın:
.env dosyası oluşturun ve gerekli bilgileri ekleyin:

env
BASE_URL=https://qa.instulearn.com/
TEST_USERNAME=your-email@instuLearn.com
TEST_PASSWORD=your-password
🧪 Testleri Çalıştırma
Komut	Açıklama
npm test	Tüm testleri çalıştır
npm run test:headed	Tarayıcı açık (görünür) modda çalıştır
npm run test:debug	Debug modunda çalıştır
npm run test:chromium	Sadece Chromium'da çalıştır
npm run test:single tests/login.spec.ts	Tek bir test dosyasını çalıştır
📊 Raporları Görüntüleme
bash
# Playwright HTML Raporu
npx playwright show-report

# Allure Raporu
npx allure generate allure-results --clean
npx allure open
📝 Örnek Kullanım
Test Dosyası (.spec.ts)
typescript
// tests/login.spec.ts
import { test, expect } from '@playwright/test';
import { ReusableMethods } from '../utils/ReusableMethods';
import { LoginPage } from '../pages/LoginPage';

test('Başarılı giriş testi', async ({ page }) => {
    const methods = new ReusableMethods(page);
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.login('test@instuLearn.com', 'Test.123!');

    await methods.verifyUrl('/panel');
    await expect(page).toHaveURL(/.*panel/);
});
Page Object Model (.ts)
typescript
// pages/LoginPage.ts
import { Page, Locator } from '@playwright/test';

export class LoginPage {
    readonly page: Page;
    readonly emailInput: Locator;
    readonly passwordInput: Locator;
    readonly loginButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.emailInput = page.getByRole('textbox', { name: 'Email:' });
        this.passwordInput = page.getByRole('textbox', { name: 'Password:' });
        this.loginButton = page.getByRole('button', { name: 'Login' });
    }

    async goto() {
        await this.page.goto('https://qa.instulearn.com/');
        await this.page.getByRole('link', { name: 'Login' }).click();
    }

    async login(email: string, password: string) {
        await this.emailInput.fill(email);
        await this.passwordInput.fill(password);
        await this.loginButton.click();
    }
}
Reusable Methods (.ts)
typescript
// utils/ReusableMethods.ts
import { Page, Locator, expect } from '@playwright/test';

export class ReusableMethods {
    constructor(private page: Page) {}

    async verifyButton(selector: string | Locator) {
        const button = typeof selector === 'string'
            ? this.page.locator(selector)
            : selector;
        await expect(button).toBeVisible();
        await expect(button).toBeEnabled();
    }

    async verifyUrl(expectedUrlPart: string | RegExp) {
        const regex = typeof expectedUrlPart === 'string'
            ? new RegExp(expectedUrlPart)
            : expectedUrlPart;
        await expect(this.page).toHaveURL(regex);
    }
}
🔧 Playwright Konfigürasyonu
typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
    testDir: './tests',
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    workers: process.env.CI ? 1 : undefined,
    reporter: [
        ['html'],
        ['allure-playwright']
    ],
    use: {
        baseURL: 'https://qa.instulearn.com/',
        trace: 'on-first-retry',
        screenshot: 'only-on-failure',
        video: 'retain-on-failure',
    },
    projects: [
        {
            name: 'chromium',
            use: { ...devices['Desktop Chrome'] },
        },
        // {
        //   name: 'firefox',
        //   use: { ...devices['Desktop Firefox'] },
        // },
        // {
        //   name: 'webkit',
        //   use: { ...devices['Desktop Safari'] },
        // },
    ],
});
📊 Raporlama
Test sonuçlarını görüntülemek için:

Rapor Türü	Komut
Playwright HTML	npx playwright show-report
Allure	npx allure open
Trace Viewer	npx playwright show-trace trace.zip
🤝 Takım İçi Kurallar
Branch Stratejisi: main (kararlı) → develop (geliştirme) → feature/gorev-adi

Commit Mesajları: feat:, fix:, docs:, test: prefixleri kullanılmalıdır.

Code Review: Her Pull Request en az bir ekip üyesi tarafından incelenmelidir.

TypeScript: Tüm yeni dosyalar .ts uzantısıyla oluşturulmalıdır.

📞 İletişim & Linkler
QA Environment: qa.instulearn.com

Playwright Dokümantasyonu: playwright.dev

Issues: Hataları bildirmek için GitHub Issues sekmesini kullanın.

📜 Lisans
Bu proje Instulearn Team 167 tarafından geliştirilmektedir. Tüm hakları saklıdır.

⭐ Başarılı testler dileriz!

text

---

## 🎯 Özet: Yapılan Değişiklikler

| Eski (Java + Selenium) | Yeni (TypeScript + Playwright) |
|------------------------|--------------------------------|
| Java, Maven, Selenium | TypeScript, Node.js, Playwright |
| TestNG / JUnit | Playwright Test Runner |
| Cucumber Feature Dosyaları | Playwright Test Dosyaları (.spec.ts) |
| Extent / Allure | Allure / Playwright HTML |
| WebDriver Manager | `npx playwright install` |
| `.properties` | `.env` |
| `pom.xml` | `package.json` |

---
