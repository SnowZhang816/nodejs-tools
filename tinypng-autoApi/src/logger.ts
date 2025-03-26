/*
 * @Author: 炒粉 380304468@qq.com
 * @Date: 2024-06-06 15:48:02
 * @LastEditors: 曾文煊 zengwenxuan@dele.com
 * @LastEditTime: 2024-10-28 10:33:38
 * @FilePath: \tinypng-autoApi\src\logger.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import winston from 'winston';
import 'winston-daily-rotate-file';

const consoleTransport = new winston.transports.Console({
    format: winston.format.combine(winston.format.colorize(), winston.format.simple())
});
const dailyRotateFileTransport = new winston.transports.DailyRotateFile({
    dirname: 'logs',
    filename: `%DATE%`, // 自定义文件名模板
    datePattern: 'YYYY-MM-DD',
    maxSize: `1m`, // 每个文件最大 1m
    format: winston.format.combine(winston.format.uncolorize(), winston.format.json()),
    extension: '.log' // 确保文件扩展名为 .log
});
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' })),
    transports: [consoleTransport, dailyRotateFileTransport],
    // 所有未捕获的异常都将被记录到 'error.log' 文件中
    exceptionHandlers: [
        new winston.transports.File({
            filename: 'error.log'
        })
    ],
    // 所有未处理的 Promise 拒绝都将被记录到 'rejections.log' 文件中
    rejectionHandlers: [
        new winston.transports.File({
            filename: 'rejections.log'
        })
    ],
    exitOnError: false // 不要在写入日志时让进程退出
});
// setInterval(() => {
//   logger.info(`tes22222222t`);
// }, 1000);
// setTimeout(() => {
//   process.exit(0);
// }, 5000);
export default logger;
