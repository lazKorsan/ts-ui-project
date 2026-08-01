# Playwright Komutları için PowerShell Script
param(
    [string]$komut
)

function Show-Menu {
    Clear-Host
    Write-Host "==================== PLAYWRIGHT KOMUTLARI ===================="
    Write-Host ""
    Write-Host "1. Test UI'ı aç (npx playwright test --ui)"
    Write-Host "2. Codegen başlat (npx playwright codegen https://qa.instulearn.com)"
    Write-Host "3. Tüm testleri çalıştır (npx playwright test)"
    Write-Host "4. Belirli testi çalıştır"
    Write-Host "5. Report aç (npx playwright show-report)"
    Write-Host "0. Çıkış"
    Write-Host ""
    Write-Host "================================================================"
}

function Run-Command {
    param([string]$cmd)
    Write-Host "`nÇalıştırılıyor: $cmd" -ForegroundColor Green
    Write-Host "------------------------------------------------"
    Invoke-Expression $cmd
    Write-Host "------------------------------------------------"
    Write-Host "Komut tamamlandı!" -ForegroundColor Green
    Read-Host "`nDevam etmek için Enter'a basın..."
}

# Ana program
do {
    Show-Menu
    $secim = Read-Host "Seçiminiz"

    switch ($secim) {
        "1" {
            Run-Command "npx playwright test --ui"
        }
        "2" {
            Run-Command "npx playwright codegen https://qa.instulearn.com"
        }
        "3" {
            Run-Command "npx playwright test"
        }
        "4" {
            $testAdi = Read-Host "Test dosyası adını girin (örnek: login.spec.ts)"
            Run-Command "npx playwright test $testAdi"
        }
        "5" {
            Run-Command "npx playwright show-report"
        }
        "0" {
            Write-Host "Çıkış yapılıyor..." -ForegroundColor Yellow
        }
        default {
            Write-Host "Geçersiz seçim!" -ForegroundColor Red
            Read-Host "Devam etmek için Enter'a basın..."
        }
    }
} while ($secim -ne "0")