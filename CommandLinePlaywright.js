const readline = require('readline');
const { exec } = require('child_process');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function showMenu() {
    console.clear();
    console.log('==================== PLAYWRIGHT KOMUTLARI ====================');
    console.log('');
    console.log('1. Test UI\'ı aç (npx playwright test --ui)');
    console.log('2. Codegen başlat (npx playwright codegen https://qa.instulearn.com)');
    console.log('3. Tüm testleri çalıştır (npx playwright test)');
    console.log('4. Belirli testi çalıştır');
    console.log('5. Report aç (npx playwright show-report)');
    console.log('6. Debug modda test çalıştır (npx playwright test --debug)');
    console.log('0. Çıkış');
    console.log('');
    console.log('================================================================');
}

function runCommand(command) {
    console.log(`\nÇalıştırılıyor: ${command}`);
    console.log('------------------------------------------------');

    const child = exec(command, { stdio: 'inherit' });

    child.on('exit', (code) => {
        console.log('------------------------------------------------');
        console.log(`Komut tamamlandı! (Exit code: ${code})`);
        console.log('\nDevam etmek için Enter\'a basın...');
        process.stdin.once('data', () => {
            main();
        });
    });
}

function main() {
    showMenu();
    rl.question('Seçiminiz: ', (answer) => {
        switch(answer) {
            case '1':
                runCommand('npx playwright test --ui');
                break;
            case '2':
                runCommand('npx playwright codegen https://qa.instulearn.com');
                break;
            case '3':
                runCommand('npx playwright test');
                break;
            case '4':
                rl.question('Test dosyasını girin (örnek: login.spec.ts): ', (testFile) => {
                    runCommand(`npx playwright test ${testFile}`);
                });
                break;
            case '5':
                runCommand('npx playwright show-report');
                break;
            case '6':
                runCommand('npx playwright test --debug');
                break;
            case '0':
                console.log('Çıkış yapılıyor...');
                rl.close();
                process.exit(0);
                break;
            default:
                console.log('Geçersiz seçim!');
                setTimeout(main, 1500);
                break;
        }
    });
}

main();