import {exec} from 'child_process';

// Çalıştırmak istediğin tag'i buraya yazabilirsin
// İstersen boş bırakıp tüm testleri çalıştırabilirsin
const tagName = '@googgay';

// CMD'de çalışacak olan komut
// Windows kullandığın için tırnak işaretlerine (escape) dikkat ediyoruz
const command = `npx playwright test --grep "${tagName}"`;

console.log(`🚀 Test başlatılıyor... Komut: ${command}\n`);

exec(command, (error, stdout, stderr) => {
    // Cucumber çıktısını konsola yazdır
    if (stdout) {
        console.log(stdout);
    }

    // Hata çıktısı varsa (genelde uyarılar buraya düşer) yazdır
    if (stderr) {
        console.error(stderr);
    }

    // Komut bittiğinde (hata ile veya başarılı) mesaj ver
    if (error) {
        console.error(`\n❌ Testler çalışırken hata oluştu: ${error.message}`);
        process.exit(1); // Hata kodu ile çık
    } else {
        console.log(`\n✅ Testler başarıyla tamamlandı!`);
    }
});