import winston from 'winston';

export const logger = winston.createLogger({
    level: 'info', // Sadece info, warn ve error loglarını yazar
    format: winston.format.combine(
        // Logun başına tarih ve saat ekler (Log4j Pattern gibi)
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.printf(({ timestamp, level, message }) => {
            return `[${timestamp}] [${level.toUpperCase()}]: ${message}`;
        })
    ),
    transports: [
        // 1. Logları terminal ekranında anlık görmek için:
        new winston.transports.Console(),

        // 2. Logları "test-kayitlari.txt" dosyasına alt alta ekleyerek yazmak için:
        new winston.transports.File({ filename: 'test-kayitlari.txt' })
    ]
});
