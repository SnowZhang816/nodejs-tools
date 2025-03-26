"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class MailBase {
    /** 获取邮箱地址 */
    async getMailAddress() {
        return new Promise((resolve) => {
            resolve('');
        });
    }
    /** 获取邮箱中的激活链接 */
    async getActiveLink() {
        return new Promise((resolve) => {
            resolve('');
        });
    }
}
exports.default = MailBase;
