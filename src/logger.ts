import winston from 'winston'

let transports : winston.transports.FileTransportInstance[] = [
    new winston.transports.File({
        filename: 'error.log',
        level: 'error'
    }),
    new winston.transports.File({
        filename: 'combined.log',
        level: 'verbose'
    }),
]

if (process.env.NODE_ENV !== 'production') {
    transports.push(
        (new winston.transports.Console() as any)
    )
}

const logger = winston.createLogger({
    transports,
    level: 'info',
    format: winston.format.combine(
        winston.format.errors({ stack: true }),
        winston.format.colorize(),
        winston.format.timestamp({format:'YYYY-MM-DD HH:mm:ss'}),
        winston.format.printf(({ level, message, timestamp, stack }) => {
            if (stack) {
                // print log trace
                return `${timestamp} ${level}: ${message}\n${stack}`;
            }
            return `${timestamp} ${level}: ${message}`;
        }),
    )
})

export default logger