import * as winston from 'winston';
import * as path from 'path'; // Klasör yollarını güvenli yönetmek için ekledik

export const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.printf(({ timestamp, level, message }) => {
            return `[${timestamp}] [${level.toUpperCase()}]: ${message}`;
        })
    ),
    transports: [
        new winston.transports.Console(),

        // DEĞİŞİKLİK: Logları artık proje kök dizinindeki logs klasörünün altına yazar
        new winston.transports.File({
            filename: path.join(process.cwd(), 'logs', 'test-kayitlari.txt')
        })
    ]
});
