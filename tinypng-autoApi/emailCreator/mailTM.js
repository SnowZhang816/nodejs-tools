"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/*
 * @Author: 炒粉 380304468@qq.com
 * @Date: 2024-01-03 17:17:42
 * @LastEditors: 炒粉 380304468@qq.com
 * @LastEditTime: 2024-10-12 16:37:19
 * @FilePath: \tinypng-autoApi\src\emailCreator\mailTM.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
const mailjs_1 = __importDefault(require("@cemalgnlts/mailjs"));
const logger_1 = __importDefault(require("../logger"));
const mailBase_1 = __importDefault(require("./mailBase"));
const mailjs = new mailjs_1.default();
/** 临时邮箱 https://docs.mail.tm */
class MailTM extends mailBase_1.default {
    /** 注册临时邮箱 */
    async getMailAddress() {
        try {
            logger_1.default.info(`注册临时邮箱`);
            const acc = await mailjs.createOneAccount();
            console.log(acc);
            // If there is a error.
            if (!(acc === null || acc === void 0 ? void 0 : acc.status)) {
                logger_1.default.error(JSON.stringify(acc));
                // Show the cause of the error.
                logger_1.default.error(acc.message);
                return '';
            }
            logger_1.default.info(JSON.stringify(acc.data));
            return acc.data.username;
        }
        catch (error) {
            console.log(error);
        }
        return '';
    }
    /** 提取链接 */
    async getActiveLink() {
        // 轮询提取邮件
        return new Promise((res) => {
            let loop = () => {
                setTimeout(async () => {
                    let list = await this.getMessages();
                    if (!list.length) {
                        loop();
                        return;
                    }
                    for (let msg of list) {
                        // 从邮箱提取激活链接
                        let url = await this.getLinkUrlFromMessage(msg.id);
                        console.log(`从邮箱提取激活链接:${url}`);
                        if (!url)
                            continue;
                        res(url);
                    }
                }, 2000);
            };
            loop();
        });
    }
    /** 获取临时邮箱邮件列表 */
    async getMessages() {
        let data = await mailjs.getMessages();
        if (!data.status) {
            logger_1.default.error(data.message);
        }
        return data.data;
    }
    /**
     * 从邮箱提取激活链接
     * @param mailId 邮件id
     * @returns
     */
    async getLinkUrlFromMessage(mailId) {
        var _a;
        let res = await mailjs.getSource(mailId);
        if (!res.status)
            return null;
        let mailContent = res.data.data;
        let url = (_a = mailContent.match(/https:\/\/tinypng.com\/login.*redirect=\/dashboard\/api/)) === null || _a === void 0 ? void 0 : _a[0];
        if (url) {
            return url;
        }
        return null;
    }
}
const mailTm = new MailTM();
// mailTm.getMailAddress();
exports.default = mailTm;
// main();
// getMessages().then((e) => {
//   logger.info(e);
// });
// TinifyUtil.getKeys(`Bearer NzW8jfTCKXF3nBpbttGlnB6B8blL0gZHPpqxGFSYmKk6VsX6`);
