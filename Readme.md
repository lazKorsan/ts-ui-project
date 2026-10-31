# 🚀 INSTULEARN UI TEST OTOMASYON PROJESİ (Playwright)

> **Test Ortamı:** [https://qa.instulearn.com/](https://qa.instulearn.com/)

Bu doküman, **Instulearn UI Test Otomasyon Projesi**'nin sıfırdan kurulumu, bağımlılıkların yüklenmesi ve testlerin çalıştırılması süreçlerine odaklanmaktadır.

---

## 📋 Ön Gereksinimler

Proveyi çalıştırmadan önce sisteminizde aşağıdaki bileşenlerin yüklü olduğundan emin olun:

- **Node.js**: v18 veya üzeri ([Node.js İndir](https://nodejs.org/))
- **Git**: [Git İndir](https://git-scm.com/)

---

## ⚙️ Adım Adım Kurulum Rehberi

### 1. Projeyi Klonlayın
Öncelikle projeyi yerel bilgisayarınıza indirin ve proje dizinine geçin:

```bash
git clone <repository-url>
cd js-ui-project_basic
```

### 2. Bağımlılıkları ve Kütüphaneleri Yükleyin

Proje için gerekli olan `TypeScript`, `Playwright`, `dotenv` ve `Allure` kütüphanelerini aşağıdaki komutlarla yükleyin:

```bash
# Projedeki mevcut bağımlılıkları yüklemek için (package.json varsa):
npm install

# VEYA Bağımlılıkları tek tek yüklemek isterseniz:
# TypeScript ve Geliştirme Bağımlılıkları
npm install --save-dev typescript @types/node

# Playwright Test Framework
npm install --save-dev @playwright/test

# Çevresel Değişken Yönetimi (dotenv)
npm install dotenv --save

# Allure Raporlama Altyapısı
npm install --save-dev allure-playwright allure-commandline
```

### 3. Playwright Tarayıcılarını Yükleyin
Playwright'ın testleri çalıştırabilmesi için gerekli Chromium, Firefox ve WebKit tarayıcı motorlarını indirin:

```bash
npx playwright install
```

### 4. Çevresel Değişkenleri (.env) Yapılandırın
Proje kök dizininde `.env` adında bir dosya oluşturun ve test ortamı bilgilerinizi tanımlayın:

```env
BASE_URL=https://qa.instulearn.com/
TEST_USERNAME=your-email@instuLearn.com
TEST_PASSWORD=your-password
```

---

## 🧪 Testleri Çalıştırma

Test senaryolarınızı çalıştırmak için aşağıdaki komutları kullanabilirsiniz:

```bash
# Tüm testleri arka planda (headless) çalıştırır
npx playwright test

# Testleri tarayıcı arayüzü açık şekilde (headed) çalıştırır
npx playwright test --headed

# Belirli bir test dosyasını çalıştırır
npx playwright test tests/login.spec.ts

# Testleri hata ayıklama (Debug) modunda açar
npx playwright test --debug

# Sadece belirli bir tarayıcıda çalıştırır (örn: Chromium)
npx playwright test --project=chromium
```

---

## 📊 Rapor Alma ve Görüntüleme

### 1. Playwright Dahili HTML Raporu
Playwright'ın varsayılan HTML raporunu oluşturmak ve açmak için:

```bash
# HTML raporlayıcısı ile testleri çalıştırın
npx playwright test --reporter=html

# Raporu tarayıcıda görüntüleyin
npx playwright show-report
```

### 2. Allure Raporu
Allure görsel raporlarını üretmek ve görüntülemek için:

```bash
# Allure reporter ile testleri çalıştırın
npx playwright test --reporter=allure-playwright

# Raporu sıfırlayıp yeniden oluşturun
npx allure generate allure-results --clean -o allure-report

# Allure raporunu tarayıcıda açın
npx allure open allure-report
```

---

## 📁 Proje Dizin Yapısı

```text
js-ui-project_basic/
├── pages/                     # Page Object Model (POM) sınıfları
├── tests/                     # Playwright test senaryoları (.spec.ts)
├── utils/                     # Yardımcı metodlar ve veriler
├── .env                       # Ortam değişkenleri (Gizli)
├── playwright.config.ts       # Playwright ana konfigürasyonu
├── tsconfig.json              # TypeScript ayarları
└── package.json               # Proje bağımlılıkları ve komutlar
```

---

## 💡 Önerilen `package.json` Scripts Yapılandırması

Komutları kısaltmak için `package.json` dosyanızdaki `"scripts"` bölümünü aşağıdaki gibi güncelleyebilirsiniz:

```json
"scripts": {
  "test": "playwright test",
  "test:headed": "playwright test --headed",
  "test:debug": "playwright test --debug",
  "report:html": "playwright show-report",
  "report:allure": "allure generate allure-results --clean -o allure-report && allure open allure-report"
}
```

Bu ayarlamadan sonra testlerinizi `npm run test` veya `npm run report:allure` şeklinde çalıştırabilirsiniz.