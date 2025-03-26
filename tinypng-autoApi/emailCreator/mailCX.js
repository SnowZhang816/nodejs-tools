"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/*
 * @Author: 曾文煊 zengwenxuan@dele.com
 * @Date: 2024-10-18 09:57:33
 * @LastEditors: 曾文煊 zengwenxuan@dele.com
 * @LastEditTime: 2024-10-28 10:30:19
 * @FilePath: \casino-client\tools\tinypng-autoApi\src\emailCreator\mailCX.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
/*
 * @Author: 炒粉 380304468@qq.com
 * @Date: 2024-01-03 17:17:42
 * @LastEditors: 炒粉 380304468@qq.com
 * @LastEditTime: 2024-10-12 16:36:32
 * @FilePath: \tinypng-autoApi\src\emailCreator\mailTM.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
const axios_1 = __importDefault(require("axios"));
const logger_1 = __importDefault(require("../logger"));
const mailBase_1 = __importDefault(require("./mailBase"));
/** 临时邮箱 https://api.mail.cx */
class MailCX extends mailBase_1.default {
    constructor() {
        super(...arguments);
        this.host = `https://api.mail.cx/api/v1`;
        this.mailHosts = ['@qabq.com', '@nqmo.com', '@end.tw', '@uuf.me', '@yzm.de'];
        this.userData = {
            email: 'HkH3cE5yCa@qabq.com',
            auth: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3Mjg2MzA0MDl9.yeBOkNtS3n50vABLserbYx5YZ5C6UdB_aRqhVcPgQ-8'
        };
    }
    /**
     * 生成随机字符串
     *
     * @param length 生成随机字符串的长度，默认为10
     * @returns 返回生成的随机字符串
     */
    generateRandomString(length = 10) {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        return Array.from({ length }, () => characters[Math.floor(Math.random() * characters.length)]).join('');
    }
    async getToken() {
        const res = await axios_1.default.post(`${this.host}/auth/authorize_token`);
        return res.data;
    }
    /** 注册临时邮箱 */
    async getMailAddress() {
        logger_1.default.info(`注册临时邮箱`);
        let token = await this.getToken();
        let Authorization = `Bearer ${token}`;
        console.log(Authorization);
        this.userData.auth = Authorization;
        let user = this.generateRandomString();
        for (let i = 0; i < this.mailHosts.length; i++) {
            let _email = user + this.mailHosts[i];
            let res = await axios_1.default.get(`${this.host}/mailbox/${_email}`, {
                headers: { Authorization }
            });
            console.log(res.data);
            if (res === null || res === void 0 ? void 0 : res.data) {
                this.userData.email = _email;
                logger_1.default.info(`注册的邮箱为:${this.userData.email}`);
                break;
            }
        }
        return this.userData.email;
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
        var _a;
        let res = await axios_1.default.get(`${this.host}/mailbox/${this.userData.email}`, {
            headers: { Authorization: this.userData.auth }
        });
        let list = (_a = res === null || res === void 0 ? void 0 : res.data) === null || _a === void 0 ? void 0 : _a.filter((e) => e.seen === false);
        return list;
    }
    /**
     * 从邮箱提取激活链接
     * @param mailId 邮件id
     * @returns
     */
    async getLinkUrlFromMessage(mailId) {
        var _a, _b, _c;
        let res = await axios_1.default.get(`${this.host}/mailbox/${this.userData.email}/${mailId}`, {
            headers: { Authorization: this.userData.auth }
        });
        let content = (_b = (_a = res === null || res === void 0 ? void 0 : res.data) === null || _a === void 0 ? void 0 : _a.body) === null || _b === void 0 ? void 0 : _b.text;
        let url = (_c = content === null || content === void 0 ? void 0 : content.match(/https:\/\/tinypng.com\/login.*redirect=\/dashboard\/api/)) === null || _c === void 0 ? void 0 : _c[0];
        if (url) {
            return url;
        }
        return ``;
    }
}
const mailCx = new MailCX();
// mailCx.getMailAddress();
// mailCx.getLinkUrlFromMessage(`20241011T070239-5748`);
exports.default = mailCx;
