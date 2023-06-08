"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var winston_1 = require("winston");
var transports = [
    new winston_1.default.transports.File({
        filename: 'error.log',
        level: 'error'
    }),
    new winston_1.default.transports.File({
        filename: 'combined.log',
        level: 'verbose'
    }),
];
if (process.env.NODE_ENV !== 'production') {
    transports.push(new winston_1.default.transports.Console());
}
var logger = winston_1.default.createLogger({
    transports: transports,
    level: 'info',
    format: winston_1.default.format.json()
});
exports.default = logger;
