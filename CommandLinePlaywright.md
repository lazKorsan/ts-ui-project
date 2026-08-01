# Playwright Komutları

## Kullanım
Bu dosyadaki komutları çalıştırmak için aşağıdaki adımları izleyin:

### Windows PowerShell
```powershell
# PowerShell'de çalıştır
.\CommandLinePlaywright.ps1
```

### Windows Batch
```cmd
# Command Prompt'da çalıştır
CommandLinePlaywright.bat
```

### Node.js
```bash
node CommandLinePlaywright.js
```

## Mevcut Komutlar

### 1. Test UI'ı Aç
```bash
npx playwright test --ui
```

### 2. Codegen Başlat
```bash
npx playwright codegen https://qa.instulearn.com
```

### 3. Tüm Testleri Çalıştır
```bash
npx playwright test
```

### 4. Belirli Testi Çalıştır
```bash
# Örnek: login.spec.ts dosyasını çalıştır
npx playwright test login.spec.ts

# Örnek: Belirli bir testi çalıştır (test adı ile)
npx playwright test -g "login test"
```

### 5. Report Aç
```bash
npx playwright show-report
```

### 6. Debug Modda Test Çalıştır
```bash
npx playwright test --debug
```

### 7. Headed Modda Test Çalıştır (Browser görünür)
```bash
npx playwright test --headed
```

### 8. Belirli Browser'da Test Çalıştır
```bash
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
```