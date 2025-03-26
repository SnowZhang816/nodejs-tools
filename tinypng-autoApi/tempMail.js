"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mailjs_1 = __importDefault(require("@cemalgnlts/mailjs"));
const mailjs = new mailjs_1.default();
/** 邮箱工具类 */
class TempMailUtil {
    /** 注册临时邮箱 */
    async createTempMail() {
        console.log(`注册临时邮箱`);
        const acc = await mailjs.createOneAccount();
        // If there is a error.
        if (!acc.status) {
            // Show the cause of the error.
            console.error(acc.message);
            return { username: '', password: '' };
        }
        console.log(acc.data);
        return acc.data;
    }
    /** 获取临时邮箱邮件列表 */
    async getMessages() {
        let data = await mailjs.getMessages();
        if (!data.status) {
            console.error(data.message);
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
exports.default = new TempMailUtil();
// main();
// getMessages().then((e) => {
//   console.log(e);
// });
// TinifyUtil.getKeys(`Bearer NzW8jfTCKXF3nBpbttGlnB6B8blL0gZHPpqxGFSYmKk6VsX6`);
