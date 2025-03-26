export default class MailBase {
    /** 获取邮箱地址 */
    async getMailAddress(): Promise<string> {
        return new Promise((resolve) => {
            resolve('');
        });
    }
    /** 获取邮箱中的激活链接 */
    async getActiveLink(): Promise<string> {
        return new Promise((resolve) => {
            resolve('');
        });
    }
}
