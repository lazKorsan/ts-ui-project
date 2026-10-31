// LoggerHelper.ts
import * as fs from 'fs';
import * as path from 'path';

// ANSI Renk Kodları
const ANSI = {
    RESET: "\x1b[0m",
    BOLD: "\x1b[1m",
    RED: "\x1b[31m",
    GREEN: "\x1b[32m",
    YELLOW: "\x1b[33m",
    BLUE: "\x1b[34m",
    CYAN: "\x1b[36m",
    MAGENTA: "\x1b[35m",
    BG_RED: "\x1b[41m",
    BG_GREEN: "\x1b[42m"
};

export class LoggerHelper {

    // ─────────────────────────────────────────────
    // Dosya yazma altyapısı
    // ─────────────────────────────────────────────

    // Klasör ve dosya yolunu dinamik getiren metod
    private static getLogFilePath(): string {
        const logDir = path.resolve(process.cwd(), 'logs');

        // Klasör yoksa anında oluşturur
        if (!fs.existsSync(logDir)) {
            fs.mkdirSync(logDir, { recursive: true });
        }

        return path.join(logDir, 'execution.log');
    }

    // ANSI renk kodlarını metinden temizler (dosyada bozuk karakter görünmesin)
    private static stripAnsi(text: string): string {
        return text.replace(/\x1b\[[0-9;]*m/g, '');
    }

    // Hata nesnesini okunabilir metne çevirir (stack varsa onu kullanır)
    private static formatError(error: any): string {
        if (!error) return '';
        if (error instanceof Error) return error.stack || error.message;
        return String(error);
    }

    // Logu dosyaya yazan private yardımcı metod
    private static writeToFile(level: string, message: string): void {
        try {
            const filePath = LoggerHelper.getLogFilePath();
            const timestamp = new Date().toISOString();
            const cleanMessage = LoggerHelper.stripAnsi(message);
            const logLine = `[${timestamp}] [${level}] ${cleanMessage}\n`;

            // Dosyanın sonuna ekler (Dosya yoksa kendisi otomatik oluşturur)
            fs.appendFileSync(filePath, logLine, 'utf-8');
        } catch (error) {
            // Log yazma hatası testi bozmasın
            console.error("Log dosyasına yazılırken hata oluştu:", error);
        }
    }

    // Senaryo başlangıç zamanı (süre hesabı için, konsola yazdırılmaz)
    private static scenarioStartTime: number | null = null;

    // Milisaniyeyi okunabilir süreye çevirir (örn: "850 ms", "12.4 sn", "1 dk 5.2 sn")
    private static formatDuration(ms: number): string {
        if (ms < 1000) return `${ms} ms`;
        const totalSeconds = ms / 1000;
        if (totalSeconds < 60) return `${totalSeconds.toFixed(1)} sn`;
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = (totalSeconds % 60).toFixed(1);
        return `${minutes} dk ${seconds} sn`;
    }

    // ─────────────────────────────────────────────
    // Ana log metodları (hem konsola hem dosyaya yazar)
    // ─────────────────────────────────────────────

    static logScenarioStart(scenarioName: string, tags?: string, featureFileName?: string): void {
        LoggerHelper.scenarioStartTime = Date.now();

        console.log(`\n${ANSI.BLUE}════════════════════════════════════════════════════════════════${ANSI.RESET}`);
        if (featureFileName) {
            console.log(`📂 ${ANSI.BOLD}${ANSI.BLUE}FEATURE:${ANSI.RESET} ${ANSI.CYAN}${featureFileName}${ANSI.RESET}`);
        }
        console.log(`📋 ${ANSI.BOLD}${ANSI.BLUE}TEST SENARYOSU BAŞLIYOR:${ANSI.RESET} ${ANSI.CYAN}${scenarioName}${ANSI.RESET}`);
        if (tags) {
            console.log(`📌 ${ANSI.BOLD}${ANSI.BLUE}TAGS:${ANSI.RESET} ${ANSI.YELLOW}${tags}${ANSI.RESET}`);
        }
        console.log(`${ANSI.BLUE}════════════════════════════════════════════════════════════════${ANSI.RESET}`);

        // Dosyaya tek satır olarak yaz
        const parts: string[] = [];
        if (featureFileName) parts.push(`FEATURE: ${featureFileName}`);
        parts.push(`TEST SENARYOSU BAŞLIYOR: ${scenarioName}`);
        if (tags) parts.push(`TAGS: ${tags}`);
        LoggerHelper.writeToFile('SCENARIO_START', parts.join(' | '));
    }

    static logStep(stepText: string, stepNumber?: number): void {
        const stepLabel = stepNumber ? `STEP ${stepNumber}` : 'STEP';
        console.log(
            `▶️  ${ANSI.BOLD}${ANSI.BLUE}[${stepLabel}]:${ANSI.RESET} ${ANSI.CYAN}${stepText}${ANSI.RESET}`
        );
        LoggerHelper.writeToFile('STEP', `[${stepLabel}] ${stepText}`);
    }

    // Başarılı Adım / Bilgi Logu
    static logSuccess(message: string): void {
        console.log(`✅ ${ANSI.BOLD}${ANSI.GREEN}[PASS]:${ANSI.RESET} ${ANSI.GREEN}${message}${ANSI.RESET}`);
        LoggerHelper.writeToFile('PASS', message);
    }

    // Genel Info Logu
    static logInfo(message: string): void {
        console.log(`ℹ️  ${ANSI.BOLD}${ANSI.CYAN}[INFO]:${ANSI.RESET} ${message}`);
        LoggerHelper.writeToFile('INFO', message);
    }

    // Uyarı Logu (Örn: Yavaş Step)
    static logWarn(message: string): void {
        console.log(`⚠️  ${ANSI.BOLD}${ANSI.YELLOW}[WARN]:${ANSI.RESET} ${ANSI.YELLOW}${message}${ANSI.RESET}`);
        LoggerHelper.writeToFile('WARN', message);
    }

    // Hata Logu
    static logError(message: string, error?: any): void {
        console.log(`❌ ${ANSI.BOLD}${ANSI.RED}[FAIL]:${ANSI.RESET} ${ANSI.RED}${message}${ANSI.RESET}`);
        if (error) {
            console.error(`${ANSI.RED}${error}${ANSI.RESET}`);
        }

        const errorText = LoggerHelper.formatError(error);
        LoggerHelper.writeToFile('FAIL', errorText ? `${message} | ${errorText}` : message);
    }

    // Senaryo Bitiş Logu
    static logScenarioEnd(scenarioName: string, isPassed: boolean): void {
        // Geçen süreyi hesapla (başlangıç kaydedilmediyse süre gösterilmez)
        const duration = LoggerHelper.scenarioStartTime !== null
            ? LoggerHelper.formatDuration(Date.now() - LoggerHelper.scenarioStartTime)
            : null;
        LoggerHelper.scenarioStartTime = null;

        console.log(`${ANSI.BLUE}----------------------------------------------------------------${ANSI.RESET}`);
        if (isPassed) {
            console.log(`🎉 ${ANSI.BOLD}${ANSI.GREEN}SENARYO BAŞARIYLA TAMAMLANDI:${ANSI.RESET} ${ANSI.GREEN}${scenarioName}${ANSI.RESET}`);
        } else {
            console.log(`💥 ${ANSI.BOLD}${ANSI.RED}SENARYO BAŞARISIZ OLDU:${ANSI.RESET} ${ANSI.RED}${scenarioName}${ANSI.RESET}`);
        }
        if (duration) {
            console.log(`⏱️  ${ANSI.BOLD}${ANSI.BLUE}SÜRE:${ANSI.RESET} ${ANSI.YELLOW}${duration}${ANSI.RESET}`);
        }
        console.log(`${ANSI.BLUE}════════════════════════════════════════════════════════════════\n${ANSI.RESET}`);

        const resultText = isPassed
            ? `SENARYO BAŞARIYLA TAMAMLANDI: ${scenarioName}`
            : `SENARYO BAŞARISIZ OLDU: ${scenarioName}`;
        LoggerHelper.writeToFile('SCENARIO_END', duration ? `${resultText} | SÜRE: ${duration}` : resultText);
    }
}
