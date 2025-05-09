"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mailTempNet_1 = __importDefault(require("./emailCreator/mailTempNet"));
const mailTM_1 = __importDefault(require("./emailCreator/mailTM"));
const mailCX_1 = __importDefault(require("./emailCreator/mailCX"));
/** https://10minemail.com/ */
/** https://www.minuteinbox.com/ */
/** 邮箱工具类 */
class MailUtil {
    constructor() {
        /**
         * 邮箱提供商列表
         * @param active 是否启用该邮箱提供商
         */
        this.mailProviderList = [
            { active: false, provider: mailTempNet_1.default },
            { active: true, provider: mailTM_1.default },
            { active: false, provider: mailCX_1.default }
        ];
        this.mailProvider = this.mailProviderList.find((e) => e.active).provider;
    }
    /** 获取邮箱 */
    async getMailAddress() {
        let email = await this.mailProvider.getMailAddress();
        return email;
    }
    /** 获取激活链接 */
    async getActiveLink() {
        let link = await this.mailProvider.getActiveLink();
        return link;
    }
}
const mailUtil = new MailUtil();
exports.default = mailUtil;
